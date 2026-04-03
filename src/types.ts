export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startYear: number;
  endYear?: number;
  color: string;
}

export interface TimelineProject {
  id: string;
  name: string;
  description?: string;
  updatedAt: number;
  events: TimelineEvent[];
}
