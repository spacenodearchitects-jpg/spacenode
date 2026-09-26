'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/projects';
import ImageUploadInput from '@/components/admin/ImageUploadInput';
import { Plus, Edit2, Trash2, Search, Star, Image as ImageIcon, X, Save } from 'lucide-react';
import Image from 'next/image';

const categories: Array<'Residential' | 'Commercial' | 'Hospitality' | 'Landscape' | 'Mixed Use'> = [
  'Residential',
  'Commercial',
  'Hospitality',
  'Landscape',
  'Mixed Use',
];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsNew(true);
    setEditingProject({
      id: Date.now().toString(),
      name: '',
      slug: '',
      category: 'Residential',
      location: '',
      year: new Date().getFullYear().toString(),
      type: 'Residential / Architecture',
      description: '',
      challenge: '',
      approach: '',
      solution: '',
      featured: false,
      image: '/images/project-kerala.png',
      heroImage: '/images/project-kerala.png',
      gallery: [],
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name) return;

    setSaving(true);
    const method = isNew ? 'POST' : 'PUT';
    try {
      const res = await fetch('/api/cms/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingProject(null);
        fetchProjects();
      } else {
        alert(data.message || 'Error saving project. Please check network/file sizes.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving project. Server request failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/cms/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProjects();
      } else {
        alert(data.message || 'Failed to delete project');
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#161616]">Manage Projects</h1>
          <p className="font-sans text-xs text-gray-500 uppercase tracking-widest mt-1">
            Add, update, or remove architectural portfolio projects
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 bg-[#0D7A9E] hover:bg-[#0A2333] text-white px-5 py-3 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider transition-all shadow-md"
        >
          <Plus size={16} /> Add New Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, location, or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#0D7A9E] focus:ring-1 focus:ring-[#0D7A9E]"
        />
        <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
      </div>

      {/* Projects List Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-sans text-sm">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 font-sans text-sm">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-gray-100">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  {p.featured && (
                    <span className="absolute top-3 right-3 bg-[#0D7A9E] text-white text-[10px] font-sans font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <Star size={11} fill="currentColor" /> Featured
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-[#0A2333]/80 text-white text-[10px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {p.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-xl text-[#161616] mb-1">{p.name}</h3>
                  <p className="font-sans text-xs text-gray-500 mb-3">{p.location} • {p.year}</p>
                  <p className="font-sans text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-400">/{p.slug}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsNew(false);
                      setEditingProject(p);
                    }}
                    className="p-2 text-gray-600 hover:text-[#0D7A9E] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-serif text-2xl text-[#161616]">
                {isNew ? 'Create New Project' : `Edit: ${editingProject.name}`}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.name || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm font-mono text-xs focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={editingProject.category || 'Residential'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as 'Residential' | 'Commercial' | 'Hospitality' | 'Landscape' | 'Mixed Use',
                      })
                    }
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Type Label
                  </label>
                  <input
                    type="text"
                    value={editingProject.type || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}
                    placeholder="e.g. Residential / Architecture"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    placeholder="e.g. Cochin, Kerala"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Upload Input */}
              <ImageUploadInput
                label="Card Cover Photo"
                value={editingProject.image || ''}
                onChange={(url) => setEditingProject({ ...editingProject, image: url })}
              />

              {/* Hero Image Upload Input */}
              <ImageUploadInput
                label="Hero Header Photo (Detail Page)"
                value={editingProject.heroImage || ''}
                onChange={(url) => setEditingProject({ ...editingProject, heroImage: url })}
              />

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                  Overview Description
                </label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                  The Challenge
                </label>
                <textarea
                  rows={3}
                  value={editingProject.challenge || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                  The Approach
                </label>
                <textarea
                  rows={3}
                  value={editingProject.approach || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, approach: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-wider text-gray-700 mb-1 font-medium">
                  The Solution
                </label>
                <textarea
                  rows={3}
                  value={editingProject.solution || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-[#0D7A9E] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-4 h-4 text-[#0D7A9E] rounded focus:ring-[#0D7A9E]"
                />
                <label htmlFor="featuredToggle" className="font-sans text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Feature on Homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-sans text-xs font-semibold uppercase tracking-wider hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0D7A9E] hover:bg-[#0A2333] text-white rounded-xl font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow disabled:opacity-50"
                >
                  <Save size={16} /> {saving ? 'Saving Project...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
