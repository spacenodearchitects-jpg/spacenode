import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RevealWrapper from '@/components/ui/RevealWrapper';
import AboutTestimonials from '@/components/sections/about/AboutTestimonials';
import { getTeam, TeamMember } from '@/data/team';
import { readStoreAsync } from '@/lib/cms-store';
import { getPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateMetadata(): Metadata {
  return getPageMetadata('about');
}

// --- HERO ---
function AboutHero() {
  return (
    <section className="relative pt-36 pb-0 bg-[#F8F9FA] overflow-hidden min-h-[45vh] flex items-end" aria-label="About hero">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 pb-12 w-full">
        <div className="w-full">
          <RevealWrapper>
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-[#0D7A9E] block mb-6">
              Who We Are
            </span>
          </RevealWrapper>
          <RevealWrapper delay={0.1}>
            <h1 className="font-serif text-5xl md:text-7xl text-[#161616] leading-[1.05] tracking-[-0.02em] mb-8">
              Creating Spaces, Not Just <span className="italic text-[#0D7A9E]">Structures.</span>
            </h1>
          </RevealWrapper>
          <RevealWrapper delay={0.2}>
            <p className="font-sans font-light text-lg text-[#6B7280] leading-relaxed mb-8">
              We are a collective of architects, designers, and thinkers crafting meaningful spaces through architecture, interiors, landscapes, and project management.
            </p>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}

// --- STUDIO STORY ---
function StudioStory() {
  return (
    <section className="pt-16 pb-12 md:pt-20 md:pb-16 bg-white overflow-hidden" aria-labelledby="studio-story-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <div className="w-full">
          <RevealWrapper direction="left">
            <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-[#0D7A9E] block mb-6">
              Our Studio
            </span>
            <h2 id="studio-story-heading" className="font-serif text-4xl md:text-5xl text-[#161616] leading-tight mb-8">
              A studio shaped by vision and <span className="italic">purpose.</span>
            </h2>
            <p className="font-sans font-light text-base text-[#6B7280] leading-relaxed mb-6">
              Space Node Architects is a multidisciplinary architecture and design practice creating refined residential and commercial environments. Rooted in purposeful planning, timeless aesthetics, and thoughtful execution, we shape spaces that inspire and endure.
            </p>
            <p className="font-sans font-light text-base text-[#6B7280] leading-relaxed">
              With projects and design collaborations spanning India, UAE, Australia, and the USA, our studio brings a global perspective to every space we create.
            </p>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}

function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <section className="pt-8 pb-20 md:pt-12 md:pb-28 bg-white" aria-labelledby="team-heading">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <RevealWrapper className="mb-16">
          <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-[#0D7A9E] block mb-4">
            Our Team
          </span>
          <h2 id="team-heading" className="font-serif text-4xl md:text-5xl text-[#161616]">
            The <span className="italic">Collective</span>
          </h2>
        </RevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {members.map((member, i) => (
            <RevealWrapper key={member.name} delay={i * 0.1}>
              <div className="group">
                <Link href={`/team/${member.slug}`} className="block overflow-hidden aspect-[3/4] mb-5 relative bg-[#F8F9FA] rounded-xl border border-gray-100">
                  {member.image && member.image.trim().length > 0 ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized={member.image.startsWith('data:')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#F8F9FA] to-[#E5E7EB]">
                      <span className="font-serif text-3xl font-light text-[#0D7A9E] mb-2">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#6B7280]">
                        {member.title}
                      </span>
                    </div>
                  )}
                  {/* Node connection indicator */}
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#0D7A9E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link href={`/team/${member.slug}`}>
                  <h3 className="font-serif text-lg text-[#161616] mb-1 hover:text-[#0D7A9E] transition-colors">{member.name}</h3>
                </Link>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#0D7A9E] mb-3">{member.title}</p>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Node connection between team members */}
        <RevealWrapper delay={0.4} className="mt-10 overflow-hidden">
          <svg className="w-full h-6" viewBox="0 0 800 24" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <circle cx={100 + i * 200} cy={12} r="3" fill="#0D7A9E" opacity="0.6"/>
                {i < 3 && (
                  <line x1={103 + i * 200} y1={12} x2={297 + i * 200} y2={12}
                    stroke="#0D7A9E" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"/>
                )}
              </g>
            ))}
          </svg>
        </RevealWrapper>
      </div>
    </section>
  );
}

// --- ABOUT PAGE CTA ---
function AboutCTA() {
  return (
    <section className="py-28 md:py-36 bg-[#F8F9FA]" aria-label="About CTA">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
        <RevealWrapper>
          <h2 className="font-serif text-4xl md:text-6xl text-[#161616] leading-tight mb-10">
            Let's Create<br />
            Something <span className="italic text-[#0D7A9E]">Exceptional</span>.
          </h2>
        </RevealWrapper>
        <RevealWrapper delay={0.1}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#0A2333] text-white px-10 py-5 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#0D7A9E] transition-all duration-300"
          >
            Book Consultation
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </RevealWrapper>
      </div>
    </section>
  );
}

// --- ABOUT PAGE ---
export default async function AboutPage() {
  const teamMembers = await readStoreAsync<TeamMember[]>('team.json', getTeam());

  return (
    <>
      <AboutHero />
      <StudioStory />
      <TeamGrid members={teamMembers} />
      <AboutTestimonials />
      <AboutCTA />
    </>
  );
}
