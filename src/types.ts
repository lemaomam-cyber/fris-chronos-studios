export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startYear: number;
  endYear?: number;
  color: string;
  imageUrl?: string;
}

export interface TimelineProject {
  id: string;
  name: string;
  description?: string;
  updatedAt: number;
  events: TimelineEvent[];
  scaleInterval?: number; // Gap between graduation marks (e.g., 10 years, 50 years)
  customMinYear?: number;
  customMaxYear?: number;
}
