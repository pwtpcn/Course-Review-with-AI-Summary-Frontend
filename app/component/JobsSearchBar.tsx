import { Search } from "lucide-react";

interface JobsSearchBarProps {
    onSearch: (term: string) => void;
}

export const JobsSearchBar = ({ onSearch }: JobsSearchBarProps) => {
    return (
        <div className="w-full max-w-2xl mb-12 relative z-50">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                <input
                    type="text"
                    placeholder="Search jobs you are interested in..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full bg-[#000B72] border-2 border-[#000B72] rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400 text-xs md:text-sm font-['Press_Start_2P']"
                />
            </div>
        </div>
    );
};
