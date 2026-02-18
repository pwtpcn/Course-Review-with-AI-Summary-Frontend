import type { ActionFunction } from "react-router";
import { NavLink, useFetcher } from "react-router";
import { useState } from "react";
import { Heart } from "lucide-react";

interface ActionMessage {
    message: string;
    error: string;
    data: any;
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    // Action logic here
    return { message: "Review submitted", error: "", data: null };
};

export default function WriteReview() {
    const fetcher = useFetcher<ActionMessage>();
    const [rating, setRating] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] flex flex-col items-center py-12 px-4 relative">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-[#FCFC00] text-xl md:text-3xl mb-4 ">
                    Write you review
                </h1>
                <p className="text-[#FCFC00] text-[10px] md:text-xs">
                    01418490 | Cooperative Education
                </p>
            </div>

            <fetcher.Form method="post" className="w-full max-w-2xl space-y-8">

                {/* Content Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Content</label>
                    <textarea
                        name="content"
                        className="w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                {/* Hard Level (Hearts) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs md:text-sm">
                        <span className="text-white">Hard level</span>
                        <span className="text-gray-400 text-[10px]">( <span className="text-red-500">♥</span> = easy )</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transform hover:scale-110 transition-transform"
                            >
                                <Heart
                                    className={`w-6 h-6 ${star <= rating ? "fill-red-600 text-red-600" : "text-red-600"
                                        }`}
                                />
                            </button>
                        ))}
                        <input type="hidden" name="hardLevel" value={rating} />
                    </div>
                </div>

                {/* For jobs Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">For jobs</label>
                    <input
                        type="text"
                        name="forJobs"
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                    />
                </div>

                {/* How to prepare Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">How to prepare for test ?</label>
                    <textarea
                        name="prepare"
                        className="w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                {/* Pros Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Pros.</label>
                    <textarea
                        name="pros"
                        className="w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                {/* Cons Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Cons.</label>
                    <textarea
                        name="cons"
                        className="w-full h-24 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                <p className="text-[#FCFC00] text-[14px] pt-4">
                    Caution! : Please recheck your review before submit
                </p>

                {/* Buttons */}
                <div className="flex justify-between pt-8">
                    <NavLink to="/review/subjectreview">
                        <button
                            type="button"
                            className="btn-cancel-review btn-cancel-review:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
                        >
                            Cancel
                        </button>
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        className="btn-submit-review btn-submit-review:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
                    >
                        Submit
                    </button>
                </div>

                {/* Re confirm Popup */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                        <div className="bg-[#0016D8]/90 w-full max-w-lg rounded-3xl p-12 text-center flex flex-col items-center gap-8 shadow-[0_0_20px_rgba(0,22,216,0.5)] border border-white/20">

                            <div className="space-y-6">
                                <h2 className="text-[#FCFC00] text-3xl tracking-wide">
                                    Caution !
                                </h2>

                                <p className="text-[#FCFC00] text-sm md:text-base leading-relaxed tracking-wider">
                                    Press confirm to send your review
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="bg-[#000B72] hover:bg-[#000B72]/80 text-white px-12 py-4 rounded-2xl text-sm transition-all transform hover:scale-105 border border-white/10 shadow-lg"
                            >
                                Submit
                            </button>
                        </div>
                        {/* Click outside to close (optional, but good UX) */}
                        <div
                            className="absolute inset-0 -z-10"
                            onClick={() => setShowConfirm(false)}
                        />
                    </div>
                )}


            </fetcher.Form>
        </div>
    );
}
