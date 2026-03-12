import { Navbar } from "~/component/Navbar";
import { ReviewRepositories } from "../repositories/ReviewRepositories";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { ReviewCard } from "~/component/ReviewCard";
import type { Review } from "../models/Review";
import { CourseSearchBar } from "~/component/CourseSearchBar";
import { UserRepository } from "../repositories/UserRepositories";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  let accessToken = "";
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    accessToken = cookies["access_token"];
  }

  if (!accessToken) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const user = await UserRepository.getUser(accessToken);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const reviewRepository = new ReviewRepositories();
  const reviews = await reviewRepository.GetReviewByUserId(user.id, "newest");
  return { reviews };
};

export default function ReviewPage() {
  const { reviews } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        {/* Search Bar */}
        {/* <CourseSearchBar /> */}

        <div className="w-full max-w-4xl mx-auto mt-12 mb-6">
          <h2 className="text-xl md:text-2xl text-[#FCFC00] border-b-2 border-[#1BE1F3] inline-block pb-2">
            Manage your Reviews
          </h2>
        </div>

        {/* Reviews List */}
        <div className="w-full pb-20 mt-4 flex flex-col items-center">
          {reviews && reviews.length > 0 ? (
            reviews.map((review: Review) => (
              <ReviewCard
                key={review.id}
                data={review}
                showManageActions={true}
              />
            ))
          ) : (
            <div className="w-full max-w-4xl border-2 border-[#1BE1F3] p-10 flex flex-col items-center justify-center text-center mt-6 bg-black">
              <div className="text-[#FCFC00] text-lg md:text-xl mb-6">
                NO REVIEWS YET
              </div>
              <div className="text-white text-xs md:text-sm leading-loose">
                You have not written any reviews yet.
                <br />
                <span className="text-gray-400 mt-2 inline-block">
                  Share your course experiences to help others!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
