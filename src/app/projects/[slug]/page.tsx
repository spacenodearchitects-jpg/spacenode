import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Tag } from 'lucide-react';
import RevealWrapper from '@/components/ui/RevealWrapper';
import NodeMesh from '@/components/ui/NodeMesh';
import { getProjects, Project } from '@/lib/projects';
import { readStoreAsync } from '@/lib/cms-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

function findProjectBySlug(projects: Project[], targetSlug: string): Project | undefined {
  const rawSlug = decodeURIComponent(targetSlug || '').toLowerCase().trim();
  const cleanSlug = rawSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return projects.find((p) => {
    if (!p) return false;
    const pId = (p.id || '').toLowerCase().trim();
    const pSlug = (p.slug || '').toLowerCase().trim();
    const pCleanSlug = pSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pNameSlug = (p.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return (
      pId === rawSlug ||
      pSlug === rawSlug ||
      pCleanSlug === cleanSlug ||
      pNameSlug === cleanSlug
    );
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projects = await readStoreAsync<Project[]>('projects.json', getProjects());
  const project = findProjectBySlug(projects, slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const projects = await readStoreAsync<Project[]>('projects.json', getProjects());
  const project = findProjectBySlug(projects, slug);

  if (!project) {
    notFound();
  }

  const relatedCategory = projects.filter(
    (p) => p.slug !== project.slug && p.id !== project.id && p.category === project.category
  );
  const related = (
    relatedCategory.length > 0
      ? relatedCategory
      : projects.filter((p) => p.slug !== project.slug && p.id !== project.id)
  ).slice(0, 3);

  const heroImageSrc = project.heroImage || project.image;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-end overflow-hidden" aria-label={`${project.name} hero`}>
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={project.name}
            fill
            priority
                    unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2333]/90 via-[#0A2333]/30 to-transparent" />
        <div className="absolute inset-0 opacity-20">
          <NodeMesh variant="hero" animated={false} />
        </div>

        {/* Back link */}
        <div className="absolute top-24 left-6 md:left-20 z-20">
          <Link href="/projects"
            className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors duration-300">
            <ArrowLeft size={13} /> All Projects
          </Link>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20 pb-16 w-full">
          <div className="flex flex-wrap gap-6 mb-6">
            <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-[#6EB8D0] font-semibold">
              <Tag size={11} /> {project.category}
            </span>
            <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70">
              <MapPin size={11} /> {project.location}
            </span>
            <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70">
              <Calendar size={11} /> {project.year}
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight tracking-[-0.01em]">
            {project.name}
          </h1>
        </div>
      </section>

      {/* Project Story */}
      <section className="py-24 md:py-32 bg-white" aria-label="Project story">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 space-y-12">
          {project.description && (
            <div>
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-[#0D7A9E] block mb-4">
                Overview
              </span>
              <p className="font-serif text-2xl md:text-3xl text-[#161616] leading-relaxed max-w-4xl">{project.description}</p>
            </div>
          )}

          {/* Challenge, Approach & Solution Grid */}
          {(project.challenge || project.approach || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
              {project.challenge && (
                <div>
                  <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#0D7A9E] mb-3">The Challenge</h3>
                  <p className="font-sans font-light text-sm text-[#6B7280] leading-relaxed">{project.challenge}</p>
                </div>
              )}
              {project.approach && (
                <div>
                  <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#0D7A9E] mb-3">The Approach</h3>
                  <p className="font-sans font-light text-sm text-[#6B7280] leading-relaxed">{project.approach}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h3 className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#0D7A9E] mb-3">The Solution</h3>
                  <p className="font-sans font-light text-sm text-[#6B7280] leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-[#F8F9FA] py-2" aria-label="Project gallery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.gallery.map((img, i) => (
              <RevealWrapper key={i} delay={i * 0.1} className={i === 0 ? 'md:col-span-2' : ''}>
                <div className={`relative overflow-hidden ${i === 0 ? 'h-[60vh]' : 'h-[50vh]'}`}>
                  <Image
                    src={img}
                    alt={`${project.name} — view ${i + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </RevealWrapper>
            ))}
          </div>
        </section>
      )}

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-24 bg-[#F8F9FA]" aria-label="Related projects">
          <div className="max-w-[1440px] mx-auto px-6 md:px-20">
            <RevealWrapper className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-3xl text-[#161616]">
                Related <span className="italic">Works</span>
              </h2>
              <Link href="/projects"
                className="hidden md:flex items-center gap-1.5 group font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#0D7A9E] border-b border-[#0D7A9E] pb-1">
                View All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <RevealWrapper key={p.id || p.slug} delay={i * 0.1}>
                  <Link href={`/projects/${p.slug || p.id}`} className="group block">
                    <div className="overflow-hidden aspect-[4/3] mb-4 relative rounded-xl">
                      <Image src={p.image} alt={p.name} fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h3 className="font-serif text-xl text-[#161616] group-hover:text-[#0D7A9E] transition-colors duration-300 mb-1">{p.name}</h3>
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#6B7280]">{p.location}</p>
                  </Link>
                </RevealWrapper>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
