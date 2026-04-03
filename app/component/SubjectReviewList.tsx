import type { Review } from "../routes/models/Review";
import { ReviewCard } from "./ReviewCard";

interface SubjectReviewListProps {
  reviews: Review[];
}

export const SubjectReviewList = ({ reviews }: SubjectReviewListProps) => {
  return (
    <div className="w-full">
      <h2 className="text-[#FCFC00] text-sm md:text-base mb-6">
        All reviews :
      </h2>

      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          data={review}
          hideHeader={true}
          containerClassName="w-full mb-6"
          cardClassName="w-full border-2 border-[#1BE1F3] p-6 bg-black text-[#FCFC00] text-xs md:text-sm lg:text-md leading-loose"
        />
      ))}
    </div>
  );
};
