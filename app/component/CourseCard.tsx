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
    <Link to={`/review/subjectReview/${course.id}`}>
      <div
        onClick={onClick}
        className={`cursor-pointer bg-[#0010A5] rounded-xl p-4 sm:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[250px] min-w-[250px] sm:min-w-[350px] relative w-full border transition-all duration-300 ${
          isActive
            ? "border-[#FCFC00] shadow-[0_0_15px_#FCFC00] scale-[1.02]"
            : "border-blue-500/30 hover:border-blue-400"
        }`}
      >
        <div>
          <h3 className="text-[#FCFC00] text-sm sm:text-base leading-normal mb-4 h-[7.5rem] sm:h-[8.5rem] line-clamp-4 overflow-hidden text-ellipsis">
            {course.id} | {course.nameEn || course.nameTh}
          </h3>
          <p className="text-[#FCFC00] text-xs sm:text-sm">
            Credit : {course.credits}
          </p>
        </div>
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <span className="text-[#FCFC00] text-xs sm:text-sm">
            rating{" "}
            {course.rating !== undefined && course.rating !== 0
              ? course.rating.toFixed(1)
              : "-"}
            /5
          </span>
          <span className="text-[#B91313] text-lg">♥</span>
        </div>
      </div>
    </Link>
  );
};
