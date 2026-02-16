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
                        className="w-full h-32 bg-black border-2 border-[#001dae] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
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

                {/* How to prepare Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">How to prepare for test ?</label>
                    <textarea
                        name="prepare"
                        className="w-full h-24 bg-black border-2 border-[#001dae] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                {/* Pros Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Pros.</label>
                    <textarea
                        name="pros"
                        className="w-full h-24 bg-black border-2 border-[#001dae] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                {/* Cons Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Cons.</label>
                    <textarea
                        name="cons"
                        className="w-full h-24 bg-black border-2 border-[#001dae] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                </div>

                <p className="text-[#FCFC00] text-[10px] pt-4">
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
                        type="submit"
                        className="btn-submit-review btn-submit-review:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
                    >
                        Submit
                    </button>
                </div>

            </fetcher.Form>
        </div>
    );
}
