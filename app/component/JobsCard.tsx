import type { Review } from "~/routes/models/Review";

export const JobsCard = () => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div
        className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm lg:text-md inline-block`}
      >
        {/* {data.course?.id} | {data.course?.nameEn} */}
      </div>
      <div
        className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-xs md:text-sm lg:text-md leading-loose`}
      >
        <div className="grid gap-4">
          <div>
            What about the jobs :<span className="text-white font-chakra-petch"></span>
          </div>
          <div>
            What subjects you must learned :<span className="text-white font-chakra-petch"></span>
          </div>
        </div>
      </div>
    </div>
  );
};