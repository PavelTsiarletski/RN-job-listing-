import { Job } from '../jobs/types';

export interface JobDetails extends Job {
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  benefits?: string[];
} 