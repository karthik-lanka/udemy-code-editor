# LearnX Backend

This is the backend server for the LearnX interactive learning platform. It provides API endpoints for code review, execution, and verification.

## Features

- AI-powered code review using OpenAI
- Code execution endpoint
- Code verification endpoint
- Course management API
- CORS enabled for frontend integration

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- OpenAI API key

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   OPENAI_API_KEY=your-key-here
   NODE_ENV=development
   ```
   Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Running the Server

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for auto-reloading on file changes.

### Production Mode
```bash
npm start
```

## API Endpoints

### Code Review
- **POST** `/api/review`
  - Request body: `{ code: string, language: string }`
  - Returns AI review of the code

### Code Execution
- **POST** `/api/run`
  - Request body: `{ code: string, language: string }`
  - Returns code execution output

### Code Verification
- **POST** `/api/verify`
  - Request body: `{ code: string, language: string }`
  - Returns verification results

### Courses
- **GET** `/api/courses`
  - Returns list of available courses

## Environment Variables

- `PORT`: Server port (default: 3000)
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: Environment mode (development/production)

## Security

- The `.env` file is included in `.gitignore` to prevent committing sensitive information
- CORS is configured to allow requests from the frontend
- API endpoints are protected with proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 