// lib/projects.ts
import { readStore } from '@/lib/cms-store';

export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  year: string;
  category: 'Residential' | 'Commercial' | 'Hospitality' | 'Landscape' | 'Mixed Use';
  type: string;
  image: string;
  heroImage?: string;
  description: string;
  challenge: string;
  approach: string;
  solution: string;
  featured: boolean;
  gallery?: string[];
}

const fallbackProjects: Project[] = [
  {
    id: '1',
    slug: 'chackalaparambil-house',
    name: 'Chackalaparambil House',
    location: 'Kottayam, Kerala, India',
    year: '2024',
    category: 'Residential',
    type: 'Residential / Architecture',
    image: '/images/projects/chackalaparambil-house.jpg',
    heroImage: '/images/projects/chackalaparambil-house.jpg',
    description: 'A refined contemporary residence in Kottayam, designed around natural light, spatial flow, and contextually grounded architecture.',
    challenge: 'Creating a spacious modern family home in Kottayam that balances privacy, climate-responsive tropical design, and elegant spatial continuity.',
    approach: 'Distilling vernacular Kerala spatial geometry into crisp modern forms with large shaded overhangs, open living zones, and seamless indoor-outdoor transitions.',
    solution: 'A light-filled residence featuring expansive glass openings, natural material accents, and framed garden views tailored to tropical living.',
    featured: true,
    gallery: ['/images/projects/chackalaparambil-house.jpg'],
  },
  {
    id: '2',
    slug: 'poovathanath-house',
    name: 'Poovathanath House',
    location: 'Thiruvalla, Kerala, India',
    year: '2024',
    category: 'Residential',
    type: 'Residential / Architecture',
    image: '/images/projects/poovathanath-house.png',
    heroImage: '/images/projects/poovathanath-house.png',
    description: 'An elegant luxury residence in Thiruvalla blending warm timber detailing, clean architectural lines, and lush tropical landscaping.',
    challenge: 'Designing a residence that responds to Thiruvalla\'s climate while crafting an imposing yet warm architectural presence.',
    approach: 'Organizing the home around central family gathering spaces with deep verandahs, textured exterior surfaces, and rich wood craftsmanship.',
    solution: 'A striking contemporary villa surrounded by curated gardens, with shaded balconies and high ceilings that facilitate natural ventilation.',
    featured: true,
    gallery: ['/images/projects/poovathanath-house.png'],
  },
  {
    id: '3',
    slug: 'st-thomas-church-pala',
    name: 'St. Thomas Church',
    location: 'Pala, Kerala, India',
    year: '2024',
    category: 'Commercial',
    type: 'Assembly / Sacral Architecture',
    image: '/images/projects/st-thomas-church-exterior.png',
    heroImage: '/images/projects/st-thomas-church-exterior.png',
    description: 'A modern sacral landmark in Pala combining dramatic structural geometry, serene natural acoustics, and contemplative interior lighting.',
    challenge: 'Designing a sacred assembly space in Pala that accommodates large congregations while maintaining a reverent, intimate spiritual atmosphere.',
    approach: 'Synthesizing traditional ecclesiastical proportions with expressive modern structural forms and rhythmic facade verticality.',
    solution: 'A landmark church featuring soaring interior volume, acoustic optimization, and strategic daylighting that creates a powerful sense of sanctuary.',
    featured: true,
    gallery: [
      '/images/projects/st-thomas-church-exterior.png',
      '/images/projects/st-thomas-church-interior-1.png',
      '/images/projects/st-thomas-church-interior-2.png',
    ],
  },
  {
    id: '4',
    slug: 'vettikalayil-house',
    name: 'Vettikalayil House',
    location: 'Changanassery, Kerala, India',
    year: '2024',
    category: 'Residential',
    type: 'Residential / Architecture',
    image: '/images/projects/vettikalayil-house.jpg',
    heroImage: '/images/projects/vettikalayil-house.jpg',
    description: 'A modern architectural villa in Changanassery characterized by geometric massing, warm timber accents, and integrated garden courtyards.',
    challenge: 'Crafting a distinctive multi-generational family home on a lush plot in Changanassery.',
    approach: 'Layering solid masonry volumes with open timber-lined verandahs and courtyard cutouts that invite natural air and daylight.',
    solution: 'A sophisticated modern residence with framed landscape views, warm interior woodwork, and climate-conscious sun shading.',
    featured: true,
    gallery: ['/images/projects/vettikalayil-house.jpg'],
  },
];

export const getProjects = (): Project[] => {
  if (typeof window === 'undefined') {
    return readStore<Project[]>('projects.json', fallbackProjects);
  }
  return fallbackProjects;
};

export const projects: Project[] = getProjects();

export const getFeaturedProjects = () => getProjects().filter((p) => p.featured);

export const getProjectBySlug = (slug: string) => {
  const rawSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  const cleanSlug = rawSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return getProjects().find((p) => {
    if (!p) return false;
    const pSlug = (p.slug || p.id || '').toLowerCase().trim();
    const pCleanSlug = pSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pNameSlug = (p.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return pSlug === rawSlug || pCleanSlug === cleanSlug || pNameSlug === cleanSlug;
  });
};

export const getRelatedProjects = (currentSlug: string, category: string) => {
  const all = getProjects();
  const filtered = all.filter((p) => p.slug !== currentSlug && p.category === category);
  if (filtered.length > 0) {
    return filtered.slice(0, 3);
  }
  return all.filter((p) => p.slug !== currentSlug).slice(0, 3);
};

export type ProjectCategory = 'All Projects' | 'Residential' | 'Commercial' | 'Hospitality' | 'Landscape' | 'Mixed Use';
