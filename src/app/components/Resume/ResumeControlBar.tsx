"use client";
import { useEffect, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const [isDownloading, setIsDownloading] = useState(false);

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center">
      <a
        className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm transition-all duration-300 shadow-lg ${
          isDownloading 
            ? "bg-green-500 text-white w-40 justify-center" 
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl transform hover:scale-105"
        }`}
        href={instance.url!}
        download={fileName}
        onClick={handleDownloadClick}
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          <ArrowDownTrayIcon 
            className={`h-5 w-5 transition-transform duration-300 absolute ${
              isDownloading ? "translate-y-5" : "translate-y-0"
            }`} 
          />
          <ArrowDownTrayIcon
            className={`h-5 w-5 transition-transform duration-300 absolute ${
              isDownloading ? "translate-y-0" : "-translate-y-5"
            }`}
          />
        </div>
        <span className="whitespace-nowrap font-medium">
          {isDownloading ? "Downloading..." : "Download PDF"}
        </span>
      </a>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
