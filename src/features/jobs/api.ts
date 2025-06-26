import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Job } from './types';

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    description: 'Join our backend team to build scalable APIs and services...',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    description: 'Looking for a versatile developer who can work on both frontend and backend...',
  },
];

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { data: mockJobs };
      },
    }),
  }),
});

export const { useGetJobsQuery } = jobsApi; 