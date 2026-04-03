import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { Plus, Trash2, Calendar, Type, FileText, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimelineEditorProps {
  events: TimelineEvent[];
  onAddEvent: (event: TimelineEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#64748B', // Slate
];

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: '',
    description: '',
    startYear: 0,
    color: COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startYear = typeof newEvent.startYear === 'string' ? parseInt(newEvent.startYear) : newEvent.startYear;
    
    if (!newEvent.title || startYear === undefined || isNaN(startYear)) {
      return;
    }

    onAddEvent({
      ...newEvent as TimelineEvent,
      startYear,
      endYear: newEvent.endYear,
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    });

    setNewEvent({
      title: '',
      description: '',
      startYear: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Column */}
      <div className="lg:col-span-1">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm sticky top-20">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 mb-6">Nouvel Événement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                Titre de l'événement
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Révolution Française"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                  Début
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="number"
                    value={newEvent.startYear}
                    onChange={e => setNewEvent({ ...newEvent, startYear: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                  Fin (opt.)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="number"
                    value={newEvent.endYear || ''}
                    onChange={e => setNewEvent({ ...newEvent, endYear: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                <textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Détails sur l'événement..."
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, color })}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all",
                      newEvent.color === color ? "border-zinc-900 scale-110 shadow-md" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-zinc-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-[0.98] transition-all mt-4"
            >
              <Plus className="w-4 h-4" />
              Ajouter à la frise
            </button>
          </form>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 mb-6">Événements Listés</h2>
          {events.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-zinc-400 italic text-sm">Aucun événement pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {events.map(event => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex justify-between items-start group hover:border-zinc-300 transition-colors"
                >
                  <div className="flex gap-3 overflow-hidden">
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase">
                        {event.startYear < 0 ? `${Math.abs(event.startYear)} av. J.-C.` : event.startYear}
                        {event.endYear && ` — ${event.endYear < 0 ? `${Math.abs(event.endYear)} av. J.-C.` : event.endYear}`}
                      </span>
                      <h3 className="font-bold text-zinc-900 truncate">{event.title}</h3>
                      {event.description && (
                        <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
