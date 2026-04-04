# Satyam Prajapati - Portfolio Website

A modern, responsive portfolio website showcasing projects, blog posts, and engineering insights. Built with **React 19**, **TypeScript**, and **Vite**.

## 🎯 Features

- **Responsive Design** - Mobile-first approach with 3 breakpoints (mobile, tablet, desktop)
- **Dark/Light Theme** - Toggle between dark and light modes with localStorage persistence
- **Project Showcase** - Detailed project pages with architecture decisions, challenges, and solutions
- **Blog System** - Markdown-based blog with syntax highlighting and draft/publish states
- **Admin Panel** - PIN-protected dashboard for managing projects and blog posts
- **Real-time Architecture Editor** - Add decisions, challenges, and learnings with intuitive UI
- **Live Project Links** - Display live demos alongside GitHub repositories
- **SEO Friendly** - Optimized for search engines with meta tags and semantic HTML

## 🛠 Tech Stack

- **Frontend Framework**: React 19.2.4
- **Language**: TypeScript 4.9.5
- **Build Tool**: Vite 8.0.3
- **Routing**: React Router DOM 7.14.0
- **Icons**: Lucide React 1.7.0
- **Markdown**: React Markdown + React Syntax Highlighter
- **State Management**: React Context API + useMemo/useCallback optimization
- **Styling**: CSS3 with CSS Variables

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.tsx              # Navigation with theme toggle
├── context/
│   ├── ProjectContext.tsx       # Project management (CRUD)
│   ├── BlogContext.tsx          # Blog management (CRUD)
│   └── ThemeContext.tsx         # Dark/Light theme toggle
├── pages/
│   ├── HomePage.tsx             # Landing page with projects & blog preview
│   ├── ProjectsPage.tsx         # All projects with filtering
│   ├── ProjectDetailPage.tsx    # Detailed project view with architecture
│   ├── BlogPage.tsx             # Published blog posts listing
│   ├── BlogPostPage.tsx         # Individual blog post with markdown
│   ├── ContactPage.tsx          # Contact form & links
│   └── admin/
│       └── AdminPage.tsx        # Admin dashboard (PIN protected)
├── data/
│   └── projects.ts              # Project data structure
├── styles/
│   └── global.css               # Global styles & responsive breakpoints
├── App.tsx                      # Main app routing
└── index.tsx                    # Entry point
public/
├── index.html                   # Base HTML template
├── favicon.ico                  # Browser tab icon
└── manifest.json                # PWA manifest
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/satyam0777/satyam-portfolio-complete.git
cd satyam-portfolio-complete

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 🔐 Admin Panel

Access the admin dashboard at `/admin` with PIN: **`satyam2025`**

### Admin Features:
- **Blog Manager**: Create, edit, publish/draft blog posts
- **Project Manager**: Manage projects with full architecture documentation
- Add project decisions with title and reasoning
- Add challenges with problem/solution format
- Document learnings and scaling thoughts
- Real-time preview for blog posts

## 📱 Responsive Breakpoints

- **Mobile**: ≤ 640px
- **Tablet**: 641px - 1024px
- **Desktop**: ≥ 1025px

All components automatically adapt to screen size with proper spacing, font scaling, and layout adjustments.

## 💾 Data Persistence

All data is stored in browser's `localStorage`:
- `sp-projects` - Project data
- `sp-blogs` - Blog post data
- `sp-theme` - Theme preference (light/dark)
- `sp-admin` - Admin authentication status

## 🎨 Theme System

CSS Variables for easy theme switching:

**Dark Mode** (`data-theme="dark"`):
- Primary: #0a0a0a
- Accent: #00ff94
- Text Primary: #f0f0f0

**Light Mode** (`data-theme="light"`):
- Primary: #ffffff
- Accent: #006b3c
- Text Primary: #1a1a1a

## 📝 Project Structure Example

Each project includes:
```typescript
{
  id: string;
  num: string;                    // Project number (e.g., "01")
  name: string;
  tagline: string;
  type: 'fullstack' | 'backend' | 'planned';
  status: 'live' | 'building' | 'planned';
  stack: string[];                // Technologies used
  description: string;
  githubUrl: string;
  liveUrl?: string;               // Optional live demo link
  highlights: string[];           // Key points
  architecture: {
    overview: string;
    intuition: string;            // Core design thinking
    diagram: string;              // ASCII diagram
    decisions: Array<{
      title: string;
      reasoning: string;
    }>;
    challenges: Array<{
      problem: string;
      solution: string;
    }>;
    whatILearned: string[];
    scalingThoughts: string;
  };
}
```

## 📚 Blog Post Structure

```typescript
{
  id: string;
  title: string;
  slug: string;                   // URL-friendly identifier
  tag: string;                    // Category tag
  excerpt: string;                // Short summary
  content: string;                // Markdown content
  coverImage?: string;            // Optional cover image
  publishedAt: string;            // YYYY-MM-DD format
  readTime: number;               // Minutes to read
  published: boolean;             // Draft/Published status
}
```

## ⚙️ Configuration

### Vite Config
- Port: 3000
- Auto-open browser on dev
- Source maps disabled for production
- Output directory: `dist/`

### TypeScript
- Target: ES5
- Strict mode enabled
- JSX: React 17+ runtime
- Module resolution: node

## 🔍 Performance Features

- **React.memo** on all components to prevent unnecessary re-renders
- **useMemo** for expensive computations
- **useCallback** for stable function references
- **Context API** with proper memoization
- Lazy loading with React Router
- CSS animations for smooth transitions

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 📞 Contact

- **Email**: officialsatyam0777@gmail.com
- **GitHub**: [@satyam0777](https://github.com/satyam0777)
- **Phone**: +91 7985792091

## 📄 License

This project is open source and available for personal and commercial use.

---

**Built with ❤️ while learning. Shipped with intent.**
