import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RevealWrapper from '@/components/ui/RevealWrapper';
import NodeMesh from '@/components/ui/NodeMesh';
import ProjectGrid from '@/components/sections/projects/ProjectGrid';
import { getProjects, Project } from '@/lib/projects';
import { readStoreAsync } from '@/lib/cms-store';
import { getPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateMetadata(): Metadata {
  return getPageMetadata('projects');
}

export default async function ProjectsPage() {
  const initialProjects = await readStoreAsync<Project[]>('projects.json', getProjects());

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#F8F9FA] overflow-hidden" aria-label="Projects hero">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
          <NodeMesh variant="hero" animated={false} />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <RevealWrapper>
            <h1 className="font-serif text-5xl md:text-6xl text-[#161616] leading-[1.05] tracking-[-0.02em] mb-6 mt-6">
              Selected Works<span className="text-[#0D7A9E]">.</span>
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <p className="font-sans text-[#6B7280] text-sm font-semibold tracking-wide mb-2">
              Selected Projects.
            </p>
            <p className="font-sans font-light text-[#6B7280] text-sm leading-relaxed max-w-2xl">
              Every project is an exploration of space, light, material, and form—designed to enrich everyday life while responding to its unique context.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* Project Grid */}
      <section className="bg-[#F8F9FA] py-2" aria-label="Project gallery">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-12">
          <ProjectGrid initialProjects={initialProjects} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-[#0A2333] relative overflow-hidden" aria-label="Projects CTA">
        <div className="absolute inset-0 opacity-20">
          <NodeMesh variant="section" animated={true} />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20">
          <RevealWrapper>
            <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-4">
              Have a project<br />in <span className="italic text-[#6EB8D0]">mind?</span>
            </h2>
            <p className="font-sans font-light text-white/50 mb-10 max-w-sm">
              Let's create something extraordinary together. From private residences to global flagships.
            </p>
          </RevealWrapper>
          <RevealWrapper delay={0.1} className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact"
              className="group inline-flex items-center gap-3 bg-[#0D7A9E] text-white px-8 py-4 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#178CB5] transition-all duration-300">
              Book Consultation <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://wa.me/918848162343" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-[#0D7A9E] transition-all duration-300">
              WhatsApp Us
            </a>
          </RevealWrapper>
        </div>
      </section>
    </>
  );
}
