import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Review" },
    { name: "description", content: "Welcome to Course Review!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-[#000000] w-screen h-screen flex flex-col justify-center items-center p-6 overflow-auto">
      <div className="text-[#FCFC00] text-[64px] font-normal">
        This is Homepage
      </div>
    </div>
  );
}
