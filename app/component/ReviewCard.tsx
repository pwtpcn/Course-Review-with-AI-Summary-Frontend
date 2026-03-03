import type { Review } from "~/routes/models/Review";

export const ReviewCard = ({ data }: { data: Review }) => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div
        className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm lg:text-md inline-block`}
      >
        {data.course?.id} | {data.course?.nameEn}
      </div>
      <div
        className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-xs md:text-sm lg:text-md leading-loose`}
      >
        <div className="grid gap-4">
          <div>
            Content :<span className="text-white font-chakra-petch">{data.content}</span>
          </div>
          <div>
            Hard level :<span className="text-white font-chakra-petch">{data.rating}</span>
          </div>
          <div>
            How to prepare for test ? :
            <span className="text-white font-chakra-petch">{data.testPrepare}</span>
          </div>
          <div>
            Pros. :<span className="text-white font-chakra-petch">{data.pros}</span>
          </div>
          <div>
            Cons. :<span className="text-white font-chakra-petch">{data.cons}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="text-red-500 hover:text-red-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
            onClick={() => {
              if (window.confirm("คุณต้องการรายงานรีวิวนี้ว่าไม่เหมาะสมใช่หรือไม่?")) {
                alert("รายงานรีวิวเรียบร้อยแล้ว");
              }
            }}
            title="รายงานรีวิวไม่เหมาะสม"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            Report
          </button>
        </div>
      </div>
    </div>
  );
};