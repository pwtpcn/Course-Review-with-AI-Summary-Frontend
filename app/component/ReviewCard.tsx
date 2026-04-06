import { useState, useEffect } from "react";
import { NavLink, useFetcher, useRouteLoaderData } from "react-router";
import type { Review } from "~/routes/models/Review";
import type { User } from "~/routes/models/User";
import { ReportPopup } from "./ReportPopup";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export const ReviewCard = ({
  data,
  showManageActions = false,
  hideHeader = false,
  containerClassName = "w-full max-w-4xl mx-auto mb-8",
  cardClassName = "border-2 rounded-lg border-[#1BE1F3] p-6 bg-black text-[#FCFC00] min-h-[200px] text-xs md:text-sm lg:text-md leading-loose",
}: {
  data: Review;
  showManageActions?: boolean;
  hideHeader?: boolean;
  containerClassName?: string;
  cardClassName?: string;
}) => {
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
  const fetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const reactionFetcher = useFetcher();
  const rootData = useRouteLoaderData("root") as
    | { user: User | null }
    | undefined;
  const user = rootData?.user;

  // Check if current logged in user has already reported this review
  const hasReported =
    user && data.reports?.some((report) => report.userId === user.id);

  // Check the current logged in user's reaction
  const userReaction =
    user && data.reactions?.find((reaction) => reaction.userId === user.id)?.type;

  useEffect(() => {
    if (
      fetcher.data &&
      (fetcher.data as any).success &&
      fetcher.state === "idle"
    ) {
      alert("รายงานรีวิวเรียบร้อยแล้ว");
      setIsReportPopupOpen(false);
    } else if (
      fetcher.data &&
      (fetcher.data as any).error &&
      fetcher.state === "idle"
    ) {
      alert(`Error: ${(fetcher.data as any).error}`);
    }
  }, [fetcher.data, fetcher.state]);

  useEffect(() => {
    if (
      deleteFetcher.data &&
      (deleteFetcher.data as any).success &&
      deleteFetcher.state === "idle"
    ) {
      alert("ลบรีวิวเรียบร้อยแล้ว");
    } else if (
      deleteFetcher.data &&
      (deleteFetcher.data as any).error &&
      deleteFetcher.state === "idle"
    ) {
      alert(`Error: ${(deleteFetcher.data as any).error}`);
    }
  }, [deleteFetcher.data, deleteFetcher.state]);

  useEffect(() => {
    if (
      reactionFetcher.data &&
      (reactionFetcher.data as any).error &&
      reactionFetcher.state === "idle"
    ) {
      alert(`Error: ${(reactionFetcher.data as any).error}`);
    }
  }, [reactionFetcher.data, reactionFetcher.state]);

  const handleToggleReaction = (type: "like" | "dislike") => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการถูกใจหรือไม่ถูกใจรีวิว");
      return;
    }

    const formData = new FormData();
    formData.append("reviewId", data.id);
    formData.append("type", type);

    reactionFetcher.submit(formData, {
      method: "post",
      action: "/api/toggle-reaction",
    });
  };

  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className={containerClassName}>
      {!hideHeader && (
        <div
          className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm lg:text-md inline-block`}
        >
          {data.course?.id} | {data.course?.nameEn}
        </div>
      )}
      <div className={cardClassName}>
        <div className="grid gap-4">
          <div>
            Content :
            <span className="text-white font-chakra-petch">{data.content}</span>
          </div>
          <div>
            Hard level :
            <span className="text-white font-chakra-petch">{data.rating}</span>
          </div>
          <div>
            How to prepare for test ? :
            <span className="text-white font-chakra-petch">
              {data.testPrepare}
            </span>
          </div>
          <div>
            Pros. :
            <span className="text-white font-chakra-petch">{data.pros}</span>
          </div>
          <div>
            Cons. :
            <span className="text-white font-chakra-petch">{data.cons}</span>
          </div>
          <div>
            <span className="text-white font-chakra-petch">
              เขียนเมื่อวันที่ : {" "}
              {new Date(data.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center">
          <div className="flex items-center gap-2 mr-auto">
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleToggleReaction("like")}
            >
              <ThumbsUp strokeWidth={2} stroke={userReaction === "like" ? "#1f7535" : "white"} fill={userReaction === "like" ? "#1cb041" : "none"} />
              <span>{data.like}</span>
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
              onClick={() => handleToggleReaction("dislike")}
            >
              <ThumbsDown strokeWidth={2} stroke={userReaction === "dislike" ? "#891a1a" : "white"} fill={userReaction === "dislike" ? "#da4949" : "none"} />
              <span>{data.dislike}</span>
            </div>
          </div>
          {showManageActions ? (
            <div className="flex gap-4">
              {data.isEdited ? (
                <button
                  className="text-gray-500 text-xs md:text-sm flex items-center gap-1 cursor-not-allowed"
                  title="รีวิวนี้ถูกแก้ไขไปแล้ว (แก้ไขได้เพียงครั้งเดียว)"
                  disabled
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
                  </svg>
                  Edited
                </button>
              ) : (
                <NavLink to={`/review/editReview/${data.id}`}>
                  <button
                    className="text-[#1BE1F3] hover:text-cyan-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                    title="แก้ไขรีวิว"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
                    </svg>
                    Edit
                  </button>
                </NavLink>
              )}
              <button
                className="text-red-500 hover:text-red-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                onClick={() => {
                  if (
                    window.confirm(
                      "หากลบแล้วจะไม่สามารถกู้คืนข้อมูล คุณต้องการลบรีวิวนี้ใช่หรือไม่?",
                    )
                  ) {
                    const formData = new FormData();
                    formData.append("reviewId", data.id);
                    deleteFetcher.submit(formData, {
                      method: "post",
                      action: "/api/delete-review",
                    });
                  }
                }}
                disabled={deleteFetcher.state !== "idle"}
                title="ลบรีวิว"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
                Delete
              </button>
            </div>
          ) : user?.id !== data.userId ? (
            <>
              {hasReported ? (
                <button
                  className="text-gray-500 text-xs md:text-sm flex items-center gap-1 cursor-not-allowed"
                  disabled
                  title="คุณได้รายงานรีวิวนี้ไปแล้ว"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  Reported
                </button>
              ) : (
                <button
                  className="text-red-500 hover:text-red-400 text-xs md:text-sm flex items-center gap-1 transition-colors cursor-pointer"
                  onClick={() => setIsReportPopupOpen(true)}
                  title="รายงานรีวิวไม่เหมาะสม"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  Report
                </button>
              )}
              <ReportPopup
                isOpen={isReportPopupOpen}
                onClose={() => setIsReportPopupOpen(false)}
                onSubmit={(reason, content) => {
                  if (!user) {
                    alert("กรุณาเข้าสู่ระบบก่อนทำการรายงานรีวิว");
                    setIsReportPopupOpen(false);
                    return;
                  }

                  const formData = new FormData();
                  formData.append("reviewId", data.id);
                  formData.append("reason", reason);
                  formData.append("content", content);

                  fetcher.submit(formData, {
                    method: "post",
                    action: "/api/report-review",
                  });
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
