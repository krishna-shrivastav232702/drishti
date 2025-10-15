# Drishti — Evidence You Can Cite

A polished, frontend-only Next.js demo for an AI-powered research platform that helps discover, analyze, and cite credible evidence.

## 🚀 Features

- **Home Page**: Hero section with feature tiles and CTAs showcasing the platform's capabilities
- **Ingest Documents**: Drag-and-drop file upload with AI-powered processing simulation and insights
- **Search Evidence**: Natural language search with simulated results and filtering
- **Knowledge Graph**: Interactive network visualization using React Cytoscape with clickable nodes
- **Research Timeline**: Chronological timeline view with multiple layout modes using react-chrono
- **Reports & Citations**: Export functionality with multiple citation formats (BibTeX, APA, MLA, etc.) and data visualization using Recharts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **UI Components**: 
  - shadcn/ui (built on Radix UI primitives)
  - Framer Motion for micro-animations
  - Lucide React for icons
- **Visualizations**:
  - React Cytoscape for network graphs
  - Recharts for charts and analytics
  - react-chrono for timeline views
- **Fonts**: Poppins (headings) and Inter (body text)
- **Theme**: Dark/light mode toggle with system preference detection

## 📦 Installation & Setup

1. **Install dependencies**:
```bash
npm install
# or
pnpm install
# or
bun install
```

2. **Run the development server**:
```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
drishti/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── ingest/page.tsx    # Document upload
│   │   ├── search/page.tsx    # Search interface
│   │   ├── network/page.tsx   # Network graph
│   │   ├── timeline/page.tsx  # Timeline view
│   │   └── reports/page.tsx   # Reports & export
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navigation.tsx    # Top navigation bar
│   │   ├── footer.tsx        # Footer component
│   │   └── theme-provider.tsx # Theme context
│   ├── data/                 # Mock JSON data
│   │   ├── documents.json    # Sample research documents
│   │   ├── network.json      # Graph nodes & edges
│   │   └── timeline.json     # Timeline events
│   └── lib/
│       └── utils.ts          # Utility functions
├── public/                    # Static assets
└── package.json
```

## 🎨 Design System

### Brand Colors
- **Primary**: Deep indigo (`oklch(0.45 0.19 264)`)
- **Secondary**: Light lavender
- **Accent**: Soft cyan
- **Backgrounds**: Clean whites/dark grays

### Typography
- **Headings**: Poppins (weights: 400-700)
- **Body**: Inter (weights: 300-700)

## 🔧 Key Components

### Navigation
- Sticky header with route highlighting
- Dark/light mode toggle
- Responsive mobile menu (implicit via Tailwind)

### Pages

#### 1. Home (`/`)
- Hero section with gradient background
- Feature tiles with hover effects
- Benefits showcase
- Call-to-action sections

#### 2. Ingest (`/ingest`)
- Drag-and-drop file upload zone
- Processing queue with progress bars
- AI advisor panel with tips
- Simulated file processing (2s per file)

#### 3. Search (`/search`)
- Natural language search bar
- Loading skeletons during search
- Results table with filters and sorting
- Add to report functionality

#### 4. Network (`/network`)
- Interactive Cytoscape.js graph
- Zoom, pan, and reset controls
- Node type legend (documents, authors, topics)
- Side drawer with node details
- Network statistics panel

#### 5. Timeline (`/timeline`)
- react-chrono timeline visualization
- Multiple view modes (vertical, horizontal, alternating)
- Event detail drawer
- Timeline statistics

#### 6. Reports (`/reports`)
- Selected items management
- Citation export (BibTeX, APA, MLA, Chicago, JSON, CSV)
- Recharts visualization
- Statistics dashboard

## 📊 Mock Data

All data is stored locally in JSON files:

- **documents.json**: 10 research documents with metadata
- **network.json**: 18 nodes and 20 edges representing relationships
- **timeline.json**: 10 chronological events from June-November 2023

## 🎯 Simulated Features

- **File Upload**: Simulates processing with setTimeout (200ms per 10% progress)
- **Search**: Filters local documents with 1.5s delay
- **Network Loading**: 1s delay before rendering graph
- **Timeline Loading**: 1s delay before rendering timeline
- **Export**: Shows success toast (no actual file download)

## 🌓 Dark Mode

Fully functional dark/light mode toggle:
- Persists preference to localStorage
- System preference detection
- Smooth transitions between themes
- All components styled for both modes

## 📱 Responsive Design

Mobile-first approach using Tailwind CSS:
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Flexible layouts with grid and flexbox
- Touch-friendly interactive elements
- Responsive navigation and tables

## 🚫 No Backend Required

This is a **frontend-only demo**:
- No API routes or server actions
- All data loaded from local JSON files
- No database connections
- Ready to run immediately with `npm run dev`

## 🎨 Customization

### Brand Colors
Edit `src/app/globals.css` to customize the color scheme:
```css
:root {
  --primary: oklch(0.45 0.19 264);
  --secondary: oklch(0.88 0.08 264);
  /* ... more colors */
}
```

### Mock Data
Update JSON files in `src/data/` to change the content displayed.

### Fonts
Modify the Google Fonts import in `globals.css` to use different typefaces.

## 📝 License

This is a demo project for educational and demonstration purposes.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Cytoscape](https://github.com/plotly/react-cytoscapejs)
- [Recharts](https://recharts.org/)
- [react-chrono](https://github.com/prabhuignoto/react-chrono)

---

**Ready to explore evidence-based research? Run `npm run dev` and start discovering!** 🔍✨