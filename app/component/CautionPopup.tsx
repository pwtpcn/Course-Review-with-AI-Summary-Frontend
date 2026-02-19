import React from "react";

interface CautionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  title?: string;
  message?: string;
}

export const CautionPopup: React.FC<CautionPopupProps> = ({
  isOpen,
  onClose,
  isSubmitting,
  title = "Caution !",
  message = "Press confirm to send your review",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-[#0016D8]/90 w-full max-w-lg rounded-3xl p-12 text-center flex flex-col items-center gap-8 shadow-[0_0_20px_rgba(0,22,216,0.5)] border border-white/20">
        <div className="space-y-6">
          <h2 className="text-[#FCFC00] text-3xl tracking-wide">{title}</h2>

          <p className="text-[#FCFC00] text-sm md:text-base leading-relaxed tracking-wider">
            {message}
          </p>
        </div>

        <button
          type="submit"
          className="bg-[#000B72] hover:bg-[#000B72]/80 text-white px-12 py-4 rounded-2xl text-sm transition-all transform hover:scale-105 border border-white/10 shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      {/* Click outside to close (optional, but good UX) */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
