import { NextResponse } from 'next/server';
import { readStoreAsync, writeStoreAsync } from '@/lib/cms-store';
import { Project } from '@/lib/projects';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const projects = await readStoreAsync<Project[]>('projects.json', []);
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const newProject: Project = await request.json();
    const projects = await readStoreAsync<Project[]>('projects.json', []);

    if (!newProject.id) {
      newProject.id = Date.now().toString();
    }
    if (!newProject.slug) {
      newProject.slug = newProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updated = [newProject, ...projects];
    await writeStoreAsync('projects.json', updated);

    return NextResponse.json({ success: true, project: newProject, projects: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProject: Project = await request.json();
    const projects = await readStoreAsync<Project[]>('projects.json', []);

    const index = projects.findIndex((p) => p.id === updatedProject.id || p.slug === updatedProject.slug);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
    }

    projects[index] = updatedProject;
    await writeStoreAsync('projects.json', projects);

    return NextResponse.json({ success: true, project: updatedProject, projects });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Project ID required' }, { status: 400 });
    }

    const projects = await readStoreAsync<Project[]>('projects.json', []);
    const filtered = projects.filter((p) => p.id !== id && p.slug !== id);

    await writeStoreAsync('projects.json', filtered);

    return NextResponse.json({ success: true, projects: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete project' }, { status: 500 });
  }
}
