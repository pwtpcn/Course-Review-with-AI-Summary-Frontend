import { Navbar } from "~/component/Navbar";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { useLoaderData } from "react-router";
import { ReviewCard } from "~/component/ReviewCard";
import type { Review } from "../models/Review";
import { CourseSearchBar } from "~/component/CourseSearchBar";

export const loader = async () => {
    const reviewRepository = new ReviewRepositories();
    const reviews = await reviewRepository.GetAllReviews("newest");
    return { reviews };
};

export default function ReviewPage() {
    const { reviews } = useLoaderData<typeof loader>();

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
            <Navbar />

            <div className="flex-1 px-4 py-8 flex flex-col items-center">
                {/* Search Bar */}
                <CourseSearchBar />

                <div className="w-full max-w-4xl mx-auto mt-12 mb-6">
                    <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
                        Manage your Reviews
                    </h2>
                </div>

                {/* Reviews List */}
                <div className="w-full pb-20 mt-4">
                    {reviews &&
                        reviews.map((review: Review) => (
                            <ReviewCard key={review.id} data={review} showManageActions={true} />
                        ))}
                </div>
            </div>
        </div>
    );
}
