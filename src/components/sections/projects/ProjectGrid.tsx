'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isLarge = index === 0 || index === 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/projects/${project.slug || project.id}`} className="group block relative overflow-hidden rounded-2xl">
        <div className={`relative overflow-hidden ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <Image
            src={project.image}
            alt={project.name}
            fill
            unoptimized={project.image?.startsWith('data:')}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2333]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[#0D7A9E]/0 group-hover:bg-[#0D7A9E]/10 transition-colors duration-500" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#6EB8D0] mb-2 block font-semibold">
              {project.category}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-white mb-1">
              {project.name}
            </h3>
            <p className="font-sans text-[11px] tracking-[0.1em] text-white/60 uppercase">
              {project.location} · {project.year}
            </p>
          </div>

          {/* View button */}
          <div className="absolute top-4 right-4 bg-white/0 group-hover:bg-[#0D7A9E] border border-white/20 group-hover:border-[#0D7A9E] text-white px-4 py-2 font-sans text-[9px] tracking-[0.15em] uppercase translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 rounded-lg">
            View <ArrowUpRight size={10} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectGrid({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);

  useEffect(() => {
    fetch('/api/cms/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjectList(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projectList.map((project, i) => (
        <ProjectCard key={project.id || project.slug || i} project={project} index={i} />
      ))}
    </div>
  );
}
