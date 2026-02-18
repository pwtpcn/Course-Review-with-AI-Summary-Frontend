import { Navbar } from "~/component/Navbar";
import { Search } from "lucide-react";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { useLoaderData } from "react-router";
import { ReviewCard } from "~/component/ReviewCard";
import type { Review } from "../models/Review";

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
        <div className="w-full max-w-2xl mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <input
              type="text"
              placeholder="Search subject"
              className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full pb-20">
          {reviews &&
            reviews.map((review: Review) => (
              <ReviewCard key={review.id} data={review} />
            ))}
        </div>
      </div>
    </div>
  );
}
