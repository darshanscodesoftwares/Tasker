# TASKER

**Turn conversations into clear work logs.**

TASKER is a full-stack AI workspace that transforms shared conversation links into structured daily task summaries. Paste a link, extract the text, generate a summary via Cloudflare Workers AI, edit it, and save it for later.

## Tech Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | React (Vite), Tailwind CSS, Framer Motion, react-grid-layout |
| Backend  | Node.js, Express, Mongoose                           |
| AI       | Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) |
| Database | MongoDB                                              |

## Project Structure

```
tasker/
├── client/          # React frontend (Vite)
├── server/          # Express API backend
├── prompts/         # AI system prompt
├── package.json     # Root monorepo scripts
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally (or a remote URI)
- **Cloudflare** account with Workers AI access

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/tasker
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### 3. Run in development

```bash
npm run dev
```

This starts both the Express server (port 4000) and the Vite dev server (port 5173) concurrently. The Vite dev server proxies `/api` requests to the backend.

Open **http://localhost:5173** in your browser.

### 4. Production build

```bash
npm run build
```

The compiled frontend is output to `client/dist/`.

## API Endpoints

| Method | Path              | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | `/api/summarize`  | Fetch URL, extract text, return AI summary |
| POST   | `/api/summaries`  | Save a summary to MongoDB          |
| GET    | `/api/summaries`  | List all saved summaries (newest first) |
| GET    | `/api/health`     | Health check                       |

## User Flow

1. Open TASKER in the browser
2. Paste a conversation link into the **Link Input** widget
3. Click **Generate Summary**
4. Review / edit the AI-generated summary
5. Click **Save Summary**
6. View past summaries in the **History** widget

## Design

- Soft blue-to-purple gradient background (#6E8BFF → #8B5CF6)
- Glassmorphism cards with rounded corners
- Draggable, snappable widget dashboard (positions persist in localStorage)
- Framer Motion animations for smooth transitions
