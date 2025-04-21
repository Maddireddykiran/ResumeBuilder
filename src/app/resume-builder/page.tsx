
"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";
import { useState, useEffect, useRef } from "react";
import { UploadedResumePDF } from "components/UploadedResumePDF";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TailoredContent } from "components/TailoredContent";

export default function Create() {
  const [showEditMode, setShowEditMode] = useState(true); // Default to edit mode
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [hasTailoredContent, setHasTailoredContent] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "tailored">("resume");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentDimensions, setContentDimensions] = useState({ width: '100%', height: '100%' });

  // Get the uploaded resume URL from localStorage
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const storedFileUrl = localStorage.getItem("uploadedResumeUrl");
      if (storedFileUrl) {
        setUploadedResumeUrl(storedFileUrl);
        setShowNotification(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
      
      // Check if tailored content exists
      const tailoredContent = localStorage.getItem("tailoredContent");
      if (tailoredContent) {
        try {
          const parsed = JSON.parse(tailoredContent);
          
          // Get resume data
          const resumeData = localStorage.getItem("resumeState");
          const resumeState = resumeData ? JSON.parse(resumeData) : null;
          const workExps = resumeState?.resume?.workExperiences || [];
          
          // Handle all possible formats and fix data if needed
          let updatedContent = { ...parsed };
          let needsUpdate = false;
          
          // Case 1: workExperience is an array of strings (old format)
          if (Array.isArray(parsed.workExperience) && 
              parsed.workExperience.length > 0 && 
              typeof parsed.workExperience[0] === 'string') {
            updatedContent.workExperience = [{
              company: workExps[0]?.company || 'Company',
              bulletPoints: parsed.workExperience.slice(0, 4) // Limit to 4 bullet points
            }];
            needsUpdate = true;
          } 
          // Case 2: workExperience is not an array 
          else if (!Array.isArray(parsed.workExperience)) {
            updatedContent.workExperience = [];
            needsUpdate = true;
          }
          // Case 3: workExperience items might not have bulletPoints array
          else {
            const fixedExperiences = parsed.workExperience.map((exp: any) => {
              if (!exp.bulletPoints || !Array.isArray(exp.bulletPoints)) {
                needsUpdate = true;
                return {
                  ...exp,
                  company: exp.company || 'Company',
                  bulletPoints: []
                };
              }
              return exp;
            });
            
            if (needsUpdate) {
              updatedContent.workExperience = fixedExperiences;
            }
          }
          
          // Save back to localStorage if we made any changes
          if (needsUpdate) {
            localStorage.setItem("tailoredContent", JSON.stringify(updatedContent));
          }
          
          setHasTailoredContent(true);
          
          // If tailored content exists, show it by default
          setActiveTab("tailored");
        } catch (error) {
          console.error("Error parsing tailored content", error);
        }
      }
    }
  }, []);

  // Calculate container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const containerWidth = contentRef.current.clientWidth;
        const containerHeight = contentRef.current.clientHeight;
        setContentDimensions({
          width: `${containerWidth}px`,
          height: `${containerHeight}px`
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [activeTab, showEditMode]);

  const handleSaveAndClose = () => {
    setShowEditMode(false);
    setShowNotification(true);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  return (
    <Provider store={store}>
      <main className="relative h-screen w-full bg-white overflow-hidden">
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-md">
            <div className="flex items-center">
              <div>
                <p className="font-bold">{showEditMode ? "Changes Saved" : "Resume Imported Successfully"}</p>
                <p className="text-sm">Check your console to view the analyzed data</p>
              </div>
              <button 
                className="ml-4 text-green-700"
                onClick={() => setShowNotification(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {!showEditMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
            {/* Left side with background image and editable template button */}
            <div className="relative col-span-1 bg-gradient-to-br from-green-100 to-teal-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" 
                style={{ backgroundImage: "url('/assets/resume-bg.svg')" }}></div>
              <div className="z-10 text-center p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Professional Resume</h2>
                <button
                  onClick={() => setShowEditMode(true)}
                  className="text-white bg-gradient-to-r from-[#57CDA4] to-[#2A9977] rounded-lg px-8 py-4 text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative mx-auto"
                  style={{
                    boxShadow: '0 0 15px 5px rgba(87, 205, 164, 0.5)',
                  }}
                >
                  <div className="absolute inset-0 rounded-lg bg-[#57CDA4] blur-md opacity-30"></div>
                  <span className="relative flex items-center">
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    Editable Templates
                  </span>
                </button>
                <p className="mt-4 text-center max-w-sm text-gray-600">
                  Click to customize your resume with our interactive editor
                </p>
              </div>
            </div>
            
            {/* Right side with resume preview */}
            <div className="col-span-1 relative overflow-hidden">
              {/* Fixed tab selector */}
              <div className="sticky top-0 z-20 bg-gray-100 shadow-sm">
                <div className="flex px-4 py-2">
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "resume"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Resume Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("tailored")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 ${
                      activeTab === "tailored"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    AI Tailored Content
                  </button>
                </div>
              </div>
              
              {/* Content container with ref for dimension calculations */}
              <div 
                ref={contentRef}
                className="relative h-[calc(100vh-40px)]"
                style={{ overflow: 'auto' }}
              >
                {/* Resume preview */}
                {activeTab === "resume" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="w-full h-full" 
                      style={{ 
                        padding: '1rem',
                        boxSizing: 'border-box',
                        width: contentDimensions.width,
                        height: contentDimensions.height,
                        backgroundColor: 'white',
                        overflow: 'visible'
                      }}
                    >
                      <Resume />
                    </div>
                  </div>
                )}
                
                {/* Tailored content */}
                {activeTab === "tailored" && (
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      overflow: 'auto',
                      padding: '1rem',
                      boxSizing: 'border-box',
                      width: contentDimensions.width,
                      height: contentDimensions.height,
                      backgroundColor: 'white'
                    }}
                  >
                    <TailoredContent className="w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden">
            <div className="col-span-1 h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowEditMode(false)}
                    className="flex items-center mr-4 text-gray-700 hover:text-gray-900"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    <span>Back</span>
                  </button>
                <h2 className="text-lg font-semibold">Edit Resume</h2>
                </div>
                <button
                  onClick={handleSaveAndClose}
                  className="bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-sm hover:bg-green-700"
                >
                  Save and Close
                </button>
              </div>
              <div className="w-full max-w-2xl mx-auto px-4 pb-10">
                <ResumeForm />
              </div>
            </div>
            <div className="col-span-1 h-screen overflow-hidden border-l border-gray-200">
              {/* Fixed tab selector that always shows */}
              <div className="sticky top-0 z-20 bg-gray-100 shadow-sm">
                <div className="flex px-4 py-2">
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      activeTab === "resume"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Resume Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("tailored")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 ${
                      activeTab === "tailored"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    AI Tailored Content
                  </button>
                </div>
              </div>
              
              {/* Content container with ref for dimension calculations */}
              <div 
                ref={contentRef}
                className="relative h-[calc(100vh-40px)]"
                style={{ overflow: 'auto' }}
              >
                {/* Resume preview */}
                {activeTab === "resume" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="w-full h-full" 
                      style={{ 
                        padding: '1rem',
                        boxSizing: 'border-box',
                        width: contentDimensions.width,
                        height: contentDimensions.height,
                        backgroundColor: 'white',
                        overflow: 'visible'
                      }}
                    >
                      <Resume />
                    </div>
                  </div>
                )}
                
                {/* Tailored content */}
                {activeTab === "tailored" && (
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      overflow: 'auto',
                      padding: '1rem',
                      boxSizing: 'border-box',
                      width: contentDimensions.width,
                      height: contentDimensions.height,
                      backgroundColor: 'white'
                    }}
                  >
                    <TailoredContent className="w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </Provider>
  );
}
