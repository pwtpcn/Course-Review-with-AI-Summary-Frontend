import { Heart } from "lucide-react";
import { Link } from "react-router";
import type { Course } from "~/routes/models/Course";

export const CourseCard = ({
  course,
  isActive,
  onClick,
}: {
  course: Course;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link to={`/review/subjectReview/${course.id}`} className="block h-full">
      <div
        onClick={onClick}
        className={`cursor-pointer bg-[#0010A5] rounded-xl p-4 sm:p-5 flex flex-col justify-between h-full relative w-full border transition-all duration-300 min-h-[160px] sm:min-h-[200px] ${
          isActive
            ? "border-[#FCFC00] shadow-[0_0_15px_#FCFC00] scale-[1.02]"
            : "border-blue-500/30 hover:border-blue-400 hover:scale-[1.02]"
        }`}
      >
        <div className="flex flex-col grow mb-3 sm:mb-4">
          <h3 className="text-[#FCFC00] text-sm sm:text-base leading-snug mb-3 line-clamp-3 sm:line-clamp-4 overflow-hidden text-ellipsis">
            {course.id} | {course.nameEn || course.nameTh}
          </h3>
          <p className="text-[#FCFC00] text-xs sm:text-sm mt-auto opacity-80">
            Credit : {course.credits}
          </p>
        </div>
        <div className="flex justify-end items-center gap-2 mt-auto shrink-0">
          <span className="text-[#FCFC00] text-xs sm:text-sm opacity-90">
            Hard Level{" "}
            {course.rating !== undefined && course.rating !== 0
              ? course.rating.toFixed(1)
              : "-"}
            /5
          </span>
          <Heart className="text-[#B91313] text-base w-4 sm:w-5 h-4 sm:h-5 shrink-0" fill="#B91313" />
        </div>
      </div>
    </Link>
  );
};
