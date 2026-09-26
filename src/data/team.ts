import { readStore } from '@/lib/cms-store';

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  image: string;
  highlights: string[];
  desc: string[];
}

const fallbackTeam: TeamMember[] = [
  { 
    slug: 'jeffin-kuncheria-varghese',
    name: 'Ar. Jeffin Kuncheria Varghese', 
    title: 'Founder & Principal Architect', 
    image: '/images/team/jeffin.jpg', 
    highlights: [
      "Founded Space Node Architects in 2017",
      "Focuses on functional, context-driven design",
      "Global portfolio spanning India, UAE, and USA"
    ],
    desc: [
      "Jeffin is the Founder and Principal Architect of Space Node Architects, established in 2017. His practice is driven by a clear architectural intent—where space is shaped through function, context, and structural honesty rather than excess.",
      "With projects across India, the UAE, and the USA, spanning residential, commercial, and assembly typologies, his work reflects a disciplined yet adaptive approach to design and execution.",
      "Under his leadership, Space Node Architects focuses on creating precise, enduring architecture defined by clarity, proportion, and material integrity."
    ]
  },
  { 
    slug: 'jinsa-reji',
    name: 'Ar. Jinsa Reji', 
    title: 'Design Head & Co-founder', 
    image: '/images/team/jinsa.jpg', 
    highlights: [
      "Leads the studio's creative direction",
      "Expertise across India, UAE, and Australia",
      "Specializes in timeless, enduring environments"
    ],
    desc: [
      "Jinsa is the Design Head & Co-founder of Space Node Architects, bringing extensive professional experience across India, the UAE, and Australia. Since 2017, she has worked on a diverse portfolio of residential, commercial, and interior projects, developing a design approach that is both globally informed and deeply responsive to local context.",
      "She leads the studio's creative direction, guiding projects from the earliest design concepts through to execution. With expertise in design development, multidisciplinary coordination, and project delivery, she ensures that every project is thoughtfully resolved with clarity, precision, and attention to detail.",
      "Her work is driven by the belief that architecture should elevate everyday life through spaces that are purposeful, timeless, and enduring. By balancing innovation with practicality, she creates environments that reflect each client's vision while responding sensitively to their context, function, and way of living.",
      "As Design Head, Jinsa is committed to shaping architecture and interiors that embody refined aesthetics, technical excellence, and a lasting sense of place."
    ]
  },
  { 
    slug: 'bibite-joy',
    name: 'Ar. Bibite Joy', 
    title: 'Associate Architect', 
    image: '/images/team/bibite.jpg', 
    highlights: [
      "Over a decade of professional experience",
      "Expert in large-scale & complex projects",
      "Specializes in technical coordination and delivery"
    ],
    desc: [
      "Bibite Joy is an Associate Architect collaborating with Space Node Architects on large-scale and complex projects, bringing over a decade of professional experience in architecture and project delivery. With extensive expertise in residential and commercial developments across Kerala, he contributes a deep understanding of regional design practices, construction methodologies, and project execution.",
      "His experience spans the complete design and delivery process, from conceptual planning and technical coordination to on-site execution, ensuring that every project is resolved with precision and practicality. Known for his collaborative approach and attention to detail, he works closely with the design team to translate ideas into well-crafted architectural solutions.",
      "At Space Node Architects, Bibite plays a key role in delivering projects that balance design excellence, technical integrity, and functional performance, contributing to spaces that are thoughtful, enduring, and contextually responsive."
    ]
  },
  { 
    slug: 'george-zacharia-mathew',
    name: 'Ar. George Zacharia Mathew', 
    title: 'Consulting Architect', 
    image: '/images/team/george.jpg', 
    highlights: [
      "10+ years of architectural experience",
      "Focuses on sustainable, context-driven design",
      "Collaborates on projects across India and USA"
    ],
    desc: [
      "George Zacharia is a Consulting Architect with over 10 years of professional experience in architectural design, planning, and project execution across a wide range of typologies and scales. His practice is guided by a strong emphasis on contextual responsiveness, functional efficiency, and a refined contemporary architectural approach.",
      "He combines conceptual clarity with technical expertise to develop well-resolved spatial solutions that are both purposeful and precise in execution.",
      "He is currently engaged in a collaborative practice with Space Node Architects, delivering projects across India and the United States, with a focus on sustainable, context-driven residential and commercial architecture."
    ]
  },
];

export const getTeam = (): TeamMember[] => {
  if (typeof window === 'undefined') {
    return readStore<TeamMember[]>('team.json', fallbackTeam);
  }
  return fallbackTeam;
};

export const team: TeamMember[] = getTeam();

