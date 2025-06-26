import { jobsApi } from '../jobs/api';
import { JobDetails } from './types';

const mockJobDetails: Record<string, JobDetails> = {
  '1': {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences...',
    requirements: [
      '3+ years of experience with React',
      'Strong knowledge of JavaScript/TypeScript',
      'Experience with CSS and modern styling frameworks',
      'Familiarity with state management (Redux, Context API)',
    ],
    responsibilities: [
      'Develop user-facing features using React',
      'Collaborate with designers to implement UI/UX designs',
      'Write clean, maintainable code',
      'Participate in code reviews',
    ],
    salary: '$80,000 - $120,000',
    benefits: ['Health insurance', 'Remote work', '401k matching'],
  },
  '2': {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    description: 'Join our backend team to build scalable APIs and services that power our platform...',
    requirements: [
      '4+ years of backend development experience',
      'Strong knowledge of Node.js or Python',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Understanding of microservices architecture',
    ],
    responsibilities: [
      'Design and implement RESTful APIs',
      'Optimize database queries and performance',
      'Ensure system scalability and reliability',
      'Write comprehensive tests',
    ],
    salary: '$90,000 - $140,000',
    benefits: ['Health insurance', 'Stock options', 'Flexible hours'],
  },
  '3': {
    id: '3',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    description: 'Looking for a versatile developer who can work on both frontend and backend technologies...',
    requirements: [
      '5+ years of full-stack development',
      'Experience with React and Node.js',
      'Knowledge of cloud platforms (AWS, GCP)',
      'Strong problem-solving skills',
    ],
    responsibilities: [
      'Develop end-to-end features',
      'Maintain and improve existing codebase',
      'Deploy and monitor applications',
      'Mentor junior developers',
    ],
    salary: '$100,000 - $160,000',
    benefits: ['Fully remote', 'Unlimited PTO', 'Learning budget'],
  },
};

export const jobDetailsApi = jobsApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetails: builder.query<JobDetails, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const jobDetails = mockJobDetails[id];
        if (!jobDetails) {
          return { error: { status: 404, data: 'Job not found' } };
        }
        
        return { data: jobDetails };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetJobDetailsQuery } = jobDetailsApi; 