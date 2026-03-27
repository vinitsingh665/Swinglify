# Swinglify 📈  
**The Premium Swing Trading Intelligence Platform**

Swinglify is a modern, high-performance web application designed to empower swing traders with real-time market insights, advanced technical screening, and a vibrant community hub. Built with Next.js, Swinglify transforms complex market data into an intuitive, visually stunning *"Midnight Quantum"* dark-mode experience.

---

## 🌟 Key Features

### 1. Market Intelligence Dashboard
- **Live Market Pulse:** Real-time tracking of major indices (Nifty 50, Bank Nifty, Sensex) with bullish/bearish market sentiment analysis.
- **Advance/Decline Insights:** Visual representation of market breadth to quickly gauge the day's momentum.
- **Dynamic Opportunities:** Auto-generated, actionable lists for Top Movers, Volume Spikes, RSI Breakouts, and 52-Week Highs.

### 2. Advanced Screener
- **Multi-Parameter Filtering:** Screen Indian equities (NSE/BSE) based on market cap, price structure, performance, and technical indicators.
- **Index-Based Categories:** One-click filtering for over 15 distinct categories including Broad Market (Nifty 500), Size-Based (Midcap 150), Sectoral (IT, Auto, Pharma), and Thematic indices (PSU Bank).
- **Technical Signals:** Integrated TradingView data providing composite indicator scores (Strong Buy, Buy, Hold, Sell, Strong Sell).

### 3. Analytics & Market Breadth
- **Moving Average Breadth:** At-a-glance visualization of the percentage of stocks trading above their 10, 20, 50, and 200 EMAs.
- **Sector Heatmaps & Performance:** Real-time tracking of the strongest and weakest market sectors.
- **Trend Signals:** Aggregated counts of overbought/oversold RSI states and pivotal EMA crossovers.

### 4. Interactive Portfolio & Alerts System
- **Portfolio Tracking:** Add holdings with an intuitive modal, track average buy prices against live quotes, and visualize asset allocation via an interactive donut chart.
- **Smart Alerts:** Configure custom price alerts (Above/Below) using a responsive, dashboard-integrated panel backed by MongoDB.

### 5. Community Trading Hub (Reddit-Style)
- **Discussion Feed:** A dedicated forum for traders to share setups, charts, and strategies.
- **Interactions:** Full support for upvoting, commenting, and nested replies.
- **Authentication:** Secure Google OAuth integration via NextAuth.

### 6. Mobile-First Experience
- **Adaptive UI:** A highly responsive design featuring a persistent mobile bottom navigation bar with an expandable secondary flyout menu.
- **Action Links:** Context-aware "Add to Portfolio" and "Set Alert" deep links directly embedded within the Watchlist and Market tables.

---

## 🛠 Technology Stack

- **Frontend:** Next.js (App Router), React 18, HTML5, Vanilla CSS 
- **Styling Paradigm:** Custom "Midnight Quantum" Design System (Glassmorphism, CSS Variables, Curated Dark/Light Themes)
- **Backend/API:** Next.js API Routes (Serverless)
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** NextAuth.js (Google Provider)
- **Market Data:** TradingView Screener API Integration (Reverse-engineered payload mapping)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A MongoDB Atlas connection string
- Google OAuth Client ID and Secret (for authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vinitsingh665/Swinglify.git
   cd Swinglify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # NextAuth
   NEXTAUTH_URL=http://localhost:3050
   NEXTAUTH_SECRET=your_nextauth_secret_here

   # Google OAuth
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev:next
   # The application will start on http://localhost:3050
   ```

---

## 🏗 Architecture Highlights

- **`lib/api-core.js`:** The central nervous system for market data. Handles complex payload structuring to query the TradingView API, caches responses, and parses raw numerical data into human-readable signal scores and EMA targets.
- **`hooks/`:** Custom React hooks (`usePortfolio`, `useAlerts`, `useWatchlist`) that manage local storage state synchronization alongside database persistence for authenticated users.
- **`components/`:** A library of reusable, styled components adhering strictly to the custom CSS theme variables without relying on utility classes like Tailwind.

---

## 📄 License
This project is proprietary. All rights reserved.
