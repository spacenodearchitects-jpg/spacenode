import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RevealWrapper from '@/components/ui/RevealWrapper';
import NodeMesh from '@/components/ui/NodeMesh';
import { getTeam, TeamMember } from '@/data/team';
import { readStoreAsync } from '@/lib/cms-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function findTeamMember(members: TeamMember[], slug: string): TeamMember | undefined {
  const rawSlug = decodeURIComponent(slug || '').toLowerCase().trim();
  const cleanSlug = rawSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return members.find((m) => {
    if (!m) return false;
    const mSlug = (m.slug || '').toLowerCase().trim();
    const mCleanSlug = mSlug.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const mNameSlug = (m.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return mSlug === rawSlug || mCleanSlug === cleanSlug || mNameSlug === cleanSlug;
  });
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const teamMembers = await readStoreAsync<TeamMember[]>('team.json', getTeam());
  const member = findTeamMember(teamMembers, slug);

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <RevealWrapper>
          <Link href="/about" className="inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.1em] uppercase text-[#0D7A9E] mb-12 hover:text-[#161616] transition-colors">
            <ArrowLeft size={16} />
            Back to Team
          </Link>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Side: Large Photo */}
          <div className="lg:col-span-5 relative">
            <RevealWrapper direction="up">
              <div className="relative aspect-[3/4] w-full bg-[#F8F9FA] overflow-hidden border border-[#E5E7EB] rounded-2xl">
                {member.image && member.image.trim().length > 0 ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    unoptimized={member.image.startsWith('data:')}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover grayscale"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <NodeMesh variant="hero" animated={false} />
                  </div>
                )}
              </div>
            </RevealWrapper>
          </div>

          {/* Right Side: Info and Description */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <RevealWrapper delay={0.1}>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#161616] mb-2">{member.name}</h1>
              <p className="font-sans text-sm tracking-[0.2em] uppercase text-[#0D7A9E] mb-10 pb-10 border-b border-[#E5E7EB]">{member.title}</p>
              
              {/* Highlights */}
              {member.highlights && member.highlights.length > 0 && (
                <div className="mb-10">
                  <h2 className="font-sans text-[11px] font-semibold tracking-[0.15em] uppercase text-[#161616] mb-4">Highlights</h2>
                  <ul className="space-y-3">
                    {member.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[#6B7280] font-sans font-light text-base">
                        <span className="text-[#0D7A9E] mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bio Description */}
              {member.desc && member.desc.length > 0 && (
                <div className="font-sans font-light text-base text-[#6B7280] leading-relaxed space-y-6">
                  {member.desc.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </RevealWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
