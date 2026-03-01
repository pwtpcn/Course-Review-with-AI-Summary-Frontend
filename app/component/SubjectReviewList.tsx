import type { Review } from "../routes/models/Review";

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
        <div
          key={review.id}
          className="w-full border-2 border-[#1BE1F3] p-6 text-[#FCFC00] text-xs md:text-sm lg:text-md leading-loose mb-6"
        >
          <div className="grid gap-4">
            <div>
              Content : <span className="text-white font-chakra-petch">{review.content}</span>
            </div>
            <div>
              Hard level : <span className="text-white font-chakra-petch">{review.rating}</span>
            </div>
            <div>
              How to prepare for test ? :{" "}
              <span className="text-white font-chakra-petch">{review.testPrepare}</span>
            </div>
            <div>
              Pros. : <span className="text-white font-chakra-petch">{review.pros}</span>
            </div>
            {review.cons && (
              <div>
                Cons. : <span className="text-white font-chakra-petch">{review.cons}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
