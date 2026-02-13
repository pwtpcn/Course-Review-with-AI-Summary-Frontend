import { Navbar } from "../component/Navbar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Course Review" },
    { name: "description", content: "Welcome to Course Review!" },
  ];
}

// Subject Card Component with Neon Borders
const SubjectCard = ({ color = "green" }: { color?: "red" | "green" }) => {
  const borderStyles = {
    green: "border-[#33E331] shadow-[0_0_2px_#33E331]",
    red: "border-[#D80004] shadow-[0_0_2px_#D80004]"
  };

  return (
    <div className={`h-auto min-h-48 w-full border ${borderStyles[color]} bg-black p-4 text-[#FCFC00] text-xs rounded opacity-80 hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2`}>
      <p>Subject : </p>
      <p>Content : </p>
      <p>Hard level : </p>
      <p>How to prepare : </p>
      <p>For jobs : </p>
      <p>Pros. : </p>
      <p>Cons. : </p>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] relative overflow-hidden flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Grid Content Background */}
      <div className="flex-1 p-4 md:p-8 overflow-hidden z-10 opacity-50 blur-[1px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-full">
          {/* Static grid for background effect as per design */}
          <SubjectCard color="green" />
          <SubjectCard color="red" />
          <SubjectCard color="green" />
          <SubjectCard color="red" />
          <SubjectCard color="green" />
          <SubjectCard color="red" />
          <SubjectCard color="green" />
          <SubjectCard color="red" />
          <SubjectCard color="green" />
        </div>
      </div>

      {/* Hero Modal Overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        {/* Backdrop Blur Container */}
        <div className="relative bg-[#0016D8]/40 backdrop-blur-md border border-blue-500/30 p-8 md:p-16 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.3)] max-w-4xl w-full text-center flex flex-col items-center justify-center min-h-[400px]">

          <h1 className="text-[#FCFC00] text-2xl md:text-5xl mb-8 leading-snug ]">
            Hello World,
          </h1>

          <p className="text-[#FCFC00] text-lg md:text-2xl  tracking-wider">
            Welcome to Comsci Subject review community
          </p>

        </div>
      </div>

    </div>
  );
}
