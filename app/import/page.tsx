"use client";

import { useState } from 'react';
import { jsonIsValid, HISTORY } from '@/lib/files/validate_json';
import axios from 'axios';

export default function Page() {

    const VALID = 0;
    const INVALID = 1;
    const DUPLICATE = 2;

    const [files, setFiles] = useState<{valid: File[], invalid: string[], duplicate: string[]}>({
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
                        file: file,
                        status: DUPLICATE,
                    }
                }

                try {
                    const isValid = await jsonIsValid(file, HISTORY);
                    if (isValid) {
                        return {
                            file: file,
                            status: VALID,
                        };
                    } else {
                        return {
                            file: file,
                            status: INVALID,
                        };
                    }
                } catch (error) {
                    return {
                        file: file,
                        status: INVALID,
                    };
                }
            });

            Promise.all(promises)
                .then((results) => {
                    const validFiles: File[] = results
                                                .filter((result) => result.status === VALID)
                                                .map((result) => result.file);
                    const invalidFiles: string[] = results
                                                .filter((result) => result.status === INVALID)
                                                .map((result) => result.file.name);
                    const duplicateFiles: string[] = results
                                                .filter((result) => result.status === DUPLICATE)
                                                .map((result) => result.file.name);
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
            const fileContents = await file.text();
            const fileObject = JSON.parse(fileContents);
            return axios.post('/import/upload', fileObject);
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
                {`Files ${files.invalid.join(', ')} are invalid.`}
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
                {`Files ${files.duplicate.join(', ')} are duplicates.`}
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