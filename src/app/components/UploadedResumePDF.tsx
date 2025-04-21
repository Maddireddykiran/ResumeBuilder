"use client";
import { useState, useEffect } from "react";
import { cx } from "lib/cx";

interface UploadedResumePDFProps {
  fileUrl: string;
}

export const UploadedResumePDF = ({ fileUrl }: UploadedResumePDFProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fileUrl) {
      setLoading(false);
    }
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">No resume uploaded</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-white flex justify-start items-center pl-8">
      {loading && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500">Loading resume...</p>
        </div>
      )}
      <iframe
        src={fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=FitV'}
        className={cx(
          "border-0",
          loading ? "hidden" : "block"
        )}
        onLoad={() => setLoading(false)}
        title="Uploaded Resume"
        style={{ 
          width: '50%', 
          height: '100vh', 
          display: 'block',
          margin: 0,
          padding: 0,
          transform: 'scale(0.95)',
          transformOrigin: 'left center'
        }}
      />
    </div>
  );
};
