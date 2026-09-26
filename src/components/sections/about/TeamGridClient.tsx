'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RevealWrapper from '@/components/ui/RevealWrapper';
import { TeamMember } from '@/data/team';

interface TeamGridClientProps {
  initialMembers: TeamMember[];
}

export default function TeamGridClient({ initialMembers }: TeamGridClientProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  useEffect(() => {
    // Fetch latest team data from CMS API on client side
    fetch('/api/cms/team')
      .then((res) => res.json())
      .then((data: TeamMember[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
        }
      })
      .catch((err) => console.error('Failed to update team data client-side', err));
  }, []);

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
                <Link
                  href={`/team/${member.slug}`}
                  className="block overflow-hidden aspect-[3/4] mb-5 relative bg-[#F8F9FA] rounded-xl border border-gray-100 shadow-sm"
                >
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
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
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
                  <h3 className="font-serif text-lg text-[#161616] mb-1 hover:text-[#0D7A9E] transition-colors">
                    {member.name}
                  </h3>
                </Link>
                <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#0D7A9E] mb-3">
                  {member.title}
                </p>
              </div>
            </RevealWrapper>
          ))}
        </div>

        {/* Node connection between team members */}
        <RevealWrapper delay={0.4} className="mt-10 overflow-hidden">
          <svg className="w-full h-6" viewBox="0 0 800 24" xmlns="http://www.w3.org/2000/svg">
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <circle cx={100 + i * 200} cy={12} r="3" fill="#0D7A9E" opacity="0.6" />
                {i < 3 && (
                  <line
                    x1={103 + i * 200}
                    y1={12}
                    x2={297 + i * 200}
                    y2={12}
                    stroke="#0D7A9E"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                )}
              </g>
            ))}
          </svg>
        </RevealWrapper>
      </div>
    </section>
  );
}
