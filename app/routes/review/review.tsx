import { Navbar } from "~/component/Navbar";
import { Search } from "lucide-react";

interface ReviewData {
  id: string;
  code: string;
  name: string;
  color: "green" | "red";
  content: string;
  hardLevel: string;
  prepare: string;
  pros: string;
  cons: string;
}

const mockReviews: ReviewData[] = [
  {
    id: "1",
    code: "01418490",
    name: "Cooperative Education",
    color: "green",
    content: "",
    hardLevel: "",
    prepare: "",
    pros: "",
    cons: "",
  },
  {
    id: "2",
    code: "01418472",
    name: "Project Management and Digital Startup",
    color: "red",
    content: "",
    hardLevel: "",
    prepare: "",
    pros: "",
    cons: "",
  },
  {
    id: "3",
    code: "01418332",
    name: "Information System Security",
    color: "green",
    content: "",
    hardLevel: "",
    prepare: "",
    pros: "",
    cons: "",
  },
];

const ReviewCard = ({ data }: { data: ReviewData }) => {
  const borderColor = "border-[#1BE1F3]";
  const headerBg = "bg-[#1BE1F3]";
  const textColor = "text-black";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 ">
      <div className={`${headerBg} ${textColor} px-4 py-2 text-xs md:text-sm inline-block`}>
        {data.code} | {data.name}
      </div>
      <div className={`border-2 ${borderColor} p-6 bg-black text-[#FCFC00] min-h-[200px] text-[10px] md:text-xs leading-loose`}>
        <div className="grid gap-4">
          <div>Content :
            <span className="text-white">
              {data.content}
            </span>
          </div>
          <div>Hard level :
            <span className="text-white">
              {data.hardLevel}
            </span>
          </div>
          <div>How to prepare for test ? :
            <span className="text-white">
              {data.prepare}
            </span>
          </div>
          <div>Pros. :
            <span className="text-white">
              {data.pros}
            </span>
          </div>
          <div>Cons. :
            <span className="text-white">
              {data.cons}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Review() {
  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 py-8 flex flex-col items-center">
        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <input
              type="text"
              placeholder="Search subject"
              className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full pb-20">
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} data={review} />
          ))}
        </div>
      </div>
    </div>
  );
}