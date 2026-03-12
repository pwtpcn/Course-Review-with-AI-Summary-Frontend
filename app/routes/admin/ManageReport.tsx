import { useState } from "react";
import { useLoaderData, useFetcher, Form } from "react-router";
import { ReportRepositories } from "../repositories/ReportRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { AdminNavBar } from "../../component/AdminNavBar";
import type { Report } from "../models/Report";
import type { Review } from "../models/Review";

export const loader = async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const statusFilter = url.searchParams.get("status") || "all";

    const reportRepository = new ReportRepositories();
    const reviewRepository = new ReviewRepositories();
    const reports = await reportRepository.GetAllReports("newest");

    let reportsWithReviews: (Report & { review?: Review | null })[] = [];
    if (reports) {
        reportsWithReviews = await Promise.all(
            reports.map(async (report) => {
                const review = await reviewRepository.GetReviewById(report.reviewId);
                return { ...report, review };
            })
        );
        
        // Client-side filtering
        if (search || statusFilter !== "all") {
            reportsWithReviews = reportsWithReviews.filter((report) => {
                const matchesSearch = search 
                    ? report.id.toLowerCase().includes(search) || report.reviewId.toLowerCase().includes(search)
                    : true;
                const matchesStatus = statusFilter !== "all" 
                    ? report.status === statusFilter 
                    : true;
                return matchesSearch && matchesStatus;
            });
        }
    }

    return { reports: reportsWithReviews, search, statusFilter };
};

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const intent = formData.get("intent");
    const reportId = formData.get("reportId") as string;
    const reviewId = formData.get("reviewId") as string;

    // We need the admin token to approve/cancel reports
    const cookieHeader = request.headers.get("Cookie");
    const token = cookieHeader
        ?.split(";")
        .find((c) => c.trim().startsWith("access_token="))
        ?.split("=")[1];

    if (!token) {
        return { error: "Unauthorized" };
    }

    const reportRepository = new ReportRepositories();
    const reviewRepository = new ReviewRepositories();

    try {
        if (intent === "reject_report") {
            // Keeps the review, rejects the report
            await reportRepository.CancelReport(reportId, token);
            return { success: true, message: "Report rejected. Review kept." };
        } else if (intent === "accept_report") {
            // Approves the report, hides the review
            await reportRepository.ApproveReport(reportId, token);
            await reviewRepository.HideReview(reviewId, token);
            return { success: true, message: "Report accepted. Review hidden." };
        }
    } catch (e: any) {
        console.error("Action failed:", e);
        return { error: e.message || "Failed to process the report." };
    }

    return { error: "Unknown intent" };
};

export default function ManageReport() {
    const { reports, search, statusFilter } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedReports(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <AdminNavBar />

            <div className="flex-1 px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-5xl mx-auto mb-6">
                    <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
                        Report Actions
                    </h2>
                    <p className="mt-4 text-xs text-gray-400">Manage reported reviews</p>
                </div>

                {fetcher.data?.error && (
                    <div className="text-red-500 mb-4 text-xs">{fetcher.data.error}</div>
                )}
                {fetcher.data?.success && (
                    <div className="text-green-500 mb-4 text-xs">{fetcher.data.message}</div>
                )}

                <div className="w-full max-w-5xl mx-auto mb-6">
                    <Form method="get" className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="search" className="text-xs text-gray-400">Search</label>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                defaultValue={search}
                                placeholder="Report ID or Review ID..."
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white font-chakra-petch focus:outline-none focus:border-[#1BE1F3] text-xs"
                            />
                        </div>
                        
                        <div className="w-full md:w-64 space-y-2">
                            <label htmlFor="status" className="text-xs text-gray-400">Status</label>
                            <select
                                name="status"
                                id="status"
                                defaultValue={statusFilter}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white font-chakra-petch focus:outline-none focus:border-[#1BE1F3] text-xs appearance-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending Only</option>
                                <option value="approved">Approved Only</option>
                                <option value="rejected">Rejected Only</option>
                            </select>
                        </div>

                        <div className="w-full md:w-auto pt-2 md:pt-0">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[#1BE1F3]/10 hover:bg-[#1BE1F3]/20 text-[#1BE1F3] border border-[#1BE1F3]/30 py-3 px-6 rounded-lg text-xs md:text-sm transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </Form>
                </div>

                <div className="w-full max-w-5xl mx-auto space-y-6">
                    {!reports || reports.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            No reports found.
                        </div>
                    ) : (
                        reports.map((report: Report & { review?: Review | null }) => (
                            <div
                                key={report.id}
                                className={`bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl overflow-hidden ${report.status !== 'pending' ? 'opacity-50' : ''}`}
                            >
                                {/* --- Collapsed Header View (Always Visible) --- */}
                                <div 
                                    onClick={() => toggleExpand(report.id)}
                                    className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-[#111] transition-colors gap-4"
                                >
                                    {/* Left Side: IDs and Reason */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[#1BE1F3] w-24">Report ID:</span>
                                            <span className="text-[10px] text-white tracking-widest">{report.id}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[#1BE1F3] w-24">Review ID:</span>
                                            <span className="text-[10px] text-white tracking-widest">{report.reviewId}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-[#FCFC00] w-24">Reason:</span>
                                            <span className="text-xs text-white uppercase">{report.reason}</span>
                                        </div>
                                    </div>

                                    {/* Right Side: Status and Date */}
                                    <div className="flex flex-col items-end justify-center min-w-[80px] gap-2">
                                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase ${report.status === 'pending'
                                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                                                : report.status === 'approved'
                                                    ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                                                    : 'bg-green-500/20 text-green-500 border border-green-500/50'}`}>
                                            {report.status}
                                        </span>
                                        <span className="text-[8px] text-gray-400">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            className={`text-gray-500 transition-transform duration-200 mt-2 ${expandedReports.has(report.id) ? 'rotate-180' : ''}`}
                                        >
                                            <path d="m6 9 6 6 6-6"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* --- Expanded Details View (Conditionally Visible) --- */}
                                {expandedReports.has(report.id) && (
                                        <div className="p-6 border-t border-[#2A2A2A] bg-[#0d0d0d]">
                                            <div className="bg-[#111] p-4 rounded-lg border border-[#333]">
                                                <span className="text-xs text-[#1BE1F3] block mb-2">Notice Info (Report Details):</span>
                                                <p className="text-[11px] leading-relaxed break-words font-sans text-gray-300">{report.content}</p>
                                            </div>

                                            {/* Display Attached Review Info */}
                                            <div className="mt-6 border-t border-[#222] pt-4">
                                                <span className="text-xs text-red-400 flex items-center gap-2 mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                    Reported Review Content:
                                                </span>
                                                {report.review ? (
                                                    <div className="bg-black border border-[#222] p-4 rounded-lg">
                                                        <div className="flex justify-between items-start mb-3 border-b border-[#222] pb-3">
                                                            <div>
                                                                <div className="text-[10px] text-gray-500 mb-1">Course ID</div>
                                                                <div className="text-xs text-[#1BE1F3]">{report.review.courseId}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-[10px] text-gray-500 mb-1">Hard Level</div>
                                                                <div className="text-xs text-[#FCFC00]">{report.review.rating}/5</div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <span className="text-[10px] text-gray-500 block mb-1">Content:</span>
                                                            <div className="text-[11px] font-sans text-white leading-relaxed whitespace-pre-line">
                                                                {report.review.content}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#222]">
                                                            <div>
                                                                <span className="text-[10px] text-green-400 block mb-1">Pros:</span>
                                                                <p className="text-[10px] text-gray-300 font-sans">{report.review.pros || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] text-red-400 block mb-1">Cons:</span>
                                                                <p className="text-[10px] text-gray-300 font-sans">{report.review.cons || "-"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-gray-500 italic p-4 bg-[#111] rounded-lg border border-dashed border-[#333] text-center">
                                                        Review not found (It may have been deleted or hidden)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* --- Action Buttons (Only visible if expanded and pending) --- */}
                                {expandedReports.has(report.id) && report.status === 'pending' && (
                                    <div className="flex justify-end gap-4 p-4 border-t border-[#2A2A2A] bg-[#0d0d0d]">
                                        <fetcher.Form method="post">
                                            <input type="hidden" name="reportId" value={report.id} />
                                            <input type="hidden" name="reviewId" value={report.reviewId} />
                                            <button
                                                type="submit"
                                                name="intent"
                                                value="reject_report"
                                                className="px-6 py-2 text-[10px] uppercase rounded border border-gray-600 hover:bg-gray-800 transition-colors"
                                            >
                                                Keep Review (Reject Report)
                                            </button>
                                        </fetcher.Form>

                                        <fetcher.Form method="post">
                                            <input type="hidden" name="reportId" value={report.id} />
                                            <input type="hidden" name="reviewId" value={report.reviewId} />
                                            <button
                                                type="submit"
                                                name="intent"
                                                value="accept_report"
                                                className="px-6 py-2 text-[10px] uppercase rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                Hide Review (Accept Report)
                                            </button>
                                        </fetcher.Form>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}