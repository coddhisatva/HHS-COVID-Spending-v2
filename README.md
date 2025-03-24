# HHS COVID Spending Dashboard

A dashboard for visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response.

## Features

- **Dashboard Layout:** Clean, responsive design with header, filters, and summary metrics
- **Filter Panel:** Multiple filter options for customizing data views
- **Summary Metrics:** Key financial indicators with formatted values

## Technology Stack

- **Framework:** Next.js with App Router
- **Styling:** Tailwind CSS
- **Data Visualization:** [Recharts/D3.js to be implemented in future iterations]

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/hhs-covid-spending-v2.git
   cd hhs-covid-spending-v2
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                    # Next.js App Router directory
│   ├── components/         # React components
│   │   ├── Header.tsx      # Dashboard header
│   │   ├── FilterPanel.tsx # Filter options panel
│   │   └── SummaryMetrics.tsx # Summary metrics cards
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard page
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Planned Features

- Interactive data visualizations
- Time-series analysis
- Detailed data tables
- Export functionality
- Advanced filtering options 