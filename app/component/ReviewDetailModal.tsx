import { useFetcher } from "react-router";
import type { Review } from "../routes/models/Review";
import { HeartRating } from "./HeartRating";

interface ReviewDetailModalProps {
    review: Review;
    onClose: () => void;
}

export function ReviewDetailModal({ review, onClose }: ReviewDetailModalProps) {
    const fetcher = useFetcher();

    const handleAction = (intent: "delete" | "hide") => {
        fetcher.submit(
            { intent, reviewId: review.id, accessToken: "" },
            { method: "post" }
        );
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-[#FCFC00] font-['Press_Start_2P'] text-sm mb-1">
                            Review Detail
                        </h2>
                        <p className="text-gray-500 font-chakra-petch text-xs break-all">
                            ID: {review.id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors shrink-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3 mb-5 text-xs font-chakra-petch">
                    <div className="bg-[#111] border border-[#2A2A2A] rounded-lg p-3 space-y-1">
                        <p className="text-gray-500 text-[10px] font-['Press_Start_2P']">Course</p>
                        <p className="text-[#1BE1F3]">{review.courseId}</p>
                    </div>
                    <div className="bg-[#111] border border-[#2A2A2A] rounded-lg p-3 space-y-1">
                        <p className="text-gray-500 text-[10px] font-['Press_Start_2P']">User</p>
                        <p className="text-white truncate">{review.user?.username ?? review.userId}</p>
                    </div>
                    <div className="bg-[#111] border border-[#2A2A2A] rounded-lg p-3 space-y-1">
                        <p className="text-gray-500 text-[10px] font-['Press_Start_2P']">Rating</p>
                        <HeartRating rating={review.rating} />
                    </div>
                    <div className="bg-[#111] border border-[#2A2A2A] rounded-lg p-3 space-y-1">
                        <p className="text-gray-500 text-[10px] font-['Press_Start_2P']">Status</p>
                        <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-['Press_Start_2P'] border ${
                                review.status === "active"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                        >
                            {review.status}
                        </span>
                    </div>
                </div>

                {/* Content fields */}
                {[
                    { label: "Content", value: review.content },
                    { label: "Pros", value: review.pros },
                    ...(review.cons ? [{ label: "Cons", value: review.cons }] : []),
                    ...(review.testPrepare ? [{ label: "Test Prepare", value: review.testPrepare }] : []),
                ].map(({ label, value }) => (
                    <div key={label} className="mb-4">
                        <p className="text-gray-500 font-['Press_Start_2P'] text-[10px] mb-2">{label}</p>
                        <div className="bg-[#111] border border-[#2A2A2A] rounded-lg p-3 text-sm text-gray-200 font-chakra-petch leading-relaxed">
                            {value}
                        </div>
                    </div>
                ))}

                {/* Stats */}
                <div className="flex gap-4 text-xs font-chakra-petch text-gray-500 mb-6">
                    <span>👍 {review.like}</span>
                    <span>👎 {review.dislike}</span>
                    {review.isEdited && <span className="text-yellow-500">✎ Edited</span>}
                    <span className="ml-auto">
                        {new Date(review.createdAt).toLocaleDateString("th-TH", {
                            year: "numeric", month: "short", day: "numeric",
                        })}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    {review.status === "active" && (
                        <button
                            onClick={() => handleAction("hide")}
                            className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg text-xs font-['Press_Start_2P'] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            Hide
                        </button>
                    )}
                    <button
                        onClick={() => handleAction("delete")}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-['Press_Start_2P'] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
