import { useLoaderData, useFetcher, Form } from "react-router";
import { ReportRepositories } from "../repositories/ReportRepositories";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { AdminNavBar } from "../../component/AdminNavBar";
import type { Report } from "../models/Report";

export const loader = async ({ request }: { request: Request }) => {
    const reportRepository = new ReportRepositories();
    const reports = await reportRepository.GetAllReports("newest");

    return { reports };
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
            // Approves the report, deletes the review
            await reportRepository.ApproveReport(reportId, token);
            await reviewRepository.DeleteReview(reviewId, token);
            return { success: true, message: "Report accepted. Review deleted." };
        }
    } catch (e: any) {
        console.error("Action failed:", e);
        return { error: e.message || "Failed to process the report." };
    }

    return { error: "Unknown intent" };
};

export default function ManageReport() {
    const { reports } = useLoaderData<typeof loader>();
    const fetcher = useFetcher();

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

                <div className="w-full max-w-5xl mx-auto space-y-6">
                    {!reports || reports.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            No reports found.
                        </div>
                    ) : (
                        reports.map((report: Report) => (
                            <div
                                key={report.id}
                                className={`bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col gap-4 ${report.status !== 'pending' ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs text-[#1BE1F3]">Report ID:</span>
                                            <span className="text-[10px] break-all">{report.id}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs text-[#1BE1F3]">Review ID:</span>
                                            <span className="text-[10px] break-all">{report.reviewId}</span>
                                        </div>

                                        <div className="mt-4">
                                            <span className="text-xs text-[#FCFC00]">Reason:</span>
                                            <span className="ml-2 text-xs uppercase">{report.reason}</span>
                                        </div>

                                        <div className="mt-3 bg-[#111] p-3 rounded-lg border border-[#333]">
                                            <span className="text-xs text-[#1BE1F3] block mb-2">Notice Info:</span>
                                            <p className="text-[10px] leading-relaxed break-words font-sans">{report.content}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase ${report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            report.status === 'approved' ? 'bg-red-500/20 text-red-500' :
                                                'bg-green-500/20 text-green-500'
                                            }`}>
                                            {report.status}
                                        </span>
                                        <span className="text-[8px] text-gray-500">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {report.status === 'pending' && (
                                    <div className="flex justify-end gap-4 mt-2">
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
                                                className="px-6 py-2 text-[10px] uppercase rounded border border-red-500 text-red-500 hover:bg-red-500 border border-transparent hover:text-white transition-colors"
                                            >
                                                Delete Review (Accept Report)
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