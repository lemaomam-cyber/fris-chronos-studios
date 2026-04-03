import React, { useState, useEffect, useCallback } from 'react';
import { TimelineEvent, TimelineProject } from './types';
import { TimelineView } from './components/TimelineView';
import { TimelineEditor } from './components/TimelineEditor';
import { ProjectDashboard } from './components/ProjectDashboard';
import { History, Download, Share2, Info, Calendar, ArrowLeft, Save, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [projects, setProjects] = useState<TimelineProject[]>(() => {
    const saved = localStorage.getItem('timeline-projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    localStorage.setItem('timeline-projects', JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleCreateProject = () => {
    const newProject: TimelineProject = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name: `Nouvelle Frise ${projects.length + 1}`,
      description: 'Une nouvelle exploration historique.',
      updatedAt: Date.now(),
      events: []
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    showToast('Nouvelle frise créée');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette frise ?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) setActiveProjectId(null);
      showToast('Frise supprimée');
    }
  };

  const handleExport = () => {
    if (!activeProject) {
      // Export all projects if on dashboard
      const dataStr = JSON.stringify(projects, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'chronos-studio-projects.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showToast('Tous les projets exportés');
      return;
    }

    const dataStr = JSON.stringify(activeProject, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${activeProject.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast('Frise exportée');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Lien copié dans le presse-papier');
    }).catch(() => {
      showToast('Erreur lors de la copie du lien', 'error');
    });
  };

  const handleUpdateProjectName = (name: string) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, name, updatedAt: Date.now() } : p
    ));
  };

  const handleUpdateProjectDescription = (description: string) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, description, updatedAt: Date.now() } : p
    ));
  };

  const handleUpdateScale = (scaleInterval: number) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, scaleInterval, updatedAt: Date.now() } : p
    ));
  };

  const handleUpdateMinYear = (customMinYear: number | undefined) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, customMinYear, updatedAt: Date.now() } : p
    ));
  };

  const handleUpdateMaxYear = (customMaxYear: number | undefined) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId ? { ...p, customMaxYear, updatedAt: Date.now() } : p
    ));
  };

  const handleAddEvent = (event: TimelineEvent) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId 
        ? { ...p, events: [...p.events, event], updatedAt: Date.now() } 
        : p
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId 
        ? { ...p, events: p.events.filter(e => e.id !== id), updatedAt: Date.now() } 
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shrink-0">
              <History className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight truncate">
              Chronos<span className="italic font-normal text-zinc-400 ml-1">Studio</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {activeProjectId && (
              <button 
                onClick={() => setActiveProjectId(null)}
                className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-md hover:bg-zinc-100"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Dashboard</span>
              </button>
            )}
            <button 
              onClick={handleExport}
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              title="Exporter en JSON"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              title="Partager le lien"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!activeProjectId ? (
          <ProjectDashboard 
            projects={projects}
            onSelectProject={setActiveProjectId}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8">
              <div className="flex-grow space-y-2">
                <button 
                  onClick={() => setActiveProjectId(null)}
                  className="mb-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Tableau de bord
                </button>
                <input 
                  type="text"
                  value={activeProject?.name || ''}
                  onChange={(e) => handleUpdateProjectName(e.target.value)}
                  className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight mb-2 bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                  placeholder="Nom de la frise"
                />
                <textarea 
                  value={activeProject?.description || ''}
                  onChange={(e) => handleUpdateProjectDescription(e.target.value)}
                  className="text-zinc-500 text-base sm:text-lg bg-transparent border-none outline-none focus:ring-0 w-full p-0 resize-none min-h-[60px]"
                  placeholder="Ajoutez une description..."
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">Dernière modif.</span>
                  <span className="text-xs font-mono font-bold">
                    {new Date(activeProject?.updatedAt || 0).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            <section className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500">Aperçu Interactif</span>
                </div>
                <div className="hidden xs:flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                </div>
              </div>
              <div className="relative">
                <TimelineView 
                  events={activeProject?.events || []} 
                  scaleInterval={activeProject?.scaleInterval}
                  customMinYear={activeProject?.customMinYear}
                  customMaxYear={activeProject?.customMaxYear}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden pointer-events-none">
                  <span className="text-[9px] font-mono text-zinc-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-zinc-100">
                    Faites défiler horizontalement →
                  </span>
                </div>
              </div>
            </section>

            {/* Editor Section */}
            <section className="pb-12 sm:pb-24">
              <div className="flex items-center gap-4 mb-8 sm:mb-12">
                <div className="h-px flex-1 bg-zinc-200" />
                <h3 className="font-serif text-2xl sm:text-3xl font-bold whitespace-nowrap">Éditeur d'Événements</h3>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
              <TimelineEditor 
                events={activeProject?.events || []} 
                onAddEvent={handleAddEvent} 
                onDeleteEvent={handleDeleteEvent} 
                scaleInterval={activeProject?.scaleInterval}
                onUpdateScale={handleUpdateScale}
                customMinYear={activeProject?.customMinYear}
                onUpdateMinYear={handleUpdateMinYear}
                customMaxYear={activeProject?.customMaxYear}
                onUpdateMaxYear={handleUpdateMaxYear}
              />
            </section>
          </div>
        )}

        {/* Info Section (Only on dashboard) */}
        {!activeProjectId && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 border-t border-zinc-200 mt-20">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <Info className="w-5 h-5 text-zinc-600" />
              </div>
              <h4 className="font-serif text-xl font-bold">Multi-projets</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Créez autant de frises que nécessaire. Chaque projet est indépendant et possède ses propres événements.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-zinc-600" />
              </div>
              <h4 className="font-serif text-xl font-bold">Calcul d'intervalles</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Visualisez instantanément les "vides" historiques entre vos événements pour mieux comprendre les transitions.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <Save className="w-5 h-5 text-zinc-600" />
              </div>
              <h4 className="font-serif text-xl font-bold">Sauvegarde Locale</h4>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Vos projets sont automatiquement sauvegardés dans votre navigateur. Pas besoin de compte pour commencer.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-zinc-400" />
            <span className="font-serif text-lg font-bold">Chronos Studio</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 Chronos Studio — Conçu pour l'éducation et la passion de l'histoire.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-mono">Aide</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-mono">Confidentialité</a>
          </div>
        </div>
      </footer>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={cn(
              "fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border",
              toast.type === 'success' ? "bg-zinc-900 border-zinc-800 text-white" : "bg-red-600 border-red-500 text-white"
            )}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
