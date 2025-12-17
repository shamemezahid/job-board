'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortBy, setSortBy] = useState('posted');
  const rightPanelRef = useRef(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('https://api.airwork.ai/turbo/api/v1/public/jobs');
        const result = await response.json();
        setJobs(result.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    if (rightPanelRef.current && selectedJob) {
      rightPanelRef.current.scrollTop = 0;
    }
  }, [selectedJob]);

  const filteredJobs = jobs.sort((a, b) => {
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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      <div className="h-screen md:grid md:grid-cols-6 w-full gap-4 p-12 md:p-6 relative">

        {/* Left panel */}
        <div className={`left-panel absolute md:relative inset-0 md:inset-auto md:col-span-3 lg:col-span-2 w-full h-full overflow-y-hidden overflow-x-visible transition-all duration-300 ${selectedJob ? 'opacity-0 -translate-x-full pointer-events-none md:pointer-events-auto md:opacity-100 md:translate-x-0' : 'opacity-100 translate-x-0'}`}>
          <div className="sticky flex flex-col p-5 pb-2 md:p-2">
            <div className="flex justify-between items-center mb-2 gap-3 flex-col md:flex-row">
              <h1 className="text-xl font-medium text-gray-800 text-center md:text-left">Active jobs at Airwork AI</h1>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm px-4 py-2 rounded-xl bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <option value="posted">Posted recently</option>
                <option value="title">A to Z</option>
                <option value="salary">Highest salary</option>
                <option value="deadline">Deadline soon</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="p-5 md:p-2 h-full overflow-y-scroll overflow-x-visible grid grid-cols-1 gap-4 pb-64">
            {filteredJobs.map(job => (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className={`w-full rounded-3xl p-6 cursor-pointer transition-all ${selectedJob?._id === job._id
                  ? 'bg-sky-50 outline-2 outline-sky-500'
                  : 'bg-white hover:bg-gray-50'
                  }`}
              >
                <div className="flex justify-between items-center mb-2 gap-4">
                  <span className="flex">
                <p className="text-sm text-gray-600">{job.company?.name || 'N/A'}</p>
                  {job.city && job.city !== 'N/A' && (
                      <span className="text-sm text-gray-500">, {" "}{job.city}</span>
                    )}
                </span>
                  <span className="text-sm text-sky-700 capitalize">{job.status}</span>
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
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Deadline</span>
                    <span className={`text-sm ${new Date(job.deadline) < new Date() ? 'text-red-900' : 'text-gray-700'}`}>
                      {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div ref={rightPanelRef} className={`right-panel absolute md:relative inset-0 md:inset-auto md:col-span-3 lg:col-span-4 w-full h-full bg-white rounded-none md:rounded-3xl overflow-y-scroll transition-all duration-300 ${selectedJob ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none md:pointer-events-auto md:opacity-100 md:translate-x-0'}`}>
          {selectedJob ? (
            <div className="m-8 space-y-6">

              {/* Header */}
              <div className="border-b pb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 mb-2">{selectedJob.title}</h1>
                  <p className="text-sm text-gray-600">{selectedJob.company?.name || 'N/A'}</p>
                </div>
                <a
                  href={`https://app.airwork.ai/jobs/${selectedJob._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-sky-100 text-sky-700 text-sm rounded-xl hover:bg-sky-200 transition-colors whitespace-nowrap"
                >
                  Go to Job
                </a>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-sm text-gray-800 capitalize">{selectedJob.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Engagement Type</p>
                  <p className="text-sm text-gray-800">{selectedJob.engagementType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Job Type</p>
                  <p className="text-sm text-gray-800">{selectedJob.jobType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Nature of Job</p>
                  <p className="text-sm text-gray-800">{selectedJob.natureOfJob || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-sm text-gray-800">{selectedJob.city}, {selectedJob.country?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Timezone</p>
                  <p className="text-sm text-gray-800">{selectedJob.timezone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Experience</p>
                  <p className="text-sm text-gray-800">{selectedJob.yearsOfExperience || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Salary Range</p>
                  <p className="text-sm text-gray-800">
                    {selectedJob.currency} {selectedJob.minSalary?.toLocaleString()} - {selectedJob.maxSalary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Published Date</p>
                  <p className="text-sm text-gray-800">{new Date(selectedJob.publishedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Deadline</p>
                  <p className="text-sm text-gray-800">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Joining Date</p>
                  <p className="text-sm text-gray-800">{new Date(selectedJob.joiningDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Vacancies</p>
                  <p className="text-sm text-gray-800">{selectedJob.numberOfVacancies || 'N/A'}</p>
                </div>
              </div>

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-sky-50 text-sky-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Job Description</p>
                <div
                  className="text-sm text-gray-800 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />
              </div>

              {/* Company Info */}
              {selectedJob.company && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-400 mb-2">About Company</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Industry</p>
                      <p className="text-sm text-gray-800">{selectedJob.company.industry || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Employee Count</p>
                      <p className="text-sm text-gray-800">{selectedJob.company.employeeNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Established</p>
                      <p className="text-sm text-gray-800">{selectedJob.company.yearEstablished || 'N/A'}</p>
                    </div>
                    {selectedJob.company.about && (
                      <div>
                        <p className="text-sm text-gray-600">About</p>
                        <p className="text-sm text-gray-800">{selectedJob.company.about}</p>
                      </div>
                    )}
                    <div className="flex gap-4">
                      {selectedJob.company.companyURL && (
                        <a href={selectedJob.company.companyURL} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">
                          Website
                        </a>
                      )}
                      {selectedJob.company.linkedinURL && (
                        <a href={selectedJob.company.linkedinURL} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {selectedJob.company.facebookURL && (
                        <a href={selectedJob.company.facebookURL} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {(selectedJob.minYearsOfExperience || selectedJob.maxYearsOfExperience || selectedJob.paymentModality || selectedJob.preferredApplicants) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-400 mb-2">Additional Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(selectedJob.minYearsOfExperience || selectedJob.maxYearsOfExperience) && (
                      <div>
                        <p className="text-sm text-gray-600">Experience Range</p>
                        <p className="text-sm text-gray-800">
                          {selectedJob.minYearsOfExperience || 0} - {selectedJob.maxYearsOfExperience || 0} years
                        </p>
                      </div>
                    )}
                    {selectedJob.paymentModality && (
                      <div>
                        <p className="text-sm text-gray-600">Payment Modality</p>
                        <p className="text-sm text-gray-800">
                          {selectedJob.paymentModality.name} {selectedJob.paymentModality.rate ? `(${selectedJob.paymentModality.rate})` : ''}
                        </p>
                      </div>
                    )}
                    {selectedJob.preferredApplicants && selectedJob.preferredApplicants.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Preferred Applicants</p>
                        <p className="text-sm text-gray-800">{selectedJob.preferredApplicants.join(', ')}</p>
                      </div>
                    )}
                    {selectedJob.categories && selectedJob.categories.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-sm text-gray-800">{selectedJob.categories.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Details (if applicable) */}
              {(selectedJob.projectDuration || selectedJob.projectStartDate || selectedJob.projectEndDate || selectedJob.timeCommitment || selectedJob.projectBudget) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-400 mb-2">Project Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedJob.projectDuration && (
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-sm text-gray-800">{selectedJob.projectDuration}</p>
                      </div>
                    )}
                    {selectedJob.projectStartDate && (
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="text-sm text-gray-800">{new Date(selectedJob.projectStartDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedJob.projectEndDate && (
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="text-sm text-gray-800">{new Date(selectedJob.projectEndDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedJob.timeCommitment && (
                      <div>
                        <p className="text-sm text-gray-600">Time Commitment</p>
                        <p className="text-sm text-gray-800">{selectedJob.timeCommitment}</p>
                      </div>
                    )}
                    {selectedJob.projectBudget && (
                      <div>
                        <p className="text-sm text-gray-600">Project Budget</p>
                        <p className="text-sm text-gray-800">{selectedJob.currency} {selectedJob.projectBudget.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  {selectedJob.projectAttachmentURL && (
                    <div className="mt-2">
                      <a href={selectedJob.projectAttachmentURL} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline">
                        View Project Attachment
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Screening Questions */}
              {selectedJob.screeningQuestions && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-400 mb-2">Screening Requirements</p>
                  <div className="space-y-3">
                    {selectedJob.screeningQuestions.custom && selectedJob.screeningQuestions.custom.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Custom Questions</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {selectedJob.screeningQuestions.custom.map((q, idx) => (
                            <li key={idx} className="text-sm text-gray-800">
                              {q.question}
                              {q.description && <p className="text-sm text-gray-600 ml-5 mt-1">{q.description}</p>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedJob.screeningQuestions.experience && selectedJob.screeningQuestions.experience.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Experience Requirements</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {selectedJob.screeningQuestions.experience.map((q, idx) => (
                            <li key={idx} className="text-sm text-gray-800">
                              {q.question} {q.industry && `(${q.industry})`} {q.experience && `- ${q.experience}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedJob.screeningQuestions.location && selectedJob.screeningQuestions.location.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Location Requirements</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {selectedJob.screeningQuestions.location.map((q, idx) => (
                            <li key={idx} className="text-sm text-gray-800">
                              {q.question} {q.answer && `(${q.answer})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedJob.screeningQuestions.noticePeriod && selectedJob.screeningQuestions.noticePeriod.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Notice Period</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {selectedJob.screeningQuestions.noticePeriod.map((q, idx) => (
                            <li key={idx} className="text-sm text-gray-800">
                              {q.question} {q.noticePeriod && `(${q.noticePeriod})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Question Sets / Skills Tests */}
              {selectedJob.questionSets && selectedJob.questionSets.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-400 mb-2">Required Skill Tests</p>
                  <div className="space-y-3">
                    {selectedJob.questionSets.map((qs, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{qs.questionSet?.title || 'N/A'}</p>
                            {qs.questionSet?.description && (
                              <p className="text-sm text-gray-600 mt-1">{qs.questionSet.description}</p>
                            )}
                          </div>
                          {qs.selected && (
                            <span className="text-xs px-2 py-1 bg-sky-100 text-sky-700 rounded">Required</span>
                          )}
                        </div>
                        {qs.questionSet?.difficulty && (
                          <p className="text-sm text-gray-600 mt-2">Difficulty: {qs.questionSet.difficulty}</p>
                        )}
                        {qs.questionSet?.skill?.title && (
                          <p className="text-sm text-gray-600">Skill: {qs.questionSet.skill.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View Count */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-400">Views: {selectedJob.viewCount || 0}</p>
              </div>
            </div>
          ) : (
            <div className="m-8 h-full flex flex-col items-center justify-center">
              <img className="h-8 mb-12" src="https://airwork.ai/assets/airwork-logos/wide/airwork-blue-new.svg"></img>
              <p className="text-2x text-center text-sky-900 mb-3">Welcome to all jobs at Airwork AI</p>
              <p className="text-sm text-center text-gray-400">Select a job to view details</p>
            </div>
          )}
        </div>

        {/* Close Button */}
        {selectedJob && (
          <button
            onClick={() => setSelectedJob(null)}
            className="fixed cursor-pointer bottom-4 md:bottom-10 right-6 md:right-10 w-fit px-4 py-2 h-10 md:w-12 md:h-12 flex items-center justify-center gap-4 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 backdrop-blur transition-colors text-gray-600 hover:text-gray-800"
            aria-label="Close details"
          >
            <p className="text-sm text-gray-500 block md:hidden">Go back</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
