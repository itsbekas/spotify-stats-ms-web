"use client";

import { useState } from 'react';
import { jsonIsValid } from '@/lib/files/validate_json';

export default function Page() {

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
                    return file.name;
                }

                try {
                    const isValid = await jsonIsValid(file, schemaFile);
                    if (isValid) {
                        return file;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error validating file: ", file.name, error);
                    return null;
                }
            });

            Promise.all(promises)
                .then((results) => {
                    // TODO: fix types and finish this + testing
                    // FIXME: maybe return everything as files and get the name from the file object
                    const validFiles: File[] = results.filter((file) => file !== null && typeof file !== "string");
                    const invalidFiles: string[] = results.filter((file) => file === null);
                    const duplicateFiles: string[] = results.filter((file) => typeof file === "string");

                    setFiles({
                        valid: [...files.valid, ...validFiles],
                        invalid: [...files.invalid, ...invalidFiles],
                        duplicate: [...files.duplicate, ...duplicateFiles]
                    });
                });
        }
    }

    const renderSubmittedFiles = () => {
        return files.valid.map((file, index) => {
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
                <p>{`File${files.invalid.length === 1 ? "s" : ""} ${files.invalid.join(', ')} are invalid.`}</p>
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
                <p>{`File${files.duplicate.length === 1 ? "s" : ""} ${files.duplicate.join(', ')} are duplicates.`}</p>
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