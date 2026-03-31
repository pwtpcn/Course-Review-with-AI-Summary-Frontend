import type { ReviewSummary } from "~/routes/models/Review";
import { ratingLabels } from "~/routes/models/Rating-lable";

interface AISummaryCardProps {
  aiSummary?: ReviewSummary | null;
  rating: number;
}

export function AISummaryCard({ aiSummary, rating }: AISummaryCardProps) {
  console.log("AI Summary : ", aiSummary);
  return (
    <>
      <div className="w-full">
        <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">
          Review Summarize by AI
        </h2>
      </div>
      <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
        <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-sm sm:text-sm md:text-md lg:text-lg leading-loose font-chakra-petch ">
          {aiSummary && rating !== 0 ? (
            <div className="grid gap-4">
              <div>
                <span className="font-['Press_Start_2P']">Content :</span>{" "}
                <span className="text-white">{aiSummary.content}</span>
              </div>
              <div>
                <span className="font-['Press_Start_2P']">Hard Level :</span>{" "}
                <span className="text-white">
                  {rating.toFixed(1)} ({ratingLabels[Math.round(rating)] || "-"})
                </span>
              </div>
              <div>
                <span className="font-['Press_Start_2P']">
                  How to prepare for test ? :
                </span>{" "}
                <span className="text-white">
                  {aiSummary.testPrepare?.length
                    ? aiSummary.testPrepare.join(", ")
                    : "-"}
                </span>
              </div>
              <div>
                <span className="font-['Press_Start_2P']">Pros. :</span>{" "}
                <span className="text-white">
                  {aiSummary.pros?.length ? aiSummary.pros.join(", ") : "-"}
                </span>
              </div>
              <div>
                <span className="font-['Press_Start_2P']">Cons. :</span>{" "}
                <span className="text-white">
                  {aiSummary.cons?.length ? aiSummary.cons.join(", ") : "-"}
                </span>
              </div>
              {aiSummary.note && (
                <div>
                  <span className="font-['Press_Start_2P']">Note :</span>{" "}
                  <span className="text-white">{aiSummary.note}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
              <div className="text-4xl md:text-5xl animate-bounce [animation-duration:3s]">
                🤖💤
              </div>
              <div>
                AI สมองตื้อ! <br />
                ยังรวบรวมข้อมูลของวิชานี้ไม่ได้เลย... <br />
                <span className="text-white">
                  (ช่วยเราป้อนข้อมูลด้วยการรีวิววิชานี้หน่อยนะ!)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function AISummaryCardSkeleton() {
  return (
    <>
      <div className="w-full">
        <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">
          Review Summarize by AI
        </h2>
      </div>
      <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
        <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-sm sm:text-sm md:text-md lg:text-lg leading-loose font-chakra-petch ">
          <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
            <div className="text-4xl md:text-5xl animate-bounce [animation-duration:3s]">
              ⏳🤖
            </div>
            <div>
              AI กำลังประมวลผลสรุปรวบยอดจากรีวิวทั้งหมด... <br />
              <span className="text-white text-xs lg:text-sm mt-3 inline-block">
                (อาจใช้เวลาสักครู่นะ รอแป๊บ!)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
