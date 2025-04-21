# OpenResume with AI Tailoring

This enhanced version of OpenResume includes an AI-powered resume tailoring feature that analyzes your resume against a job description using ChatGPT to provide tailored content.

## Features

- **AI Resume Tailoring**: Upload your resume and a job description to get AI-generated optimized content
- **Resume Import**: Import and parse data from existing PDF resumes
- **Resume Editor**: Create and edit resumes with a user-friendly interface
- **PDF Export**: Export your resume to PDF format

## Setup Instructions

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Setup (Flask API for AI Resume Tailoring)

1. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

5. Run the Flask backend:
   ```bash
   python app.py
   ```

## How to Use the AI Tailoring Feature

1. Navigate to the Resume Import page
2. Upload your resume PDF
3. Paste the job description in the right panel
4. Click "Analyze & Continue"
5. View the AI-tailored suggestions on the Resume Builder page
6. Copy and incorporate the suggested content into your resume

## Troubleshooting

### Backend Connection Issues

If you're getting "Backend not available" errors:

1. **Check if the Flask server is running**:
   - Make sure you've started the Flask server with `python app.py`
   - Check terminal output for any errors or exceptions
   - Verify the server is running on port 5000 (default)

2. **Port conflicts**:
   - If port 5000 is already in use, you can specify a different port:
     ```bash
     PORT=5001 python app.py
     ```
   - If you change the port, also update the `ANALYZE_API_ENDPOINT` in `src/app/resume-import/page.tsx`

3. **CORS issues**:
   - Make sure the backend has proper CORS setup
   - Check browser console for CORS errors
   - You can test the backend connection by visiting http://localhost:5000 directly

4. **Check your API key**:
   - Ensure your OpenAI API key is valid and correctly set in the `.env` file
   - The server will display warnings on startup if the API key is missing

5. **Using without backend**:
   - You can still use the resume import feature without the AI tailoring
   - On the resume import page, you'll see an option to proceed without AI enhancement

### JavaScript Errors

If you're seeing JavaScript errors in the console:

1. **For `_args_.includes is not a function` error**:
   - This is a known issue with PDF.js warnings
   - It has been fixed in the SuppressResumePDFErrorMessage.tsx file
   - If it persists, make sure your code is up to date

2. **For PDF processing errors**:
   - Try using a simpler PDF format
   - Some complex PDFs with advanced formatting may cause errors

## Technical Architecture

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS
- **Backend**: Flask API that interacts with OpenAI's API
- **AI Integration**: Uses OpenAI's GPT-3.5-turbo to analyze resume against job descriptions and provide tailored content

## Environment Variables

- `OPENAI_API_KEY`: Required for AI resume tailoring functionality
- `PORT`: Optional, to specify the backend server port (default: 5000)

## API Endpoints

- `GET /`: Health check endpoint to verify the server is running
- `HEAD /api/analyze`: Used to check if the backend API is available
- `POST /api/analyze`: Analyzes resume data against a job description
  - Request body: `{ resume: object, jobDescription: string }`
  - Response: `{ success: boolean, tailoredContent: { summary: string, workExperience: string[] } }`

# OpenResume

OpenResume is a powerful open-source resume builder and resume parser.

The goal of OpenResume is to provide everyone with free access to a modern professional resume design and enable anyone to apply for jobs with confidence.

Official site: [https://open-resume.com](https://open-resume.com)

## ⚒️ Resume Builder

OpenResume's resume builder allows user to create a modern professional resume easily.

![Resume Builder Demo](https://i.ibb.co/jzcrrt8/resume-builder-demo-optimize.gif)

It has 5 Core Features:
| <div style="width:285px">**Feature**</div> | **Description** |
|---|---|
| **1. Real Time UI Update** | The resume PDF is updated in real time as you enter your resume information, so you can easily see the final output. |
| **2. Modern Professional Resume Design** | The resume PDF is a modern professional design that adheres to U.S. best practices and is ATS friendly to top ATS platforms such as Greenhouse and Lever. It automatically formats fonts, sizes, margins, bullet points to ensure consistency and avoid human errors. |
| **3. Privacy Focus** | The app only runs locally on your browser, meaning no sign up is required and no data ever leaves your browser, so it gives you peace of mind on your personal data. (Fun fact: Running only locally means the app still works even if you disconnect the internet.) |
| **4. Import From Existing Resume PDF** | If you already have an existing resume PDF, you have the option to import it directly, so you can update your resume design to a modern professional design in literally a few seconds. |
| **5. Successful Track Record** | OpenResume users have landed interviews and offers from top companies, such as Dropbox, Google, Meta to name a few. It has been proven to work and liken by recruiters and hiring managers. |

## 🔍 Resume Parser

OpenResume's second component is the resume parser. For those who have an existing resume, the resume parser can help test and confirm its ATS readability.

![Resume Parser Demo](https://i.ibb.co/JvSVwNk/resume-parser-demo-optimize.gif)

You can learn more about the resume parser algorithm in the ["Resume Parser Algorithm Deep Dive" section](https://open-resume.com/resume-parser).

## 📚 Tech Stack

| <div style="width:140px">**Category**</div> | <div style="width:100px">**Choice**</div> | **Descriptions** |
|---|---|---|
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | TypeScript is JavaScript with static type checking and helps catch many silly bugs at code time. |
| **UI Library** | [React](https://github.com/facebook/react) | React's declarative syntax and component-based architecture make it simple to develop reactive reusable components. |
| **State Management** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Redux toolkit reduces the boilerplate to set up and update a central redux store, which is used in managing the complex resume state. |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Tailwind speeds up development by providing helpful css utilities and removing the need to context switch between tsx and css files. |
| **Web Framework** | [NextJS 13](https://github.com/vercel/next.js) | Next.js supports static site generation and helps build efficient React webpages that support SEO. |
| **PDF Reader** | [PDF.js](https://github.com/mozilla/pdf.js) | PDF.js reads content from PDF files and is used by the resume parser at its first step to read a resume PDF's content. |
| **PDF Renderer** | [React-pdf](https://github.com/diegomura/react-pdf) | React-pdf creates PDF files and is used by the resume builder to create a downloadable PDF file. |

## 📁 Project Structure

OpenResume is created with the NextJS web framework and follows its project structure. The source code can be found in `src/app`. There are a total of 4 page routes as shown in the table below. (Code path is relative to `src/app`)

| <div style="width:115px">**Page Route**</div> | **Code Path** | **Description** |
|---|---|---|
| / | /page.tsx | Home page that contains hero, auto typing resume, steps, testimonials, logo cloud, etc |
| /resume-import | /resume-import/page.tsx | Resume import page, where you can choose to import data from an existing resume PDF. The main component used is `ResumeDropzone` (`/components/ResumeDropzone.tsx`) |
| /resume-builder | /resume-builder/page.tsx | Resume builder page to build and download a resume PDF. The main components used are `ResumeForm` (`/components/ResumeForm`) and `Resume` (`/components/Resume`) |
| /resume-parser | /resume-parser/page.tsx | Resume parser page to test a resume's AST readability. The main library util used is `parseResumeFromPdf` (`/lib/parse-resume-from-pdf`) |

## 💻 Local Development

### Method 1: npm

1. Download the repo `git clone https://github.com/xitanggg/open-resume.git`
2. Change the directory `cd open-resume`
3. Install the dependency `npm install`
4. Start a development server `npm run dev`
5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live

### Method 2: Docker

1. Download the repo `git clone https://github.com/xitanggg/open-resume.git`
2. Change the directory `cd open-resume`
3. Build the container `docker build -t open-resume .`
4. Start the container `docker run -p 3000:3000 open-resume`
5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see OpenResume live
#   R e s u m e B u i l d e r  
 # ResumeBuilder
#   R e s u m e B u i l d e r  
 