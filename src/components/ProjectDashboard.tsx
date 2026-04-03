import React from 'react';
import { TimelineProject } from '../types';
import { Plus, Clock, ChevronRight, Trash2, CalendarDays } from 'lucide-react';

interface ProjectDashboardProps {
  projects: TimelineProject[];
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 mb-4 block">
            Tableau de bord
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[0.9] mb-4">
            Vos projets de <br />
            <span className="italic text-zinc-400">frises historiques.</span>
          </h2>
          <p className="text-zinc-500 text-lg">
            Gérez vos différentes frises chronologiques. Créez-en une nouvelle pour chaque période ou sujet d'étude.
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Frise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 sm:py-20 bg-zinc-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 sm:w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-300" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 mb-2">Aucune frise créée</h3>
            <p className="text-zinc-400 text-sm max-w-xs mb-6 sm:mb-8">Commencez par créer votre premier projet de frise chronologique.</p>
            <button
              onClick={onCreateProject}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border border-zinc-200 rounded-xl font-bold text-sm hover:border-zinc-900 transition-all"
            >
              Créer ma première frise
            </button>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-white border border-zinc-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-zinc-900 transition-all hover:shadow-xl hover:shadow-zinc-200/50 cursor-pointer flex flex-col h-full"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project.id);
                  }}
                  className="p-2 text-zinc-300 hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-serif text-xl font-bold text-zinc-900 mb-2 group-hover:translate-x-1 transition-transform">
                {project.name}
              </h3>
              
              <p className="text-zinc-500 text-sm mb-6 line-clamp-2 flex-grow">
                {project.description || "Aucune description fournie."}
              </p>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Événements</span>
                  <span className="text-sm font-mono font-bold">{project.events.length}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-900 font-bold text-xs uppercase tracking-widest">
                  Ouvrir
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
