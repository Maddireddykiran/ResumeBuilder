"use client";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { ResumeDropzone } from "components/ResumeDropzone";
import { useState, useEffect } from "react";
import Link from "next/link";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { useRouter } from "next/navigation";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";
import { initialSettings, type ShowForm } from "lib/redux/settingsSlice";

// API endpoint for analyzing resume
const ANALYZE_API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/analyze` 
  : 'http://localhost:5000/api/analyze';

export default function ImportResume() {
  const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false);
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"checking" | "available" | "unavailable">("checking");
  const router = useRouter();

  const onFileUrlChange = (fileUrl: string) => {
    setFileUrl(fileUrl);
    setHasAddedResume(Boolean(fileUrl));
  };

  useEffect(() => {
    setHasUsedAppBefore(getHasUsedAppBefore());
    
    // Check if backend is available
    const checkBackendStatus = async () => {
      try {
        // Use a simple fetch with longer timeout to check backend
        console.log('Checking backend status...');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timed out')), 5000)
        );
        
        const fetchPromise = fetch(ANALYZE_API_ENDPOINT, { 
          method: 'HEAD',
        });
        
        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
        
        if (response.ok) {
          console.log('Backend is available');
          setBackendStatus("available");
        } else {
          console.log('Backend returned non-OK status:', response.status);
          setBackendStatus("unavailable");
          setUseAI(false);
        }
      } catch (e) {
        console.warn("Backend not available:", e);
        setBackendStatus("unavailable");
        setUseAI(false);
      }
    };
    
    checkBackendStatus();
  }, []);

  const handleImportAndContinue = async () => {
    if (!fileUrl) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // Parse resume from PDF
      const resume = await parseResumeFromPdf(fileUrl);
      console.log('Resume data from uploaded file:', resume);
      
      // Store the original resume data
      const settings = deepClone(initialSettings);

      // Set formToShow settings based on uploaded resume if users have used the app before
      if (getHasUsedAppBefore()) {
        const sections = Object.keys(settings.formToShow) as ShowForm[];
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: resume.workExperiences.length > 0,
          educations: resume.educations.length > 0,
          projects: resume.projects.length > 0,
          skills: resume.skills.descriptions.length > 0,
          custom: resume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          settings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      // If job description exists and AI is enabled, send to API for tailoring
      if (jobDescription.trim() && useAI && backendStatus === "available") {
        try {
          console.log('Connecting to AI analysis service...');
          
          const response = await fetch(ANALYZE_API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              resume: resume,
              jobDescription: jobDescription
            }),
            // Add timeout to prevent long waiting
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success && data.tailoredContent) {
            // Store the tailored content in localStorage
            localStorage.setItem('tailoredContent', JSON.stringify(data.tailoredContent));
            console.log('Tailored content from AI:', data.tailoredContent);
          }
        } catch (apiError: any) {
          console.error('Error calling AI API:', apiError);
          
          // Set more specific error messages based on the error type
          if (apiError.name === 'AbortError') {
            console.warn('Request timed out');
            setError("Connection to AI service timed out. Continuing with original resume.");
          } else if (apiError.message?.includes('fetch') || apiError.message?.includes('Failed to fetch')) {
            console.warn('Network error - backend might not be running');
            setError("Cannot connect to AI service. Make sure the Flask backend is running.");
            setBackendStatus("unavailable");
          } else {
            setError(`AI service error: ${apiError.message || 'Unknown error'}`);
          }
          
          // Continue with original resume if API fails - don't throw, just show warning
        }
      }
      
      // Save the final resume to localStorage
      saveStateToLocalStorage({ resume, settings });
      
      // Navigate to resume builder even if AI analysis failed
      router.push("/resume-builder");
    } catch (error: any) {
      // Safe string conversion for error
      const errorMessage = error?.message || String(error) || "Unknown error";
      console.error('Error processing resume:', errorMessage);
      setError(`Failed to process resume: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Resume Import
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Resume Import */}
          <div className="rounded-md border border-gray-200 p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Import Your Resume
            </h2>
            {!hasUsedAppBefore ? (
              <>
                <p className="text-gray-600 mb-4">
                  Upload your existing resume to get started.
                </p>
                <ResumeDropzone
                  onFileUrlChange={onFileUrlChange}
                  className="mt-5"
                />
                {!hasAddedResume && (
                  <>
                    {/* <OrDivider />
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-3">Don't have a resume yet?</p>
                      <Link
                        href="/resume-builder"
                        className="outline-theme-mint-light rounded-full bg-[#57CDA4] px-6 pb-2 pt-1.5 text-base font-semibold text-white inline-block"
                      >
                        Create from scratch
                      </Link>
                    </div> */}
                  </>
                )}
              </>
            ) : (
              <>
                {!hasAddedResume && (
                  <>
                    {/* <div className="text-center mb-6">
                      <p className="font-semibold text-gray-900 mb-3">You have data saved from a prior session</p>
                      <Link
                        href="/resume-builder"
                        className="outline-theme-mint-light rounded-full bg-[#57CDA4] px-6 pb-2 pt-1.5 text-base font-semibold text-white inline-block"
                      >
                        Continue where I left off
                      </Link>
                    </div>
                    <OrDivider /> */}
                  </>
                )}
                <h2 className="font-semibold text-gray-900 mb-4">
                  Override with a new resume
                </h2>
                <ResumeDropzone
                  onFileUrlChange={onFileUrlChange}
                  className="mt-5"
                />
              </>
            )}
          </div>
          
          {/* Right Column - Job Description */}
          <div className="rounded-md border border-gray-200 p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Job Description (Optional)
            </h2>
            <div className="mb-4 text-sm text-gray-600">
              <p>Paste the job description to get AI-tailored content that matches your skills with the job requirements.</p>
              <p className="mt-2 text-xs flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  The AI will maintain your resume's structure while enhancing the content to better match job requirements.
                  It preserves your job titles, companies, dates, and locations while optimizing bullet points.
                </span>
              </p>
            </div>
            {backendStatus === "unavailable" && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-700 text-sm font-medium">
                  AI service not available: The backend server is not running. 
                  You can still import your resume, but AI tailoring will be disabled.
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  To use AI tailoring, start the Flask backend server as described in the README.
                </p>
              </div>
            )}
            <textarea
              className={cx(
                "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-mint)] focus:border-transparent",
                backendStatus === "unavailable" && !useAI && "opacity-50"
              )}
              placeholder={backendStatus === "unavailable" && !useAI 
                ? "AI enhancement unavailable - Flask backend not running" 
                : "Paste job description here..."
              }
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              disabled={backendStatus === "unavailable" && !useAI}
            />
            
            {backendStatus === "unavailable" && (
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Try to use AI anyway (might not work if backend is unavailable)
                  </span>
                </label>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="mt-4 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {/* Submit and Continue Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleImportAndContinue}
                disabled={!hasAddedResume || isLoading}
                className={cx(
                  "rounded-md px-6 py-2.5 font-semibold text-white shadow-sm",
                  hasAddedResume && !isLoading
                    ? "bg-green-600 hover:bg-green-700 cursor-pointer" 
                    : "bg-gray-400 cursor-not-allowed"
                )}
              >
                {isLoading 
                  ? "Processing..." 
                  : jobDescription.trim() && useAI && backendStatus === "available"
                    ? "Analyze & Continue" 
                    : "Import & Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const OrDivider = () => (
  <div className="flex items-center py-4" aria-hidden="true">
    <div className="flex-grow border-t border-gray-200" />
    <span className="mx-2 flex-shrink text-gray-400">or</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);
