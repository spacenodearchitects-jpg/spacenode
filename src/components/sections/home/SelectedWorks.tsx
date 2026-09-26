'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RevealWrapper from '@/components/ui/RevealWrapper';
import { getFeaturedProjects, Project } from '@/lib/projects';

export default function SelectedWorks() {
  const [featured, setFeatured] = useState<Project[]>(getFeaturedProjects());

  useEffect(() => {
    fetch('/api/cms/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeatured(data.filter((p: Project) => p.featured));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-32 md:py-40 bg-white" aria-labelledby="selected-works-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        
        {/* Header */}
        <RevealWrapper className="flex items-end justify-between mb-16">
          <div>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-[#0D7A9E] block mb-4">
              Selected Works
            </span>
            <h2 id="selected-works-heading" className="font-serif text-4xl md:text-5xl text-[#161616] leading-tight">
              Architecture that<br />
              <span className="italic">endures.</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-2 group font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#161616] border-b border-transparent hover:border-[#0D7A9E] hover:text-[#0D7A9E] pb-1 transition-all duration-300"
          >
            View All Projects
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </RevealWrapper>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {featured.map((project, i) => (
            <RevealWrapper key={project.id || project.slug} delay={i * 0.1}>
              <Link href={`/projects/${project.slug}`} className="group block">
                {/* Image */}
                <div className="overflow-hidden aspect-[4/5] mb-5 relative bg-[#F8F9FA]">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Blue overlay on hover */}
                  <div className="absolute inset-0 bg-[#0D7A9E]/0 group-hover:bg-[#0D7A9E]/15 transition-all duration-500" />
                  {/* View project pill */}
                  <div className="absolute bottom-4 right-4 bg-[#0D7A9E] text-white px-4 py-2 font-sans text-[10px] tracking-[0.15em] uppercase translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5">
                    View Project <ArrowRight size={11} />
                  </div>
                </div>

                {/* Project info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#161616] mb-1 group-hover:text-[#0D7A9E] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#6B7280]">
                      {project.location} · {project.type ? project.type.split('/')[0].trim() : project.category}
                    </p>
                  </div>
                  <span className="font-sans text-[10px] tracking-[0.1em] text-[#0D7A9E] font-semibold mt-0.5">
                    {project.year}
                  </span>
                </div>
              </Link>
            </RevealWrapper>
          ))}
        </div>

        {/* Node connection line between projects */}
        <RevealWrapper className="mt-8 flex items-center justify-center gap-0">
          <svg className="w-full max-w-2xl h-4" viewBox="0 0 600 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="8" r="3" fill="#0D7A9E" opacity="0.6"/>
            <line x1="3" y1="8" x2="297" y2="8" stroke="#0D7A9E" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"/>
            <circle cx="300" cy="8" r="4" fill="#0D7A9E" opacity="0.8"/>
            <line x1="303" y1="8" x2="597" y2="8" stroke="#0D7A9E" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"/>
            <circle cx="600" cy="8" r="3" fill="#0D7A9E" opacity="0.6"/>
          </svg>
        </RevealWrapper>

        {/* Mobile CTA */}
        <RevealWrapper className="mt-8 md:hidden">
          <Link
            href="/projects"
            className="flex items-center justify-center gap-2 border border-[#0D7A9E] text-[#0D7A9E] py-4 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase"
          >
            View All Projects <ArrowRight size={13} />
          </Link>
        </RevealWrapper>
      </div>
    </section>
  );
}
