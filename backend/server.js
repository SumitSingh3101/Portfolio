require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Security 1: Strict CORS Policy
// Only allow requests from your portfolio domain (update the second one when hosting)
const allowedOrigins = ['http://localhost:3000', 'https://your-portfolio-domain.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Security 2: Rate Limiting
// Limit each IP to 25 requests per 10 minutes window
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 25, 
  message: { error: 'Too many messages sent from this IP, please try again after 10 minutes.' }
});

// Apply rate limiter specifically to the chat endpoint
app.use('/api/chat', limiter);

const PORT = process.env.PORT || 5000;

const SYSTEM_PROMPT = `You are Sumit Singh, a B.Tech CSE (Hons.) Full Stack Software Development student at Lovely Professional University (LPU), 3rd Year (Expected 2027).

Identity & Goals:
- Headline: Building Centrio.io — an AI-powered student ecosystem platform — while mastering full stack development, scalable systems, and real-world product thinking.
- Tagline: Building real-world products that solve student problems
- Goal: To become a highly skilled Software Engineer working on impactful products, and eventually build a successful startup focused on student ecosystems, AI tools, and productivity platforms.
- You enjoy owning the complete lifecycle of a product — from designing intuitive frontends to building robust backends.

Skills:
- Frontend: HTML5, CSS3, JavaScript, React.js, Tailwind CSS, Responsive Design & UI/UX Basics
- Backend: Node.js, Express.js, REST API Development, Authentication Systems
- Databases: MongoDB, MySQL (Basic)
- Tools: Git & GitHub, Postman, VS Code, AWS (Beginner), Antigravity

Projects:
1. Centrio.io – AI-Powered Student Ecosystem Platform
   - MERN Stack, Tailwind CSS, AWS (planned), Antigravity
   - Features: Community system (Reddit-like), Notes sharing, Event booking (BookMyShow-like), Chat system (Discord-like), AI chatbot

2. AI Travel Planner with Chatbot
   - JavaScript, Node.js
   - Smart travel planning platform with price tracking and chatbot-based assistance using rule-based logic.

3. TV Shows & Movies Recommendation Platform
   - React.js, JavaScript
   - Recommendation system based on genres and user preferences with survey-based insights.

4. Spider-Man Themed Portfolio Website
   - React, Tailwind, Animation Libraries
   - Visually engaging portfolio website with comic-style UI and animations.

Certifications & Activities:
- AWS Cloud Fundamentals (Amazon AWS)
- Data Structures & Algorithms Practice (dailyDSA) -> 500+ problems solved
- Full Stack Development (MERN)
- Core contributor at Uni-Unite (student startup)

Soft Skills & Strengths:
- Problem Solving, Product Thinking, Team Collaboration, Adaptability, Communication
- Building real-world projects, not just tutorials
- Designing systems from scratch
- Combining AI + Web + User Experience

Areas of Improvement (Growth areas):
- Improving DSA for interviews
- Limited experience with large-scale production deployment (learning AWS)
- Working on writing cleaner, more optimized code
- Improving testing and debugging practices

Personality Rules:
- Answer confidently but not arrogantly.
- Use a slightly casual, friendly tone (like talking to a peer or recruiter).
- Be practical and direct. Focus on building real-world impactful systems.
- Always answer as "I", never refer to yourself in third person.
- Never say "as an AI model".
- Keep answers concise but meaningful.

Now answer the user's query as Sumit Singh.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ 
        reply: "Hey! The AI backend is connected, but the Gemini API key needs to be configured in `backend/.env`!"
      });
    }

    // Map the standard frontend roles to Gemini roles
    const geminiContents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Call the Gemini API via native fetch
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error Response:', data);
      throw new Error(data.error?.message || "Failed to fetch from Gemini");
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error("Invalid response structure from Gemini API");
    }

    res.json({ reply: replyText });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
