import { Navbar } from "~/component/Navbar";
import { ReviewRepositories } from "./repositories/ReviewRepositories";
import { useLoaderData } from "react-router";
import { JobsCard } from "~/component/JobsCard";  
import type { Review } from "./models/Review";
import { JobsSearchBar } from "~/component/JobsSearchBar";

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
        <JobsSearchBar />

        {/* Reviews List */}
        <div className="w-full pb-20">
          <JobsCard />
        </div>
      </div>
    </div>
  );
}
