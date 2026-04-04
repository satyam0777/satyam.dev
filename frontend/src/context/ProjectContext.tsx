
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface Project {
  id: string;
  num: string;
  name: string;
  tagline: string;
  type: 'fullstack' | 'backend' | 'planned';
  status: 'live' | 'building' | 'planned';
  stack: string[];
  description: string;
  githubUrl: string;
  liveUrl?: string;
  highlights: string[];
  architecture: {
    overview: string;
    intuition: string;
    diagram: string;
    decisions: { title: string; reasoning: string }[];
    challenges: { problem: string; solution: string }[];
    whatILearned: string[];
    scalingThoughts: string;
  };
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'vetcare',
    num: '01',
    name: 'VetCare',
    tagline: 'Veterinary Telemedicine Platform',
    type: 'fullstack',
    status: 'live',
    stack: ['Node.js', 'React', 'MongoDB', 'Socket.IO', 'Razorpay', 'Agora RTC', 'JWT', 'Express'],
    description: 'Production telemedicine platform connecting farmers with veterinary doctors — appointment scheduling, HD video consultations, post-consultation payment with automated commission distribution, and real-time notifications.',
    githubUrl: 'https://github.com/satyam0777',
    liveUrl: 'https://vetcare.example.com',
    highlights: [
      '50+ RESTful APIs with JWT auth and role-based authorization',
      '12 MongoDB schemas with compound indexing — queries dropped from 4.5s to 50ms',
      'Razorpay with HMAC webhook verification + 18% automated commission model',
      'Socket.IO real-time notifications across farmer/vet/admin roles',
      'Agora RTC WebRTC video calling integration',
      'Deployed on Vercel + Render with CI/CD — 99.9% uptime',
    ],
    architecture: {
      overview: 'Three-role system (Farmer, Vet, Admin) with separate API surfaces for each.',
      intuition: 'The hardest design question was: when should payment be released to the vet?',
      diagram: 'Architecture diagram here',
      decisions: [
        {
          title: 'Compound Indexes on Appointment Queries',
          reasoning: 'Queries filtered by vetId + date + status were running collection scans at 4.5s.',
        },
      ],
      challenges: [
        {
          problem: 'Video calls dropping on poor rural internet connections',
          solution: 'Agora RTC handles adaptive bitrate by default.',
        },
      ],
      whatILearned: ['Webhook idempotency is non-negotiable in payment systems'],
      scalingThoughts: 'At scale, Socket.IO would need Redis adapter.',
    },
  },
];

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

export interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: INITIAL_PROJECTS,
  addProject: async () => {},
  updateProject: async () => {},
  deleteProject: async () => {},
  refreshProjects: async () => {},
  loading: false,
  error: null,
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from sessionStorage
  const getAuthHeader = () => {
    const token = sessionStorage.getItem('sp-admin-token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data || INITIAL_PROJECTS);
      localStorage.setItem('sp-projects', JSON.stringify(data || INITIAL_PROJECTS));
      setError(null);
    } catch (err) {
      console.warn('API unavailable, using localStorage:', err);
      try {
        const saved = localStorage.getItem('sp-projects');
        setProjects(saved ? JSON.parse(saved) : INITIAL_PROJECTS);
      } catch {
        setProjects(INITIAL_PROJECTS);
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    await fetchProjects();
  };

  const addProject = async (project: Project) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to add project');
      const newProject = await response.json();
      const updated = [...projects, newProject];
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
    } catch (err) {
      const updated = [...projects, project];
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
      console.error('Error adding project:', err);
    }
  };

  const updateProject = async (project: Project) => {
    try {
      const response = await fetch(`${API_URL}/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to update project');
      const updated = projects.map(p => p.id === project.id ? project : p);
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
    } catch (err) {
      const updated = projects.map(p => p.id === project.id ? project : p);
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
      console.error('Error updating project:', err);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to delete project');
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
    } catch (err) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('sp-projects', JSON.stringify(updated));
      console.error('Error deleting project:', err);
    }
  };

  const value = useMemo(
    () => ({ projects, addProject, updateProject, deleteProject, refreshProjects, loading, error }),
    [projects, loading, error]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
