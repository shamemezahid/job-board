'use client';

import JobBoard from './components/JobBoard';

export default function Home() {
  return (<div className="min-h-screen gradient-bg overflow-hidden">
    <JobBoard />;
  </div>);
}
