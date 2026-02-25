'use client';

import { useState, useEffect } from 'react';

export default function GridJobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('deadline');

    useEffect(() => {
        async function fetchJobs() {
            try {
                const response = await fetch('https://ignition.airwork.ai/api/v2/public/jobs');
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
        <div className="w-full min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12">
            {/* Header with Sort */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Available Positions</h1>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm px-4 py-2 rounded-xl bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                        <option value="deadline">Deadline soon</option>
                        <option value="posted">Posted recently</option>
                        <option value="title">A to Z</option>
                        <option value="salary">Highest salary</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto">
                {filteredJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">No jobs currently available, Please come back later</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <a
                                key={job._id}
                                href={`https://app.airwork.ai/jobs/${job._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-3xl p-6 cursor-pointer transition-all bg-white hover:shadow-lg hover:outline hover:outline-gray-100 block group"
                            >
                                <div className="flex justify-between items-center mb-2 gap-4">
                                    <p className="text-sm text-gray-400">{job.company?.name || 'N/A'}</p>
                                    <span className="text-sm text-[#1560F5] capitalize flex items-center overflow-hidden">
                                        <span className="inline-block whitespace-nowrap transition-all duration-100 ease-in-out max-w-[400px] group-hover:max-w-0 group-hover:opacity-0 overflow-hidden">{job.status}</span>
                                        <span className="inline-block whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 overflow-hidden group-hover:max-w-[400px] group-hover:opacity-100">View job post</span>
                                    </span>
                                </div>
                                <h2 className="flex items-baseline gap-[6px] mb-2">
                                    <span className="text-base font-semibold text-gray-800">{job.title}</span>
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 flex-wrap">
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
