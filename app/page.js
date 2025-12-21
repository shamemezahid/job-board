import JobBoard from './components/JobBoard';

async function getJobs() {
  try {
    const response = await fetch('https://api.airwork.ai/turbo/api/v1/public/jobs', {
      cache: 'no-store' // This ensures fresh data on each request
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function Home() {
  const jobs = await getJobs();

  return <JobBoard initialJobs={jobs} />;
}
