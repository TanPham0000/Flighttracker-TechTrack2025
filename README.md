# Flight Tracker

A real-time flight tracking application built with SvelteKit. Track flights around the world on an interactive 3D globe with live flight data, aircraft details, and comprehensive statistics.

## Features

- 🌍 **Interactive 3D Globe**: Rotate and zoom to explore flights worldwide
- ✈️ **Real-time Flight Data**: Live updates of active flights
- 📊 **Flight Statistics**: Comprehensive statistics and status breakdowns
- 🔍 **Detailed Flight Information**: View aircraft details, routes, and live flight data
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An AirLabs API key ([Get one here](https://airlabs.co/))

### Installation

1. Clone the repository:
```sh
git clone <your-repo-url>
cd Flighttracker
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_AIRLABS_API_KEY=your_api_key_here
```

4. Start the development server:
```sh
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Building

To create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. **Install Vercel CLI** (optional):
```sh
npm i -g vercel
```

2. **Deploy**:
   - Option A: Connect your GitHub repository to Vercel (recommended)
     - Go to [vercel.com](https://vercel.com)
     - Import your repository
     - Add environment variable `VITE_AIRLABS_API_KEY` in project settings
     - Deploy!

   - Option B: Deploy via CLI:
```sh
vercel
```

3. **Environment Variables**:
   Make sure to add `VITE_AIRLABS_API_KEY` in your Vercel project settings:
   - Go to Project Settings → Environment Variables
   - Add `VITE_AIRLABS_API_KEY` with your API key value
   - Redeploy if needed

The project uses `@sveltejs/adapter-vercel` which automatically configures the deployment.

## Project Structure

```
src/
├── lib/
│   ├── api/          # API integration (AirLabs)
│   ├── components/   # Svelte components
│   ├── config/       # Configuration files
│   └── utils/        # Utility functions
├── routes/           # SvelteKit routes
│   └── api/          # API endpoints
└── global.css        # Global styles
```

## Technologies Used

- **SvelteKit** - Framework
- **D3.js** - Data visualization and globe rendering
- **TopoJSON** - Geographic data
- **Vercel** - Deployment platform

## License

MIT
