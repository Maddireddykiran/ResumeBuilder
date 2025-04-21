"use client";
import { useState, useEffect } from 'react';
import { useAppSelector } from 'lib/redux/hooks';

interface TailoredContentProps {
  className?: string;
}

interface TailoredContent {
  summary: string;
  workExperience: {
    company: string;
    bulletPoints: string[];
  }[];
}

export const TailoredContent = ({ className = '' }: TailoredContentProps) => {
  const [tailoredContent, setTailoredContent] = useState<TailoredContent | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const resume = useAppSelector((state) => state.resume);

  useEffect(() => {
    // Try to get the tailored content from localStorage
    const storedContent = localStorage.getItem('tailoredContent');
    if (storedContent) {
      try {
        const parsedContent = JSON.parse(storedContent);
        
        // Handle all possible formats
        let formattedContent = { ...parsedContent };
        
        // Case 1: workExperience is an array of strings (old format)
        if (Array.isArray(parsedContent.workExperience) && 
            parsedContent.workExperience.length > 0 && 
            typeof parsedContent.workExperience[0] === 'string') {
          formattedContent.workExperience = [{
            company: resume.workExperiences[0]?.company || 'Company',
            bulletPoints: parsedContent.workExperience
          }];
        } 
        // Case 2: workExperience is not an array 
        else if (!Array.isArray(parsedContent.workExperience)) {
          formattedContent.workExperience = [];
        }
        // Case 3: workExperience items might not have bulletPoints array
        else {
          formattedContent.workExperience = parsedContent.workExperience.map((exp: any) => {
            if (!exp.bulletPoints || !Array.isArray(exp.bulletPoints)) {
              return {
                ...exp,
                company: exp.company || 'Company',
                bulletPoints: []
              };
            }
            return exp;
          });
        }
        
        setTailoredContent(formattedContent);
      } catch (error) {
        console.error('Error parsing tailored content:', error);
      }
    }
  }, [resume.workExperiences]);

  const handleCopy = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  if (!tailoredContent) {
    return null;
  }

  // Get work experiences from the resume store
  const workExperiences = resume.workExperiences || [];

  return (
    <div className={`${className} w-full h-full px-2 md:px-6 py-4`} style={{ overflow: 'auto' }}>
      <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-[#57CDA4]">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#57CDA4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Job-Tailored Resume Content
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          Our AI has analyzed your resume against the job description and created tailored content to maximize your match rate. Copy these optimized sections into your resume to improve your chances of getting an interview.
        </p>
        <div className="text-xs text-gray-500 flex items-center bg-gray-50 p-2 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#57CDA4]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>The content is AI-optimized but based entirely on your original resume - no fabrication, just better wording!</span>
        </div>
      </div>

      {tailoredContent.summary && (
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center bg-[#57CDA4]/10 px-4 py-3">
            <span className="bg-[#57CDA4] text-white text-sm font-medium px-3 py-1 rounded mr-3">SUMMARY</span>
            <h3 className="text-base font-semibold text-gray-700">Tailored Professional Summary</h3>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-100 leading-relaxed">
              {tailoredContent.summary}
            </div>
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => handleCopy(tailoredContent.summary, 'summary')}
                className={`text-xs px-3 py-1 rounded-md flex items-center transition-all ${
                  copiedItem === 'summary' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {copiedItem === 'summary' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy to clipboard
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {tailoredContent.workExperience && tailoredContent.workExperience.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center bg-[#57CDA4]/10 px-4 py-3">
            <span className="bg-[#57CDA4] text-white text-sm font-medium px-3 py-1 rounded mr-3">EXPERIENCE</span>
            <h3 className="text-base font-semibold text-gray-700">Tailored Work Experience</h3>
          </div>
          
          <div className="p-4">
            {/* Map through each work experience */}
            {tailoredContent.workExperience.map((experience, expIndex) => {
              // Find matching work experience from resume if available
              const matchingExp = expIndex < workExperiences.length 
                ? workExperiences[expIndex] 
                : { company: experience.company, jobTitle: "Full Stack Developer", date: "March 2025 - Present" };
              
              return (
                <div key={expIndex} className={`${expIndex > 0 ? "mt-8 pt-6 border-t border-gray-100" : ""}`}>
                  <div className="font-medium text-gray-800 text-lg">
                    {matchingExp.company || experience.company}
                  </div>
                  <div className="text-sm flex justify-between text-gray-600 mb-3">
                    <span className="font-medium">
                      {matchingExp.jobTitle || "Full Stack Developer"}
                    </span>
                    <span>
                      {matchingExp.date || "Present"}
                    </span>
                  </div>
                  
                  <ul className="list-none space-y-3 bg-white p-3 rounded-md border border-gray-100">
                    {Array.isArray(experience.bulletPoints) ? experience.bulletPoints.slice(0, 4).map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2 text-[#57CDA4] font-bold">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    )) : null}
                  </ul>
                  
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => {
                        const textToCopy = Array.isArray(experience.bulletPoints) 
                          ? experience.bulletPoints.join('\n')
                          : '';
                        handleCopy(textToCopy, `exp-${expIndex}`);
                      }}
                      className={`text-xs px-3 py-1 rounded-md flex items-center transition-all ${
                        copiedItem === `exp-${expIndex}` 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {copiedItem === `exp-${expIndex}` ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy bullet points
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 flex items-start text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0 text-[#57CDA4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                These bullet points have been tailored to highlight the most relevant skills and accomplishments for this job. Replace your current bullet points with these for maximum impact.
              </span>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={() => {
                const textToCopy = tailoredContent.workExperience
                  .filter(exp => Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
                  .map(exp => 
                    exp.bulletPoints.join('\n')
                  ).join('\n\n');
                handleCopy(textToCopy, 'all-exp');
              }}
              className={`text-sm px-4 py-2 rounded-md flex items-center transition-all ${
                copiedItem === 'all-exp' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-[#57CDA4] text-white hover:bg-[#4db896]'
              }`}
            >
              {copiedItem === 'all-exp' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All bullet points copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy all bullet points
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 