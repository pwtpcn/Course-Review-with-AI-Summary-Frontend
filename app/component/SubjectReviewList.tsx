
interface Review {
    id: number;
    content: string;
    hardLevel: string;
    prepare: string;
    pros: string;
    cons: string;
}

interface SubjectReviewListProps {
    reviews: Review[];
}

export const SubjectReviewList = ({ reviews }: SubjectReviewListProps) => {
    return (
        <div className="w-full">
            <h2 className="text-[#FCFC00] text-sm md:text-base mb-6">All reviews :</h2>

            {reviews.map((review) => (
                <div key={review.id} className="w-full border-2 border-[#1BE1F3] p-6 text-[#FCFC00] text-[10px] md:text-xs leading-loose mb-6">
                    <div className="grid gap-4">
                        <div>Content : <span className="text-white">{review.content}</span></div>
                        <div>Hard level : <span className="text-white">{review.hardLevel}</span></div>
                        <div>How to prepare for test ? : <span className="text-white">{review.prepare}</span></div>
                        <div>Pros. : <span className="text-white">{review.pros}</span></div>
                        <div>Cons. : <span className="text-white">{review.cons}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
