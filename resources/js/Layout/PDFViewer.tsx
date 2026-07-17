// resources/js/Components/PdfViewer.tsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure the worker (Optionally use the CDN option)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    fileUrl: string;
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
    const [file, setFile] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        if (numPages) {
        setPageNumber((prev) => Math.min(prev + 1, numPages));
        }
    };
    return (
        <>
            <Document 
                file={`/storage/${fileUrl}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-4 text-center">Loading PDF...</div>}
            >
                <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>
            {/* Navigation Controls */}
            {numPages && (
                <div className="flex items-center justify-center gap-4 mt-2 py-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>
                    
                    <p className="text-sm font-medium">
                        Page {pageNumber} of {numPages}
                    </p>
                    
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
}