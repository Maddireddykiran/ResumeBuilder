"use client";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import addPdfSrc from "public/assets/add-pdf.svg";
import { cx } from "lib/cx";
import { useRouter } from "next/navigation";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

const getFileSizeString = (fileSizeB: number) => {
  if (fileSizeB < 1024) {
    return `${fileSizeB} B`;
  } else if (fileSizeB < 1024 * 1024) {
    return `${(fileSizeB / 1024).toFixed(1)} KB`;
  } else {
    return `${(fileSizeB / (1024 * 1024)).toFixed(1)} MB`;
  }
};

export default function ResumeConverter() {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasNonSupportedFile, setHasNonSupportedFile] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const router = useRouter();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    if (newFile.name.endsWith(".pdf") || newFile.name.endsWith(".docx")) {
      setHasNonSupportedFile(false);
      setNewFile(newFile);
    } else {
      setHasNonSupportedFile(true);
    }
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    setNewFile(newFile);
  };

  const onRemove = () => {
    setFile(defaultFileState);
    setConvertedText("");
  };

  const convertPdfToText = async () => {
    try {
      // For PDF files
      if (file.name.endsWith(".pdf")) {
        // Using pdf.js to extract text
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
        
        const loadingTask = pdfjsLib.getDocument(file.fileUrl);
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const textItems = textContent.items;
          const pageText = textItems.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n\n";
        }
        
        setConvertedText(fullText);
        
        // Print both resume text and job description to console
        console.log("Converted Resume Text:", fullText);
        console.log("Job Description:", jobDescription);
        
        // Navigate to resume builder page
        router.push("/resume-builder");
      }
      // For DOCX files (placeholder - would need mammoth.js or similar)
      else if (file.name.endsWith(".docx")) {
        console.log("DOCX conversion would be implemented here");
        setConvertedText("DOCX conversion not implemented in this demo");
        console.log("Job Description:", jobDescription);
        
        // Navigate to resume builder page
        router.push("/resume-builder");
      }
    } catch (error) {
      console.error("Error converting file:", error);
      setConvertedText("Error converting file. See console for details.");
    }
  };

  return (
    <main className="mx-auto max-w-screen-lg px-8 pb-32 pt-16 text-gray-900 lg:px-12">
      <h1 className="text-center text-4xl font-bold">Resume Report</h1>
      <p className="mt-4 text-center text-lg text-gray-600">
        Upload your resume file and enter job description for analysis
      </p>
      
      <div className="mt-12 flex flex-col md:flex-row gap-8">
        {/* Resume Upload Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
          <div
            className={cx(
              "w-full rounded-md border-2 border-dashed border-gray-300 px-6 py-8",
              isHoveredOnDropzone && "border-sky-400"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setIsHoveredOnDropzone(true);
            }}
            onDragLeave={() => setIsHoveredOnDropzone(false)}
            onDrop={onDrop}
          >
            <div className="text-center space-y-3">
              <Image
                src={addPdfSrc}
                className="mx-auto h-12 w-12"
                alt="Add file"
                aria-hidden="true"
                priority
              />
              {!hasFile ? (
                <>
                  <p className="pt-2 text-base font-semibold text-gray-700">
                    Browse a PDF or DOCX file or drop it here
                  </p>
                  <p className="text-sm text-gray-500">
                    File data is used locally and never leaves your browser
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <div className="pl-4 font-semibold text-gray-900">
                    {file.name} - {getFileSizeString(file.size)}
                  </div>
                  <button
                    type="button"
                    className="outline-theme-mint-light rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    title="Remove file"
                    onClick={onRemove}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <div className="pt-4">
                {!hasFile ? (
                  <>
                    <label className="cursor-pointer rounded-full bg-primary px-5 pb-2 pt-1.5 font-semibold shadow-sm">
                      Browse file
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.docx"
                        onChange={onInputChange}
                      />
                    </label>
                    {hasNonSupportedFile && (
                      <p className="mt-4 text-red-400">
                        Only PDF and DOCX files are supported
                      </p>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="w-full">
            <textarea
              className="w-full h-64 p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-mint)] focus:border-transparent"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          className="btn-primary px-8 py-3 text-lg"
          onClick={convertPdfToText}
          disabled={!hasFile || !jobDescription.trim()}
        >
          Analyze Resume
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-gray-600">
        <p>After analysis, check your browser console (F12) to view the results.</p>
      </div>
    </main>
  );
}
