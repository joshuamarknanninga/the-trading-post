import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { FiDownload, FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';

const PDFPreview = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'document.pdf';
    link.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.min(2, scale + 0.1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FiZoomIn />
          </button>
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FiZoomOut />
          </button>
          <button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <FiRotateCw />
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
        </div>
        <button
          onClick={downloadPDF}
          className="btn-secondary flex items-center gap-1"
        >
          <FiDownload /> Download
        </button>
      </div>

      <div className="flex justify-center bg-gray-50 p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>

      <div className="flex justify-center gap-2 p-2 border-t">
        <button
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          className="btn-secondary"
        >
          Previous
        </button>
        <button
          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
          disabled={pageNumber >= numPages}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFPreview;