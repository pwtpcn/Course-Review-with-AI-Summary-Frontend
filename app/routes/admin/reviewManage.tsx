import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, Form, useFetcher } from "react-router";
import { useState } from "react";
import type { ReviewFilter } from "../models/Review";
import type { Review } from "../models/Review";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { AdminNavBar } from "../../component/AdminNavBar";
import { HeartRating } from "../../component/HeartRating";
import { ReviewDetailModal } from "../../component/ReviewDetailModal";
import { requireAdmin, getAccessToken } from "../../lib/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireAdmin(request);

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const sortBy = url.searchParams.get("sortBy") || "newest";

    const filter: ReviewFilter = {
        search,
        status: status as "active" | "hidden" | undefined,
        sortBy: sortBy as "newest" | "oldest" | undefined,
    };

    const reviewRepository = new ReviewRepositories();
    const reviews = await reviewRepository.GetAllReviews(filter);
    return { reviews, search, status, sortBy, user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    await requireAdmin(request);
    const accessToken = getAccessToken(request) || "";

    const formData = await request.formData();
    const intent = formData.get("intent") as string;
    const reviewId = formData.get("reviewId") as string;

    const repo = new ReviewRepositories();

    if (intent === "delete") {
        const ok = await repo.DeleteReview(reviewId, accessToken);
        return { ok, intent };
    }

    if (intent === "hide") {
        const ok = await repo.HideReview(reviewId, accessToken);
        return { ok, intent };
    }

    return { ok: false, intent };
};

export default function ReviewManage() {
    const { reviews, search, status, sortBy } = useLoaderData<typeof loader>();
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const fetcher = useFetcher();

    const handleQuickDelete = (e: React.MouseEvent, review: Review) => {
        e.stopPropagation();
        if (!confirm(`หากลบแล้วจะไม่สามารถกู้คืนข้อมูล คุณต้องการลบรีวิวนี้ใช่หรือไม่?`)) return;
        fetcher.submit(
            { intent: "delete", reviewId: review.id, accessToken: "" },
            { method: "post" }
        );
    };

    const handleQuickHide = (e: React.MouseEvent, review: Review) => {
        e.stopPropagation();
        fetcher.submit(
            { intent: "hide", reviewId: review.id, accessToken: "" },
            { method: "post" }
        );
    };

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <AdminNavBar />

            {/* Detail Modal */}
            {selectedReview && (
                <ReviewDetailModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}

            <div className="flex-1 px-4 py-8 flex flex-col items-center">

                {/* Page title */}
                <div className="w-full max-w-7xl mx-auto mb-8">
                    <div className="flex flex-col gap-6 items-start">
                        <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
                            Review Management
                        </h2>
                        <p className="text-xs text-gray-400">View and manage all student reviews</p>
                    </div>
                </div>

                {/* Filter bar */}
                <div className="w-full max-w-7xl mx-auto mb-6">
                    <Form
                        method="get"
                        className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end"
                    >
                        {/* Search */}
                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="search" className="text-xs text-gray-400">Search</label>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                defaultValue={search || ""}
                                placeholder="Course ID, username, content..."
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch"
                            />
                        </div>

                        {/* Status */}
                        <div className="w-full md:w-40 space-y-2">
                            <label htmlFor="status" className="text-xs text-gray-400">Status</label>
                            <select
                                name="status"
                                id="status"
                                defaultValue={status || ""}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch appearance-none"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="w-full md:w-48 space-y-2">
                            <label htmlFor="sortBy" className="text-xs text-gray-400">Sort By</label>
                            <select
                                name="sortBy"
                                id="sortBy"
                                defaultValue={sortBy || "newest"}
                                className="w-full bg-black border border-[#2A2A2A] rounded-lg p-3 text-white focus:outline-none focus:border-[#1BE1F3] text-xs font-chakra-petch appearance-none"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className="w-full md:w-auto pt-2 md:pt-0">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-[#1BE1F3]/10 hover:bg-[#1BE1F3]/20 text-[#1BE1F3] border border-[#1BE1F3]/30 py-3 px-6 rounded-lg text-xs transition-colors"
                            >
                                Filter
                            </button>
                        </div>
                    </Form>
                </div>

                {/* Table */}
                <div className="w-full max-w-7xl mx-auto overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#111] text-[#1BE1F3] text-[10px] md:text-xs">
                                    <th className="p-4 whitespace-nowrap">Course ID</th>
                                    <th className="p-4 whitespace-nowrap">User</th>
                                    <th className="p-4 text-center whitespace-nowrap">Rating</th>
                                    <th className="p-4 min-w-[200px]">Content</th>
                                    <th className="p-4 min-w-[140px]">Pros</th>
                                    <th className="p-4 text-center whitespace-nowrap">Status</th>
                                    <th className="p-4 text-center whitespace-nowrap">Date</th>
                                    <th className="p-4 text-center whitespace-nowrap">Detail</th>
                                    <th className="p-4 text-center whitespace-nowrap">Hide</th>
                                    <th className="p-4 text-center whitespace-nowrap">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px] md:text-xs font-chakra-petch">
                                {!reviews || reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="p-8 text-center text-gray-500 font-['Press_Start_2P'] text-[10px]">
                                            No reviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((review: Review) => (
                                        <tr
                                            key={review.id}
                                            className="border-b border-[#2A2A2A]/50 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
                                            onClick={() => setSelectedReview(review)}
                                        >
                                            {/* Course ID */}
                                            <td className="p-4 font-mono text-[#FCFC00] whitespace-nowrap">
                                                {review.courseId}
                                            </td>

                                            {/* User */}
                                            <td className="p-4 whitespace-nowrap">
                                                {review.user?.username ?? (
                                                    <span className="text-gray-600 text-[10px]">
                                                        {review.userId.slice(0, 8)}…
                                                    </span>
                                                )}
                                            </td>

                                            {/* Rating */}
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    <HeartRating rating={review.rating} />
                                                </div>
                                            </td>

                                            {/* Content */}
                                            <td className="p-4">
                                                <div
                                                    className="line-clamp-2 text-gray-300 text-[11px]"
                                                    title={review.content}
                                                >
                                                    {review.content}
                                                </div>
                                            </td>

                                            {/* Pros */}
                                            <td className="p-4">
                                                <div
                                                    className="line-clamp-2 text-green-400 text-[11px]"
                                                    title={review.pros}
                                                >
                                                    {review.pros}
                                                </div>
                                            </td>

                                            {/* Status badge */}
                                            <td className="p-4 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-[9px] uppercase font-['Press_Start_2P'] border ${
                                                        review.status === "active"
                                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                                    }`}
                                                >
                                                    {review.status}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-center text-gray-400 whitespace-nowrap">
                                                {new Date(review.createdAt).toLocaleDateString("th-TH", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>

                                            {/* Detail button */}
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedReview(review)}
                                                    className="text-[#1BE1F3] hover:text-[#1BE1F3]/70 transition-colors"
                                                    title="View detail"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                </button>
                                            </td>

                                            {/* Hide button */}
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                {review.status === "active" ? (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleQuickHide(e, review)}
                                                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                        title="Hide review"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-700 text-[10px]">—</span>
                                                )}
                                            </td>

                                            {/* Delete button */}
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleQuickDelete(e, review)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete review"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Row count */}
                    {reviews && reviews.length > 0 && (
                        <div className="border-t border-[#2A2A2A] px-4 py-3 text-[10px] text-gray-500 font-chakra-petch">
                            Total: {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}