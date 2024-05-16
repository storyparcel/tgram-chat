import { PDFDataRangeTransport } from "pdfjs-dist";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type PDFViewerProps = {
    path: string;
    scale: number;
};

const PDFViewer = () => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }


    const onDocumentError = (error: Error) => {
        console.log("pdf viewer error", error);
    };

    return (
        <div>
            <div style={{
                border: 'solid 1px black',
                height: 1000,
                overflow: 'auto',
            }}>
                <Document
                    // file={'drylab.pdf'}
                    // file={'./drylab.pdf'}
                    file={'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'}
                    // file={'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'}
                    // options={options}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentError}
                >
                    {Array.from(new Array(numPages), (_, index) => {
                        return (
                            <Page
                                key={`page_${index + 1}`}
                                // className={styles.page}
                                pageNumber={index + 1}
                                // width={700}
                                renderAnnotationLayer={false}
                                // scale={scale}
                            />
                        );
                    })}
                </Document>
            </div>
        </div>
    );
};

export default PDFViewer;