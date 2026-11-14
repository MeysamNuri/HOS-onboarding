import { useEffect, useRef, useState } from "react";
import { observeElementSize } from "@/core/helper/observeElementSize";
import { Button, Typography } from "antd";
import {
    DownloadOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
} from "@ant-design/icons";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import "./styles/PdfPreview.scss";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfViewerProps {
    fileUrl: () => string;
    height?: number | string;
    showToolbar?: boolean;
    className?: string;
}

interface PdfLoadSuccess {
    numPages: number;
}

const PdfViewer = ({
    fileUrl,
    height = 500,
    showToolbar = true,
    className = "",
}: PdfViewerProps) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfFile, setPdfFile] = useState<Blob | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [pageWidth, setPageWidth] = useState<number>(0);
    const contentRef = useRef<HTMLDivElement>(null);

    /**
     * Get PDF URL from function
     */
    const file = fileUrl();

    /**
     * Fetch PDF
     */
    useEffect(() => {
        let cancelled = false;

        const fetchPdf = async (): Promise<void> => {
            setLoading(true);
            setError(false);
            setPdfFile(null);
            setNumPages(null);

            if (!file) {
                setLoading(false);
                setError(true);
                return;
            }

            try {
                const response = await fetch(file);

                if (!response.ok) {
                    throw new Error(
                        `PDF request failed: ${response.status}`
                    );
                }

                const blob = await response.blob();

                if (cancelled) {
                    return;
                }

                setPdfFile(blob);

                // Fetch successfully completed
                setLoading(false);
                setError(false);
            } catch (err) {
                if (cancelled) {
                    return;
                }
                console.log(err);
                setPdfFile(null);
                setLoading(false);
                setError(true);
            }
        };

        fetchPdf();

        return () => {
            cancelled = true;
        };
    }, [file]);

    /**
     * Fullscreen state
     */
    useEffect(() => {
        const handleFullscreenChange = (): void => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    useEffect(() => {
        const content = contentRef.current;

        if (!content) {
            return;
        }

        const updatePageWidth = (): void => {
            const styles = window.getComputedStyle(content);
            const horizontalPadding =
                Number.parseFloat(styles.paddingLeft) +
                Number.parseFloat(styles.paddingRight);

            setPageWidth(Math.max(content.clientWidth - horizontalPadding, 0));
        };

        updatePageWidth();

        return observeElementSize(content, updatePageWidth);
    }, []);

    /**
     * Enter / Exit fullscreen
     */
    const handleFullscreen = async (): Promise<void> => {
        const element = document.querySelector(
            ".pdf-preview"
        ) as HTMLElement | null;

        if (!element) {
            return;
        }

        try {
            if (!document.fullscreenElement) {
                await element.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    /**
     * Download PDF
     */
    const handleDownload = (): void => {
        if (!file) {
            return;
        }

        const link = document.createElement("a");

        link.href = file;
        link.download = "document.pdf";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * PDF document successfully parsed
     */
    const handleDocumentLoadSuccess = ({
        numPages,
    }: PdfLoadSuccess): void => {
        setNumPages(numPages);
    };

    /**
     * PDF parsing error
     */
    const handleDocumentLoadError = (): void => {
        setLoading(false);
        setError(true);
    };

    return (
        <div
            className={`
                pdf-preview
                ${isFullscreen ? "pdf-preview--fullscreen" : ""}
                ${className}
            `}
            style={{
                height: isFullscreen ? "100vh" : height,
            }}
        >
            {/* PDF Content */}
            <div ref={contentRef} className="pdf-preview__content">
                {/* Loading */}
                {loading && !error && (
                    <div className="pdf-preview__loading">
                     <AjaxLoadingComponent />

                        <Typography.Text>
                            در حال بارگذاری فایل...
                        </Typography.Text>
                    </div>
                )}

                {/* Error */}
                {error ? (
                    <div className="pdf-preview__error">
                        <Typography.Text type="danger">
                            خطا در بارگذاری فایل PDF
                        </Typography.Text>

                        <Button
                            type="link"
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            باز کردن فایل در مرورگر
                        </Button>
                    </div>
                ) : (
                    pdfFile && (
                        <div className="pdf-preview__document">
                            <Document
                                file={pdfFile}
                                onLoadSuccess={
                                    handleDocumentLoadSuccess
                                }
                                onLoadError={
                                    handleDocumentLoadError
                                }
                            >
                                {Array.from(
                                    new Array(numPages || 0),
                                    (_, index) => (
                                        <div
                                            className="pdf-preview__page"
                                            key={index}
                                        >
                                            <Page
                                                pageNumber={index + 1}
                                                width={pageWidth}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={
                                                    false
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </Document>
                        </div>
                    )
                )}
            </div>

            {/* Toolbar */}
            {showToolbar && (
                <div className="pdf-preview__toolbar">
                    <div className="pdf-preview__actions">
                        {/* Fullscreen */}
                        <Button
                            type="text"
                            icon={
                                isFullscreen ? (
                                    <FullscreenExitOutlined />
                                ) : (
                                    <FullscreenOutlined />
                                )
                            }
                            onClick={handleFullscreen}
                            aria-label={
                                isFullscreen
                                    ? "Exit fullscreen"
                                    : "Fullscreen"
                            }
                        />

                        {/* Download */}
                        <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                            aria-label="Download PDF"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfViewer;
