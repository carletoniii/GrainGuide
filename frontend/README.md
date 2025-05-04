📸 GrainGuide

GrainGuide is a full-stack film photography recommendation app built with React, Vite, Express, PostgreSQL, and OpenAI. Users answer a multi-step questionnaire, and the app recommends film stocks that suit their style, format, and preferences.

🚀 Features

Film stock database with detailed metadata (format, ISO, color/B&W, grain, etc.)

Smart filtering and OpenAI-assisted recommendations

Instant and large format film logic built into user flow

Responsive multi-step questionnaire built with React + Framer Motion

Fully typed backend in TypeScript with PostgreSQL integration

🛠 Tech Stack

Frontend: React, Vite, TypeScript, Framer Motion, TailwindCSS

Backend: Node.js, Express, TypeScript

Database: PostgreSQL

AI: OpenAI API (GPT-4-turbo)

Dev Tools: ESLint, dotenv, GitHub

📦 Installation

Clone the repo

git clone https://github.com/your-username/grainguide.git
cd grainguide

Install dependencies for both frontend and backend

# In root or respective frontend/backend folders
npm install

Set up environment variables

In /server, create a .env file:

OPENAI_API_KEY=your-openai-key
DATABASE_URL=your-database-url

Start the backend

cd server
npm run dev

Start the frontend

cd frontend
npm run dev

🔍 Lighthouse Scores (Production Build)

Performance: 83

Accessibility: 100

Best Practices: 100

SEO: 100

Metrics based on local build at http://localhost:3000 using Lighthouse in Chrome DevTools with slow 4G emulation.

📷 Image Credits

The homepage photo of film rolls was taken by Eye Speak and is used under the Unsplash License.Original image: unsplash.com/photos/three-green-and-white-cans-DH87j5UKK4w

📌 Deployment Instructions (Coming Soon)

This section will include instructions for setting up production database credentials, hosting, and environment configuration when you're ready to deploy publicly.
