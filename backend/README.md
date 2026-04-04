# Backend Server Documentation

## Directory Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── models/
│   ├── Project.js           # Project MongoDB schema
│   └── Blog.js              # Blog MongoDB schema
├── routes/
│   ├── projects.js          # Projects API endpoints
│   └── blogs.js             # Blogs API endpoints
├── middleware/
│   └── errorHandler.js      # Global error handling
├── scripts/
│   └── seed.js              # Database seeder
├── server.js                # Main Express server
├── .env.example             # Environment template
└── README.md                # This file
```

## Setup

### 1. Install Dependencies
```bash
cd ..
npm install
```

### 2. Create `.env` file
Copy `.env.example` to `.env` and fill in MongoDB URI:
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://portfolio_user:PASSWORD@cluster.mongodb.net/satyam-portfolio?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
```

### 3. Seed Database
```bash
node backend/scripts/seed.js
```

## Commands

### Development
```bash
# Start backend (with auto-reload)
npm run server:dev

# Start frontend
npm run dev
```

### Database
```bash
# Populate database with initial data
node backend/scripts/seed.js
```

### Testing
```bash
# Test API endpoints
curl http://localhost:5000/api/projects
curl http://localhost:5000/api/blogs
curl http://localhost:5000/api/health
```

## API Endpoints

### Projects

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/projects` | Get all projects |
| `GET` | `/api/projects/:id` | Get project by ID |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Blogs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/blogs` | Get all blogs |
| `GET` | `/api/blogs/:id` | Get blog by ID |
| `POST` | `/api/blogs` | Create blog |
| `PUT` | `/api/blogs/:id` | Update blog |
| `DELETE` | `/api/blogs/:id` | Delete blog |

### Health

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/health` | Health check |

## Error Handling

All errors are handled centrally by `middleware/errorHandler.js`:
- **400**: Validation errors, duplicate keys
- **404**: Resource not found
- **500**: Server errors

Response format:
```json
{
  "error": "Error message",
  "details": [...],
  "stack": "..." // Only in development
}
```

## Database Schemas

### Project
```javascript
{
  id: String (unique),
  num: String,
  name: String,
  tagline: String,
  type: 'fullstack' | 'backend' | 'planned',
  status: 'live' | 'building' | 'planned',
  stack: [String],
  description: String,
  githubUrl: String,
  liveUrl: String,
  highlights: [String],
  architecture: {
    overview: String,
    intuition: String,
    diagram: String,
    decisions: [{ title, reasoning }],
    challenges: [{ problem, solution }],
    whatILearned: [String],
    scalingThoughts: String
  },
  timestamps: true
}
```

### Blog
```javascript
{
  id: String (unique),
  title: String,
  slug: String (unique),
  tag: String,
  excerpt: String,
  content: String,
  publishedAt: String,
  readTime: Number,
  published: Boolean,
  timestamps: true
}
```

## Deployment

### Vercel

1. Backend is configured for Vercel serverless functions
2. Make sure `vercel.json` is in project root
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NODE_ENV=production`

### Local MongoDB vs MongoDB Atlas

- **Local**: `mongodb://localhost:27017/satyam-portfolio`
- **Cloud**: Use MongoDB Atlas connection string (recommended for production)

## Troubleshooting

### MongoDB Connection Failed
- Check connection string in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure username/password are correct

### API Endpoints Return 404
- Check backend is running
- Verify routes are registered in `server.js`
- Check route files exist in `routes/`

### Changes Not Persisting
- Verify data is being sent to correct endpoint
- Check browser network tab for errors
- Check backend console for error messages

## Development Notes

- Backend runs on port 5000 by default
- Frontend should use `REACT_APP_API_URL=http://localhost:5000/api`
- All errors are logged to console
- Database seeders clear data before inserting (be careful!)
