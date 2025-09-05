InvestShiksha

InvestShiksha is a cross-platform mobile application that educates and empowers retail investors in India. It provides interactive tutorials, quizzes, virtual trading, AI-driven risk assessment, and multilingual support aligned with SEBI’s investor education mandate.



Key Features

Investor Education: Comprehensive courses on stock market fundamentals, risk management, algo trading, and portfolio diversification.



Multilingual Support: Real-time translation into 12+ Indian vernacular languages.



Interactive Quizzes: End-of-lesson quizzes with instant feedback and progress tracking.



Virtual Trading Simulator: Risk-free trading environment using delayed market data.



AI-Powered Insights: Personalized risk assessments and investment recommendations using OpenAI GPT-3.5.



Gamification: Points, levels, and achievements to motivate continuous learning.



Secure Authentication: Email/password, JWT, and optional biometric login.



Real-Time Updates: Live market data via Socket.io.



Tech Stack

Frontend: React Native, Expo, TypeScript



Backend: Node.js, Express, TypeScript, MongoDB, Redis



AI/ML: OpenAI GPT-3.5, TensorFlow.js



Real-Time: Socket.io



Translation: Google Translate API



Notifications: Firebase Cloud Messaging



Deployment: Docker, Docker Compose, AWS/GCP



Prerequisites

Node.js v18+



npm or yarn



Docker \& Docker Compose (optional)



API keys for Google Translate, Alpha Vantage (market data), and OpenAI



Project Structure

text

InvestShiksha/

├── backend/      # Express API server

├── frontend/     # React Native mobile app

├── docker-compose.yml

├── README.md

└── .env.example

Setup Instructions

1\. Clone Repository

bash

git clone https://github.com/your-org/investshiksha.git

cd investshiksha

2\. Backend Setup

bash

cd backend

cp .env.example .env

\# Edit .env with your API keys and database URIs

npm install

npm run dev

The backend API will run at http://localhost:3000/api.



3\. Frontend Setup

bash

cd frontend

npm install

npx expo start

Use an Android emulator (10.0.2.2) or iOS simulator.



4\. Docker Setup (Optional)

bash

docker-compose up --build

This will start:



backend (port 3000)



mongo (port 27017)



redis (port 6379)



5\. Database Seeding

bash

cd backend

npm run seed

Usage

Register or login using email/password (or biometric).



Select preferred language.



Browse courses and complete lessons.



Take quizzes and track your learning progress.



Use the virtual trading simulator to practice buying/selling stocks.



View real-time market data and portfolio performance.



Environment Variables (.env)

text

\# Server

PORT=3000

MONGO\_URI=mongodb://mongo:27017/investshiksha

REDIS\_URL=redis://redis:6379

JWT\_SECRET=your\_jwt\_secret

ENCRYPTION\_KEY=32\_char\_hex\_key



\# Firebase (Notifications)

FIREBASE\_API\_KEY=

FIREBASE\_AUTH\_DOMAIN=

FIREBASE\_PROJECT\_ID=



\# External APIs

GOOGLE\_TRANSLATE\_API\_KEY=

ALPHA\_VANTAGE\_API\_KEY=

OPENAI\_API\_KEY=

Contributing

Fork the repository



Create a branch: git checkout -b feature/YourFeature



Commit changes: git commit -m "Add YourFeature"



Push branch: git push origin feature/YourFeature



Open a pull request





