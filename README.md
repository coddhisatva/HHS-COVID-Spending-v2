# HHS COVID Spending Dashboard
<img width="1497" alt="Screenshot 2025-03-24 at 12 14 10 AM" src="https://github.com/user-attachments/assets/a64cf52f-e8f9-4c11-b286-e26dd8f4619c" />

A dashboard for visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response in 2025.

Live site: https://hhs-covid-spending-v2.vercel.app/

Data from: https://www.usaspending.gov/download_center/custom_award_data

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

## Deployment

This project is configured for deployment on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js configuration
4. The custom `vercel.json` file configures the build settings:
   - Sets the output directory to `.next`
   - Uses the Next.js framework preset

## Project Structure

```
/
├── app/                    # Next.js App Router directory
│   ├── components/         # React components
│   │   ├── Header.tsx      # Dashboard header
│   │   ├── Sidebar.tsx     # Sidebar filter panel
│   │   ├── HorizontalFilters.tsx # Horizontal filters component
│   │   └── SummaryMetrics.tsx # Summary metrics cards
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard page
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── vercel.json             # Vercel deployment configuration
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
