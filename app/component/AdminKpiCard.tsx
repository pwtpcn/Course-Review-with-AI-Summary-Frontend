import { NavLink } from "react-router";
import { ArrowRight } from "lucide-react";

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  link?: string;
  containerClasses: string;
  blurClasses: string;
  titleClasses: string;
  valueClasses: string;
}

export function AdminKpiCard({
  title,
  value,
  link,
  containerClasses,
  blurClasses,
  titleClasses,
  valueClasses,
}: AdminKpiCardProps) {
  const innerContent = (
    <>
      <div className={`absolute top-0 right-0 rounded-full blur-2xl transition-opacity ${blurClasses}`}></div>
      <h3 className={`text-[10px] md:text-xs mb-2 flex items-center justify-between ${titleClasses}`}>
        {title}
        {link && (
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </h3>
      <p className={`text-3xl md:text-4xl font-chakra-petch ${valueClasses}`}>
        {value}
      </p>
    </>
  );

  if (link) {
    return (
      <NavLink
        to={link}
        className={`bg-black rounded-2xl p-6 relative overflow-hidden group transition-colors block ${containerClasses}`}
      >
        {innerContent}
      </NavLink>
    );
  }

  return (
    <div className={`bg-[#0A0A0A] rounded-2xl p-6 relative overflow-hidden group transition-colors ${containerClasses}`}>
      {innerContent}
    </div>
  );
}
