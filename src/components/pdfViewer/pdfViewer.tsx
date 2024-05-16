import React, { useCallback, useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs';


import PdfPage from "./pdfPage";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';


type PDFViewerProps = {
    pdfPath: string;
};

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
    const [pages, setPages] = useState<JSX.Element[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);


    // Set worker source to the URL provided by Mozilla
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.min.js';

    const onLoadSuccess = () => {
        console.log(`pdf 로딩 성공`);
        setError(false);
    };

    const onLoadFail = (e: any) => {
        console.log(`pdf 로딩 실패!: ${e}`);
        setError(true);
    };

    const renderPDF = useCallback(
        async (pdfPath: string) => {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfPath);
                const doc = await loadingTask.promise;

                const totalPage = doc.numPages;
                setTotal(totalPage);

                if (totalPage === 0) {
                    throw new Error(`전체 페이지가 0`);
                }

                const pageArr = Array.from(Array(totalPage + 1).keys()).slice(1);
                const allPages = pageArr.map((i) => (
                    <PdfPage doc={doc} page={i} key={i} scale={scale} />
                ));
                setPages(allPages);

                onLoadSuccess();
            } catch (e) {
                onLoadFail(e);
            }
        },
        [scale]
    );

    useEffect(() => {
        renderPDF(pdfPath);
    }, [pdfPath, scale]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "scroll",
            }}
            id="canvas-scroll"
        >
            {pages}
            {error && (
                <div style={{ height: "100%", margin: "5px auto" }}>
                    pdf 로딩에 실패했습니다.
                </div>
            )}
            <div> total: {total}</div>
            <button onClick={() => setScale(scale + 0.5)}>+</button>
            <button onClick={() => setScale(scale - 0.5)}>-</button>
        </div>
    );
};

export default PDFViewer;