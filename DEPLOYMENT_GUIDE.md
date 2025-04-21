# OpenResume Deployment Guide

This guide provides step-by-step instructions for deploying the OpenResume application:
- Frontend: Next.js application deployed to Netlify
- Backend: Flask API deployed to Render

## Part 1: Backend Deployment to Render (Free Tier)

### Step 1: Prepare Your Repository

1. Make sure your code is in a GitHub repository
2. Ensure you have the following files in your repository root:
   - `app.py` - Flask application
   - `requirements.txt` - Python dependencies
   - `render.yaml` - Render configuration

### Step 2: Deploy to Render (Free Tier)

1. Sign up or log in to [Render](https://render.com)
2. Click "New" and select "Web Service" from the dropdown (not "Blueprint")
3. Connect your GitHub repository
4. Configure your web service:
   - Name: Choose a name for your service
   - Runtime: Select "Python"
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - **Important**: Select "Free" as your instance type
5. Set the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
6. Click "Create Web Service" to start the deployment

### Step 3: Verify Backend Deployment

1. Once deployed, Render will provide a URL for your backend service (e.g., `https://open-resume-backend.onrender.com`)
2. Test the health check endpoint by visiting `https://open-resume-backend.onrender.com/`
3. You should see a JSON response with `"status": "online"`

### Free Tier Limitations to Be Aware Of

1. Free web services will spin down after 15 minutes of inactivity
2. When a request comes in, the service will spin up again (may take up to a minute)
3. You get 750 free instance hours per month
4. There are monthly bandwidth and build pipeline limits

## Part 2: Frontend Deployment to Netlify

### Step 1: Prepare Your Repository

1. Ensure you have the following files in your repository:
   - `netlify.toml` (Netlify configuration, optional but recommended)
   - `next.config.js` (Next.js configuration)

### Step 2: Deploy to Netlify

1. Sign up or log in to [Netlify](https://netlify.com)
2. Click "Add new site" and select "Import an existing project"
3. Connect your GitHub repository
4. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Framework Preset: Next.js (if prompted)
5. Add the following environment variable:
   - `NEXT_PUBLIC_API_URL`: The URL of your Render backend (e.g., `https://open-resume-backend.onrender.com`)
6. Click "Deploy site"

### Step 3: Verify Frontend Deployment

1. Once deployed, Netlify will provide a URL for your frontend application
2. Test the application by visiting the provided URL
3. Try the resume import feature with AI tailoring to verify the backend connection

## Troubleshooting

### Backend Issues

1. **Deployment Fails**:
   - Check the Render logs for error messages
   - Verify that all dependencies are listed in `requirements.txt`
   - Make sure `gunicorn` is installed

2. **API Key Issues**:
   - Verify that the `OPENAI_API_KEY` environment variable is set correctly in Render
   - Check the backend logs for any API key warnings

3. **CORS Issues**:
   - If you see CORS errors in the browser console, verify that the Flask CORS configuration is correct
   - The backend should allow requests from your Netlify domain

4. **Free Tier Spin-up Delay**:
   - If your backend takes time to respond after periods of inactivity, this is normal for the free tier
   - The first request after inactivity may take up to a minute to process

### Frontend Issues

1. **Build Fails**:
   - Check the Netlify build logs for error messages
   - Make sure all dependencies are correctly installed

2. **Backend Connection Issues**:
   - Verify that `NEXT_PUBLIC_API_URL` is set correctly in Netlify
   - Check the browser console for network errors
   - Try the health check endpoint directly to ensure the backend is running

## Updating Your Deployment

### Backend Updates

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy the changes

### Frontend Updates

1. Push changes to your GitHub repository
2. Netlify will automatically rebuild and deploy the changes

## Local Development After Deployment

When developing locally after deployment:

1. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

2. Run the backend locally:
   ```
   python app.py
   ```

3. Run the frontend locally:
   ```
   npm run dev
   ```

This setup allows you to develop locally while pointing to your local backend, without affecting the production deployment.
