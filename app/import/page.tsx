"use client";

import { useState } from 'react';
import { jsonIsValid } from '@/lib/files/validate_json';

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
            const schemaFile = require('./schema.json');
            
            const promises = newFiles.map(async (file) => {
                if (files.valid.find((validFile) => validFile.name === file.name)) {
                    return {
                        file: file,
                        status: DUPLICATE,
                    }
                }

                try {
                    const isValid = await jsonIsValid(file, schemaFile);
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
                                                .filter((file) => file.status === VALID)
                                                .map((file) => file.file);
                    const invalidFiles: string[] = results
                                                .filter((file) => file.status === INVALID)
                                                .map((file) => file.file.name);
                    const duplicateFiles: string[] = results
                                                .filter((file) => file.status === DUPLICATE)
                                                .map((file) => file.file.name);
                    setFiles({
                        valid: [...files.valid, ...validFiles],
                        invalid: [...invalidFiles],
                        duplicate: [...duplicateFiles]
                    });
                });
        }
    }

    const renderSubmittedFiles = () => {
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
        </div>
    );
}