import type { ReviewSummary } from "~/routes/models/Review";

interface AISummaryCardProps {
  aiSummary?: ReviewSummary | null;
}

export function AISummaryCard({ aiSummary }: AISummaryCardProps) {
  return (
    <>
      <div className="w-full">
        <h2 className="text-[#FCFC00] mb-6 md:text-base text-sm">
          Review Summarize by AI
        </h2>
      </div>
      <div className="w-full mb-12 border-3 border-[#001dae] p-4 relative">
        <div className="btn-ai-summarize-cards p-6 text-[#FCFC00] text-[10px] md:text-sm leading-loose">
          {aiSummary && aiSummary.rating !== 0 ? (
            <div className="grid gap-4">
              <div>
                Content :{" "}
                <span className="text-white">{aiSummary.content}</span>
              </div>
              <div>
                How to prepare for test ? :{" "}
                <span className="text-white">
                  {aiSummary.testPrepare?.length
                    ? aiSummary.testPrepare.join(", ")
                    : "-"}
                </span>
              </div>
              <div>
                Pros. :{" "}
                <span className="text-white">
                  {aiSummary.pros?.length ? aiSummary.pros.join(", ") : "-"}
                </span>
              </div>
              <div>
                Cons. :{" "}
                <span className="text-white">
                  {aiSummary.cons?.length ? aiSummary.cons.join(", ") : "-"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
              <div className="text-4xl md:text-5xl animate-bounce [animation-duration:3s]">
                🤖💤
              </div>
              <div className="text-[#FCFC00] md:text-base text-sm leading-relaxed max-w-md">
                AI สมองตื้อ! <br />
                ยังรวบรวมข้อมูลของวิชานี้ไม่ได้เลย... <br />
                <span className="text-white text-[10px] md:text-xs block mt-4">
                  (ช่วยเราป้อนข้อมูลด้วยการรีวิววิชานี้เป็นคนแรกหน่อยนะ!)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
