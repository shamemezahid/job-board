'use client';

import { useState, useEffect, useRef } from 'react';

export default function AltJobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('deadline');
    const scrollContainerRef = useRef(null);

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

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 w-full h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-700">No jobs currently available, Please come back later</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full overflow-hidden flex flex-col">
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
                <div className="w-full flex-1 flex items-center overflow-x-auto overflow-y-hidden" ref={scrollContainerRef} style={{ scrollBehavior: 'smooth' }}>
                    {/* Job Cards */}
                    <div className="scroll-container mx-6 p-5 md:p-2 flex gap-4" style={{ width: 'max-content' }}>
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
                                    className="rounded-3xl p-6 cursor-pointer transition-all bg-white hover:outline hover:outline-gray-100 block group flex-shrink-0 gap-4"
                                    style={{ minWidth: '360px' }}
                                >
                                    <div className="flex justify-between items-center mb-2 gap-4">
                                        <p className="text-sm text-gray-400">{job.company?.name || 'N/A'}</p>
                                        <span className="text-sm text-sky-700 capitalize flex items-center overflow-hidden">
                                            <span className="inline-block whitespace-nowrap transition-all duration-100 ease-in-out max-w-[400px] group-hover:max-w-0 group-hover:opacity-0 overflow-hidden">{job.status}</span>
                                            <span className="inline-block whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 overflow-hidden group-hover:max-w-[400px] group-hover:opacity-100">View job post</span>
                                        </span>
                                    </div>
                                    <h2 className="flex items-baseline gap-[6px] mb-2">
                                        <span className="text-base font-semibold text-gray-800">{job.title}</span>
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <span>{job.jobType || 'N/A'}</span>
                                            <span className="text-gray-300">|</span>
                                            <span>{job.engagementType || 'N/A'}</span>
                                            <span className="text-gray-300">|</span>
                                            <span>{job.natureOfJob || 'N/A'}</span>
                                        </div>
                                        <div className="flex flex-col gap-2 text-sm text-gray-700">
                                            <span>{job.currency} {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString() || 'N/A'} <span className="text-sm text-gray-400">/mo</span> </span>
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
            {/* Navigation Arrows */}
            <div className="w-full flex justify-center items-center gap-4 p-6">
                <button
                    onClick={handleScrollLeft}
                    className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                    aria-label="Scroll left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={handleScrollRight}
                    className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                    aria-label="Scroll right"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </>
    );
}
