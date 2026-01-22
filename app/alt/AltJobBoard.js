'use client';

import { useState, useEffect } from 'react';

export default function AltJobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('deadline');

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch('https://api.airwork.ai/turbo/api/v1/public/jobs');
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const result = await response.json();
                setJobs(result.data || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError(error.message || 'Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const filteredJobs = jobs
        .filter(job => new Date(job.deadline) > new Date())
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'salary':
                    return (b.maxSalary || 0) - (a.maxSalary || 0);
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'posted':
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="gradient-bg w-full h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gradient-bg w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">No jobs currently available, Please come back later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-hidden">
            <style jsx>{`
                @keyframes scrollHorizontal {
                    0% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(calc(-100% + 100vw));
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                .scroll-container {
                    animation: scrollHorizontal 60s ease-in-out infinite;
                }
                .scroll-container:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="w-full h-full overflow-hidden">
                {/* Job Cards */}
                <div className="scroll-container p-5 md:p-2 flex gap-4 pb-64" style={{ width: 'max-content' }}>
                    {filteredJobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20" style={{ width: '100vw' }}>
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700">No jobs currently available, Please come back later</p>
                            </div>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <a
                                key={job._id}
                                href={`https://app.airwork.ai/jobs/${job._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-3xl p-6 cursor-pointer transition-all bg-white hover:bg-gray-50 block group flex-shrink-0"
                                style={{ width: '350px' }}
                            >
                                <div className="flex justify-between items-center mb-2 gap-4">
                                    <p className="text-sm text-gray-400">{job.company?.name || 'N/A'}</p>
                                    <span className="text-sm text-sky-700 capitalize flex items-center overflow-hidden">
                                        <span className="inline-block whitespace-nowrap transition-all duration-100 ease-in-out max-w-[200px] group-hover:max-w-0 group-hover:opacity-0 overflow-hidden">{job.status}</span>
                                        <span className="inline-block whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 overflow-hidden group-hover:max-w-[200px] group-hover:opacity-100">View job post</span>
                                    </span>
                                </div>
                                <h2 className="flex items-baseline gap-[6px] mb-2">
                                    <span className="text-base font-medium text-gray-800">{job.title}</span>
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span>{job.jobType || 'N/A'}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{job.engagementType || 'N/A'}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{job.natureOfJob || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-700">
                                        <span>{job.currency} {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString() || 'N/A'}</span>
                                        <span className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">Deadline</span>
                                            <span className={`text-sm ${new Date(job.deadline) < new Date() ? 'text-red-900' : 'text-gray-700'}`}>
                                                {new Date(job.deadline).toLocaleDateString()}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
