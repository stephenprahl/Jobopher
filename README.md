# AutoApply - AI-Powered Job Application Automation

An intelligent job application automation platform that uses LangGraph to orchestrate a team of AI agents for streamlined job hunting.

## �� Features

- **Multi-Agent Orchestration**: LangGraph-powered workflow coordinating specialized AI agents
- **Resume Parsing**: Intelligent extraction and enhancement of resume data
- **Job Fit Analysis**: AI-powered matching between candidates and job requirements
- **Cover Letter Generation**: Personalized cover letters tailored to specific job postings
- **Application Tracking**: Comprehensive dashboard for managing job applications
- **Skill Gap Analysis**: Identification of missing skills and learning recommendations

## 🏗️ Architecture

The system uses a team of specialized agents orchestrated by LangGraph:

### Agents
- **ResumeParserAgent**: Parses and enhances resume data using AI
- **JobAnalyzerAgent**: Analyzes job fit, match scores, and skill gaps
- **CoverLetterAgent**: Generates personalized cover letters
- **ApplicationOrchestratorAgent**: Coordinates the entire application workflow

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Ollama with GPT-OSS:120B-Cloud model
- **Orchestration**: LangGraph for multi-agent workflows
- **File Processing**: PDF.js for resume parsing

## 🛠️ Installation

1. Install and set up Ollama:
```bash
# Install Ollama (see https://ollama.ai for instructions)
# Pull the GPT-OSS model
ollama pull gpt-oss:120b-cloud
# Start Ollama server
ollama serve
```

2. Clone the repository
```bash
git clone <repository-url>
cd AutoApply
```

3. Install dependencies
```bash
npm install
```

4. Set up environment variables (optional for demo mode)
```bash
# Create .env file (optional - demo mode works without it)
echo "OLLAMA_BASE_URL=http://localhost:11434" > .env
```

5. Start the development environment
```bash
npm run dev:full
```

This will start both the frontend (port 5173) and backend (port 3001).

## 📋 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server:dev` - Start backend development server
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build for production
- `npm run test:workflow` - Test the LangGraph workflow
- `npm run lint` - Run ESLint

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/auto-apply` - Execute the full orchestrated workflow
- `POST /api/parse-resume` - Parse resume file
- `POST /api/analyze-job-fit` - Analyze job-candidate fit
- `POST /api/generate-cover-letter` - Generate cover letter

### Management Endpoints
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application

## 🤖 LangGraph Workflow

The LangGraph workflow orchestrates the following process:

1. **Resume Parsing** - Extract and enhance candidate information
2. **Job Prioritization** - Rank jobs based on fit and opportunity
3. **Application Orchestration** - Queue applications for processing
4. **Job Analysis** - Analyze fit scores and skill gaps for each job
5. **Cover Letter Generation** - Create personalized cover letters
6. **Application Processing** - Execute the application workflow

### Workflow State Management

The workflow maintains comprehensive state including:
- User profile and resume data
- Job listings and prioritization
- Application records and status
- AI-generated content (cover letters, analysis)
- Processing logs and error tracking

## 🔐 Environment Variables

- `API_KEY` - Any value to enable AI functionality (for demo mode, can be omitted)
- `OLLAMA_BASE_URL` - Ollama server URL (default: http://localhost:11434)
- `PORT` - Backend server port (default: 3001)

## 📊 Testing the Workflow

Test the LangGraph orchestration:

```bash
npm run test:workflow
```

This will execute the workflow with sample job data and demonstrate the agent coordination.

## 🚀 Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
