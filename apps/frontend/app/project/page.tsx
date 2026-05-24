'use client';

import { useState, useEffect } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import api from '@/lib/api';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-slate-600 text-slate-200' },
  in_progress: { label: 'Aktif', color: 'bg-blue-600/30 text-blue-300' },
  done: { label: 'Selesai', color: 'bg-emerald-600/30 text-emerald-300' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-600/30 text-red-300' },
};

const TASK_STAGES = ['todo', 'in_progress', 'review', 'done'];
const TASK_STAGE_LABELS: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Selesai' };

export default function ProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'projects' | 'tasks'>('projects');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [pForm, setPForm] = useState({ name: '', code: '', description: '', startDate: '', endDate: '', budget: '' });
  const [tForm, setTForm] = useState({ title: '', description: '', stage: 'todo', priority: '0', deadline: '', projectId: '' });

  useEffect(() => { fetchProjects(); fetchStats(); }, []);

  async function fetchProjects() {
    setLoading(true);
    try { const r = await api.get('/project/projects'); setProjects(r.data.data ?? []); }
    catch { } finally { setLoading(false); }
  }

  async function fetchStats() {
    try { const r = await api.get('/project/stats'); setStats(r.data); } catch { }
  }

  async function fetchTasks(projectId?: string) {
    try {
      const r = await api.get('/project/tasks', { params: projectId ? { projectId } : {} });
      setTasks(r.data.data ?? []);
    } catch { }
  }

  async function openProject(p: any) {
    setSelectedProject(p);
    await fetchTasks(p.id);
    setView('tasks');
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    try { await api.post('/project/projects', { ...pForm, budget: parseFloat(pForm.budget) || 0 }); setShowProjectForm(false); fetchProjects(); } catch { }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/project/tasks', { ...tForm, projectId: selectedProject?.id, priority: parseInt(tForm.priority) });
      setShowTaskForm(false);
      fetchTasks(selectedProject?.id);
    } catch { }
  }

  async function updateTaskStage(taskId: string, stage: string) {
    try { await api.put(`/project/tasks/${taskId}`, { stage }); fetchTasks(selectedProject?.id); } catch { }
  }

  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <ModernLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {view === 'tasks' && (
                <button onClick={() => setView('projects')} className="text-slate-400 hover:text-white text-sm">← Proyek</button>
              )}
              <h1 className="text-2xl font-bold text-white">
                {view === 'projects' ? 'Manajemen Proyek' : selectedProject?.name}
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">{view === 'projects' ? 'Kelola semua proyek' : 'Task board kanban'}</p>
          </div>
          <button onClick={() => view === 'projects' ? setShowProjectForm(true) : setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {view === 'projects' ? '+ Buat Proyek' : '+ Tambah Task'}
          </button>
        </div>

        {stats && view === 'projects' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Total Proyek</p><p className="text-2xl font-bold text-white mt-1">{stats.total}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Aktif</p><p className="text-2xl font-bold text-blue-400 mt-1">{stats.active}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Selesai</p><p className="text-2xl font-bold text-emerald-400 mt-1">{stats.done}</p></div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-slate-400 text-sm">Total Task</p><p className="text-2xl font-bold text-violet-400 mt-1">{stats.totalTasks}</p></div>
          </div>
        )}

        {view === 'projects' ? (
          loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">Memuat proyek...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => {
                const st = STATUS_MAP[p.status] ?? STATUS_MAP.draft;
                return (
                  <div key={p.id} onClick={() => openProject(p)} className="bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 p-5 cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-semibold">{p.name}</p>
                        {p.code && <p className="text-slate-500 text-xs mt-0.5">{p.code}</p>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                    {p.description && <p className="text-slate-400 text-sm mb-3 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{p._count?.tasks ?? 0} task</span>
                      {p.budget > 0 && <span>{fmt(Number(p.budget))}</span>}
                    </div>
                    {p.startDate && <p className="text-slate-600 text-xs mt-2">{new Date(p.startDate).toLocaleDateString('id-ID')} – {p.endDate ? new Date(p.endDate).toLocaleDateString('id-ID') : '...'}</p>}
                  </div>
                );
              })}
              {projects.length === 0 && <p className="text-slate-500 text-center py-10 col-span-3">Belum ada proyek</p>}
            </div>
          )
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {TASK_STAGES.map(stage => {
              const stageTasks = tasks.filter(t => t.stage === stage);
              return (
                <div key={stage} className="flex-shrink-0 w-72 bg-slate-800/60 rounded-xl border border-slate-700">
                  <div className="p-3 border-b border-slate-700 flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{TASK_STAGE_LABELS[stage]}</span>
                    <span className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded-full">{stageTasks.length}</span>
                  </div>
                  <div className="p-2 space-y-2 min-h-32 max-h-[60vh] overflow-y-auto">
                    {stageTasks.map(task => (
                      <div key={task.id} className="bg-slate-700/60 rounded-lg p-3 border border-slate-600">
                        <p className="text-white text-sm font-medium">{task.title}</p>
                        {task.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>}
                        {task.deadline && <p className="text-slate-500 text-xs mt-2">Due: {new Date(task.deadline).toLocaleDateString('id-ID')}</p>}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {TASK_STAGES.filter(s => s !== stage).map(s => (
                            <button key={s} onClick={() => updateTaskStage(task.id, s)}
                              className="text-xs text-slate-400 hover:text-white bg-slate-600/50 hover:bg-slate-600 px-1.5 py-0.5 rounded transition-colors">
                              → {TASK_STAGE_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {stageTasks.length === 0 && <p className="text-slate-600 text-xs text-center py-4">Kosong</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showProjectForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Buat Proyek Baru</h2>
                <button onClick={() => setShowProjectForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateProject} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Nama Proyek *</label><input required value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 text-xs mb-1 block">Kode</label><input value={pForm.code} onChange={e => setPForm(f => ({ ...f, code: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Budget (Rp)</label><input type="number" value={pForm.budget} onChange={e => setPForm(f => ({ ...f, budget: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Tanggal Mulai</label><input type="date" value={pForm.startDate} onChange={e => setPForm(f => ({ ...f, startDate: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                  <div><label className="text-slate-400 text-xs mb-1 block">Tanggal Selesai</label><input type="date" value={pForm.endDate} onChange={e => setPForm(f => ({ ...f, endDate: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Deskripsi</label><textarea value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowProjectForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showTaskForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl w-full max-w-md border border-slate-700">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold">Tambah Task</h2>
                <button onClick={() => setShowTaskForm(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreateTask} className="p-5 space-y-3">
                <div><label className="text-slate-400 text-xs mb-1 block">Judul Task *</label><input required value={tForm.title} onChange={e => setTForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Stage</label>
                    <select value={tForm.stage} onChange={e => setTForm(f => ({ ...f, stage: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      {TASK_STAGES.map(s => <option key={s} value={s}>{TASK_STAGE_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Prioritas</label>
                    <select value={tForm.priority} onChange={e => setTForm(f => ({ ...f, priority: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                      <option value="0">Normal</option><option value="1">Tinggi</option><option value="2">Sangat Tinggi</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-slate-400 text-xs mb-1 block">Deadline</label><input type="date" value={tForm.deadline} onChange={e => setTForm(f => ({ ...f, deadline: e.target.value }))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" /></div>
                <div><label className="text-slate-400 text-xs mb-1 block">Deskripsi</label><textarea value={tForm.description} onChange={e => setTForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm">Batal</button>
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}
