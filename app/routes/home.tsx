import { Navbar } from "../component/Navbar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Course Review" },
    { name: "description", content: "Welcome to Course Review!" },
  ];
}

// Subject Card Component with Neon Borders
const SubjectCard = () => {
  const borderStyle = "border-[#1BE1F3] shadow-[0_0_2px_#1BE1F3]";

  return (
    <div className={`h-auto min-h-24 sm:min-h-32 md:min-h-48 w-full border ${borderStyle} bg-black p-2 md:p-4 text-[#FCFC00] text-[6px] sm:text-[8px] md:text-xs rounded opacity-80 flex flex-col gap-1 md:gap-2 overflow-hidden`}>
      <p className="truncate">Subject : </p>
      <p className="truncate">Content : </p>
      <p className="truncate">Hard level : </p>
      <p className="truncate flex-1">How to prepare : </p>
      <p className="truncate">For jobs : </p>
      <p className="truncate text-green-400">Pros. : </p>
      <p className="truncate text-red-500">Cons. : </p>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative overflow-hidden flex flex-col">

      <div className="relative" style={{ zIndex: 200 }}>
        <Navbar />
      </div>

      {/* Grid Content Background */}
      <div className="absolute inset-0 mt-20 p-2 sm:p-4 md:p-8 overflow-hidden z-10 opacity-30 md:opacity-50 blur-[1px] md:blur-[2px] pointer-events-none select-none flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-7xl mx-auto h-full max-h-[800px]">
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
          <SubjectCard />
        </div>
      </div>

      {/* Hero Modal Overlay */}
      <div className="flex-1 relative z-30 flex items-center justify-center p-4">
        <div className="relative bg-[#0016D8]/40 backdrop-blur-md border border-blue-500/30 p-6 sm:p-10 md:p-16 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.3)] max-w-4xl w-full text-center flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">

          <h1 className="text-[#FCFC00] text-lg sm:text-3xl md:text-5xl mb-4 md:mb-8 leading-snug">
            Hello World,
          </h1>

          <p className="text-[#FCFC00] text-xs sm:text-lg md:text-2xl tracking-wider px-2">
            Welcome to Comsci Subject review community
          </p>

        </div>
      </div>

    </div>
  );
}
