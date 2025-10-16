# Ai-prowed-filim-maker-

# Film Studio Web Application

A sleek, film-studio-inspired full-stack web application that serves as a futuristic 'Notion for Filmmakers'. Features AI-powered transcription, script editing with suggestions, drag-and-drop storyboarding, and real-time team collaboration.

## Features

- **Research Hub**: Organize ideas, references, and inspiration
- **Transcripts**: Upload audio/video files for AI-powered transcription
- **Script Editing**: Collaborative script writing with AI suggestions
- **Storyboarding**: Drag-and-drop scene management with visual planning
- **Real-time Collaboration**: Live editing and team communication
- **AI Integration**: OpenAI-powered transcription and script suggestions
- **Responsive Design**: Cinematic UI with soft gradients and animations

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- React Beautiful DnD for drag-and-drop
- Socket.io Client for real-time features
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- OpenAI API for AI features
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd film-studio-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
film-studio-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Scripts
- `GET /api/scripts/project/:projectId` - Get project scripts
- `POST /api/scripts` - Create new script
- `GET /api/scripts/:id` - Get script details
- `PUT /api/scripts/:id` - Update script

### Transcripts
- `GET /api/transcripts/project/:projectId` - Get project transcripts
- `POST /api/ai/transcribe` - Upload and transcribe file
- `GET /api/transcripts/:id` - Get transcript details

### AI Features
- `POST /api/ai/script-suggestions` - Get AI script suggestions
- `POST /api/ai/storyboard-ideas` - Get storyboard ideas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
