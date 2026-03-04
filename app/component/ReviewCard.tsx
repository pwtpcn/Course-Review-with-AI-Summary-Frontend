import { NavLink } from "react-router";
import type { Review } from "~/routes/models/Review";

export const ReviewCard = ({ data, showManageActions = false }: { data: Review; showManageActions?: boolean }) => {
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
          {showManageActions ? (
            <div className="flex gap-4">
              <NavLink to={`/review/editReview/${data.course?.id}`}>
                <button
                  className="text-[#1BE1F3] hover:text-cyan-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                  title="แก้ไขรีวิว"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" /></svg>
                  Edit
                </button>
              </NavLink>
              <button
                className="text-red-500 hover:text-red-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                onClick={() => {
                  if (window.confirm("คุณต้องการลบรีวิวนี้ใช่หรือไม่?")) {
                    alert("ลบรีวิวเรียบร้อยแล้ว");
                  }
                }}
                title="ลบรีวิว"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                Delete
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};