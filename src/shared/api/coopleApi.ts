import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../config/env';

interface JobListItem { 
  workAssignmentId: string;
  workAssignmentName: string;
  city: string;
  hourlyWage: number;
}

interface JobDetails extends JobListItem {
  [key: string]: any;
}

const mockJobs: JobListItem[] = [
  {
    workAssignmentId: '1',
    workAssignmentName: 'Senior Android Developer',
    city: 'San Francisco',
    hourlyWage: 165,
  },
  {
    workAssignmentId: '2',
    workAssignmentName: 'iOS Developer',
    city: 'Remote',
    hourlyWage: 130,
  },
  {
    workAssignmentId: '3',
    workAssignmentName: 'Mobile Engineer (Android/iOS)',
    city: 'New York',
    hourlyWage: 145,
  },
  {
    workAssignmentId: '4',
    workAssignmentName: 'React Native Developer',
    city: 'Berlin',
    hourlyWage: 120,
  },
  {
    workAssignmentId: '5',
    workAssignmentName: 'Flutter Developer',
    city: 'London',
    hourlyWage: 140,
  },
];

const mockJobDetails: { [key: string]: JobDetails } = {
  '1': {
    workAssignmentId: '1',
    workAssignmentName: 'Senior Android Developer',
    city: 'San Francisco',
    hourlyWage: 165,
    description: 'We are looking for a Senior Android Developer to join our dynamic team...',
    requirements: ['5+ years Android development', 'Kotlin expertise', 'MVVM pattern'],
    benefits: ['Health insurance', 'Remote work', '401k'],
    company: 'TechCorp',
  },
  '2': {
    workAssignmentId: '2',
    workAssignmentName: 'iOS Developer',
    city: 'Remote',
    hourlyWage: 130,
    description: 'Join our team as an iOS Developer and help build the next generation...',
    requirements: ['3+ years iOS development', 'Swift knowledge', 'UIKit/SwiftUI'],
    benefits: ['Flexible hours', 'Remote work', 'Stock options'],
    company: 'InnoSoft',
  },
  '3': {
    workAssignmentId: '3',
    workAssignmentName: 'Mobile Engineer (Android/iOS)',
    city: 'New York',
    hourlyWage: 145,
    description: 'We need a versatile Mobile Engineer who can work on both platforms...',
    requirements: ['Cross-platform experience', 'React Native or Flutter', '4+ years experience'],
    benefits: ['Health insurance', 'Gym membership', 'Learning budget'],
    company: 'DevTech',
  },
};

export const coopleApi = createApi({
  reducerPath: 'coopleApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: ENV.COOPLE_JOBS_API,

  }),
  endpoints: (builder) => ({
    getJobsList: builder.query<JobListItem[], number>({
      query: (page = 0) => `list?pageNum=${page}&pageSize=30`,
      transformResponse: (response: any): JobListItem[] => {
        // Handle Coople API response format: { data: { items: [...] } }
        if (response && response.data && Array.isArray(response.data.items)) {
          return response.data.items;
        }
        // Handle other common formats
        if (Array.isArray(response)) {
          return response;
        }
        if (response && Array.isArray(response.data)) {
          return response.data;
        }
        if (response && Array.isArray(response.results)) {
          return response.results;
        }
        // If response is not in expected format, log it and return empty array
        console.warn('Unexpected API response format:', response);
        return [];
      },

    }),
    getJobDetails: builder.query<JobDetails, string | number>({
      query: (id) => `${id}`,
      transformResponse: (response: any): JobDetails => {
        // Handle Coople API response format
        if (response && response.data) {
          return response.data;
        }
        return response;
      },
    }),
  }),
});

export const { useGetJobsListQuery, useGetJobDetailsQuery } = coopleApi; 