'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/app/api/cms/team/route';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import { Plus, Edit2, Trash2, User, X, Save, PlusCircle, MinusCircle } from 'lucide-react';
import Image from 'next/image';

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/team');
      const data = await res.json();
      setTeam(data);
      try {
        localStorage.setItem('spacenode_team_store', JSON.stringify(data));
      } catch (e) {}
    } catch (err) {
      console.error('Failed to fetch team', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingMember({
      name: '',
      slug: '',
      title: 'Architect',
      image: '',
      highlights: ['Specializes in contemporary spatial planning'],
      desc: ['Add description paragraph here...'],
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name) return;

    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch('/api/cms/team', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember),
      });

      if (res.ok) {
        setEditingMember(null);
        fetchTeam();
      }
    } catch (err) {
      alert('Error saving team member');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await fetch(`/api/cms/team?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTeam();
      }
    } catch (err) {
      alert('Failed to delete team member');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#161616]">Manage Team Members</h1>
          <p className="font-sans text-xs text-gray-500 uppercase tracking-widest mt-1">
            Add architects, update photos, titles, highlights, and bios
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 bg-[#0D7A9E] hover:bg-[#0A2333] text-white px-5 py-3 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider transition-all shadow-md"
        >
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-sans text-sm">Loading team...</div>
      ) : team.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 font-sans text-sm">
          No team members added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div
              key={m.slug}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] bg-gray-100">
                  {m.image ? (
                    <Image src={m.image} alt={m.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                      <User size={48} className="opacity-40 mb-2" />
                      <span className="font-sans text-xs">No Photo</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-[#161616] mb-1">{m.name}</h3>
                  <p className="font-sans text-[11px] tracking-wider uppercase text-[#0D7A9E] mb-3">{m.title}</p>
                  <p className="font-sans text-xs text-gray-500 line-clamp-2">{m.desc?.[0]}</p>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-400">/team/{m.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditingMember(m);
                    }}
                    className="p-2 text-gray-600 hover:text-[#0D7A9E] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.slug)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-serif text-2xl text-[#161616]">
                {isNew ? 'Add Team Member' : `Edit: ${editingMember.name}`}
              </h2>
              <button
                onClick={() => setEditingMember(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.title || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, title: e.target.value })}
                    placeholder="e.g. Principal Architect"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Profile Photo Upload Input */}
              <ImageUploadInput
                label="Profile Photo"
                value={editingMember.image || ''}
                onChange={(url) => setEditingMember({ ...editingMember, image: url })}
              />

              {/* Highlights List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 font-medium">
                    Highlights (Bullet points)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingMember({
                        ...editingMember,
                        highlights: [...(editingMember.highlights || []), ''],
                      })
                    }
                    className="text-xs text-[#0D7A9E] hover:underline flex items-center gap-1 font-sans font-medium"
                  >
                    <PlusCircle size={14} /> Add Highlight
                  </button>
                </div>
                <div className="space-y-2">
                  {(editingMember.highlights || []).map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => {
                          const updated = [...(editingMember.highlights || [])];
                          updated[idx] = e.target.value;
                          setEditingMember({ ...editingMember, highlights: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded-xl p-2 text-sm focus:border-[#0D7A9E] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingMember.highlights || []).filter((_, i) => i !== idx);
                          setEditingMember({ ...editingMember, highlights: updated });
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 font-medium">
                    Biography / Description Paragraphs
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingMember({
                        ...editingMember,
                        desc: [...(editingMember.desc || []), ''],
                      })
                    }
                    className="text-xs text-[#0D7A9E] hover:underline flex items-center gap-1 font-sans font-medium"
                  >
                    <PlusCircle size={14} /> Add Paragraph
                  </button>
                </div>
                <div className="space-y-3">
                  {(editingMember.desc || []).map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...(editingMember.desc || [])];
                          updated[idx] = e.target.value;
                          setEditingMember({ ...editingMember, desc: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingMember.desc || []).filter((_, i) => i !== idx);
                          setEditingMember({ ...editingMember, desc: updated });
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 mt-2"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-sans text-xs font-semibold uppercase tracking-wider hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0D7A9E] hover:bg-[#0A2333] text-white rounded-xl font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <Save size={16} /> Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
