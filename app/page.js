'use client';

import JobBoard from './components/JobBoard';

export default function Home() {
  return (<div className="bg-gray-50 h-full overflow-hidden">
    <JobBoard />;
  </div>);
}
