"use client";

import { useState } from 'react';

export default function Page() {

    const [files, setFiles] = useState<File[]>([]);

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const selectedFiles = event.target.files;

        if (selectedFiles) {
            const newFiles: File[] = Array.from(selectedFiles);
            setFiles([...files, ...newFiles]);
        }
    }

    const renderSubmittedFiles = () => {
        return files.map((file, index) => {
            return (
                <div key={index}>
                    <p>{file.name}</p>
                </div>
            );
        });
    }

    return (
        <div>
            <input
                type="file"
                onChange={handleFileSelection}
                multiple
            />
            {renderSubmittedFiles()}
        </div>
    );
}