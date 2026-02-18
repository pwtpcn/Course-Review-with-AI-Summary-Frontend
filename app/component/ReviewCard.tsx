import type { Review } from "~/routes/models/Review";

export const ReviewCard = ({ data }: { data: Review }) => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div
        className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm inline-block`}
      >
        {data.course?.id} | {data.course?.nameEn}
      </div>
      <div
        className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-[10px] md:text-xs leading-loose`}
      >
        <div className="grid gap-4">
          <div>
            Content :<span className="text-white">{data.content}</span>
          </div>
          <div>
            Hard level :<span className="text-white">{data.rating}</span>
          </div>
          <div>
            How to prepare for test ? :
            <span className="text-white">{data.testPrepare}</span>
          </div>
          <div>
            Pros. :<span className="text-white">{data.pros}</span>
          </div>
          <div>
            Cons. :<span className="text-white">{data.cons}</span>
          </div>
        </div>
      </div>
    </div>
  );
};