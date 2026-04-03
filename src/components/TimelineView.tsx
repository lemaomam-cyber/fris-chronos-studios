import React, { useMemo } from 'react';
import { TimelineEvent } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.startYear - b.startYear);
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50/50">
        <p className="text-zinc-500 font-serif italic text-lg">Ajoutez des événements pour commencer votre frise</p>
      </div>
    );
  }

  const minYear = Math.min(...events.map(e => e.startYear));
  const maxYear = Math.max(...events.map(e => e.endYear || e.startYear));
  const totalYears = maxYear - minYear || 1;

  const getPosition = (year: number) => {
    return ((year - minYear) / totalYears) * 100;
  };

  const getWidth = (start: number, end?: number) => {
    if (!end) return 0;
    return ((end - start) / totalYears) * 100;
  };

  return (
    <div className="relative w-full overflow-x-auto pb-8 sm:pb-12 pt-16 sm:pt-24 px-4 sm:px-8 min-h-[350px] sm:min-h-[400px]">
      <div className="relative min-w-[700px] sm:min-w-[800px] h-1.5 sm:h-2 bg-zinc-200 rounded-full">
        {/* Year Markers */}
        {Array.from({ length: 11 }).map((_, i) => {
          const year = Math.round(minYear + (totalYears * i) / 10);
          return (
            <div
              key={i}
              className="absolute top-3 sm:top-4 flex flex-col items-center -translate-x-1/2"
              style={{ left: `${(i / 10) * 100}%` }}
            >
              <div className="w-px h-1.5 sm:h-2 bg-zinc-400 mb-1" />
              <span className="text-[8px] sm:text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                {year < 0 ? `${Math.abs(year)} av. J.-C.` : year}
              </span>
            </div>
          );
        })}

        {/* Events */}
        {sortedEvents.map((event, index) => {
          const left = getPosition(event.startYear);
          const width = getWidth(event.startYear, event.endYear);
          const isPeriod = !!event.endYear && event.endYear !== event.startYear;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{
                left: `${left}%`,
                width: isPeriod ? `${width}%` : 'auto',
                top: index % 2 === 0 ? '-100px' : '30px',
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Connector Line */}
                <div
                  className={cn(
                    "absolute w-px bg-zinc-300",
                    index % 2 === 0 ? "top-full h-20" : "bottom-full h-8"
                  )}
                />

                {/* Event Card */}
                <div
                  className={cn(
                    "p-2 sm:p-3 rounded-lg shadow-sm border bg-white min-w-[120px] sm:min-w-[150px] max-w-[200px] sm:max-w-[250px]",
                    "transition-all hover:shadow-md hover:-translate-y-1"
                  )}
                  style={{ borderColor: event.color }}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                      {event.startYear < 0 ? `${Math.abs(event.startYear)} av. J.-C.` : event.startYear}
                      {isPeriod && ` — ${event.endYear! < 0 ? `${Math.abs(event.endYear!)} av. J.-C.` : event.endYear}`}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-[9px] sm:text-[11px] text-zinc-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {isPeriod && (
                    <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-zinc-100 flex justify-between items-center">
                      <span className="text-[8px] sm:text-[9px] font-mono text-zinc-400 uppercase">Durée</span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-700">
                        {event.endYear! - event.startYear} ans
                      </span>
                    </div>
                  )}
                </div>

                {/* Point or Bar on Timeline */}
                {!isPeriod ? (
                  <div
                    className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-sm -translate-x-1/2"
                    style={{ backgroundColor: event.color, top: index % 2 === 0 ? '94px' : '-36px' }}
                  />
                ) : (
                  <div
                    className="absolute h-1.5 sm:h-2 rounded-full opacity-50"
                    style={{
                      backgroundColor: event.color,
                      width: '100%',
                      top: index % 2 === 0 ? '98px' : '-32px',
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Gaps / Intervals between events */}
      <div className="mt-24 sm:mt-32 border-t border-zinc-100 pt-6 sm:pt-8">
        <h4 className="text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4 text-center">
          Intervalles entre événements
        </h4>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {sortedEvents.map((event, i) => {
            if (i === sortedEvents.length - 1) return null;
            const nextEvent = sortedEvents[i + 1];
            const gap = nextEvent.startYear - (event.endYear || event.startYear);
            if (gap <= 0) return null;

            return (
              <div key={`gap-${i}`} className="flex flex-col items-center text-center px-2">
                <span className="text-[8px] sm:text-[10px] font-serif italic text-zinc-400 max-w-[100px] truncate">
                  {event.title} → {nextEvent.title}
                </span>
                <span className="text-lg sm:text-xl font-mono font-light text-zinc-800">
                  {gap} <span className="text-[10px] uppercase tracking-widest text-zinc-400">ans</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
