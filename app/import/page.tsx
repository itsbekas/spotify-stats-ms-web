"use client";

import { useState } from 'react';
import { validateJson, IMPORT } from '@/lib/files/validate_json';
import axios from 'axios';

export default function Page() {

    const VALID = 0;
    const INVALID = 1;
    const DUPLICATE = 2;

    type FileStatus = {
        data: JSON | undefined,
        name: string,
        status: number,
    }

    const [files, setFiles] = useState<{valid: FileStatus[], invalid: FileStatus[], duplicate: FileStatus[]}>({
        valid: [],
        invalid: [],
        duplicate: []
    });

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const selectedFiles = event.target.files;


        if (selectedFiles) {
            const newFiles: File[] = Array.from(selectedFiles);
            
            const promises = newFiles.map(async (file) => {
                if (files.valid.find((validFile) => validFile.name === file.name)) {
                    return {
                        data: undefined,
                        name: file.name,
                        status: DUPLICATE,
                    }
                }

                try {
                    const data: JSON | undefined = await validateJson(file, IMPORT);
                    if (data !== undefined) {
                        return {
                            data: data,
                            name: file.name,
                            status: VALID,
                        };
                    } else {
                        return {
                            data: data,
                            name: file.name,
                            status: INVALID,
                        };
                    }
                } catch (error) {
                    return {
                        data: undefined,
                        name: file.name,
                        status: INVALID,
                    };
                }
            });

            Promise.all(promises)
                .then((results) => {
                    const validFiles: FileStatus[] = results
                                                .filter((result) => result.status === VALID);
                    const invalidFiles: FileStatus[] = results
                                                .filter((result) => result.status === INVALID);
                    const duplicateFiles: FileStatus[] = results
                                                .filter((result) => result.status === DUPLICATE);
                    setFiles({
                        valid: [...files.valid, ...validFiles],
                        invalid: [...invalidFiles],
                        duplicate: [...duplicateFiles]
                    });
                });
        }
    }

    const submitFiles = () => {
        // Submit the file contents to the server as a json object
        const promises = files.valid.map(async (file) => {
            return axios.post('/import/upload', file.data);
        });

        Promise.all(promises)
            .then((results) => {
                console.log(results.map((result) => result));
            });

    }

    const renderSubmittedFiles = () => {
        // Enhance: Regex to capture number at end of file name and sort by that
        return files.valid.sort().map((file, index) => {
            return (
                <div key={index}>
                    <p>{file.name}</p>
                </div>
            );
        });
    }

    const renderInvalidFiles = () => {
        // TODO: Red
        if (files.invalid.length === 0) {
            return null;
        }
        return (
            <div>
                {`Invalid files: ${files.invalid.length}`} <br />
            </div>
        )
    }

    const renderDuplicateFiles = () => {
        // TODO: Yellow
        if (files.duplicate.length === 0) {
            return null;
        }
        return (
            <div>
                {`Duplicate files: ${files.duplicate.length}`} <br />
            </div>
        )
    }

    return (
        <div>
            <input
                type="file"
                onChange={handleFileSelection}
                multiple
                accept=".json"
            />
            {renderSubmittedFiles()}
            {renderInvalidFiles()}
            {renderDuplicateFiles()}
            <button onClick={submitFiles}>Submit</button>
        </div>
    );
}