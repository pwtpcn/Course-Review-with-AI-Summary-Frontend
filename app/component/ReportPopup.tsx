import React, { useState } from "react";

interface ReportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, content: string) => void;
  title?: string;
  message?: string;
}

export const ReportPopup: React.FC<ReportPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Report Review",
  message = "Please select a reason for reporting this review.",
}) => {
  const [reason, setReason] = useState<
    "spam" | "inappropriate" | "irrelevant" | "other" | ""
  >("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert("Please select a reason");
      return;
    }
    onSubmit(reason, content);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-[#0016D8]/90 w-full max-w-lg rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-8 shadow-[0_0_20px_rgba(0,22,216,0.5)] border border-white/20">
        <div className="space-y-4 w-full">
          <h2 className="text-[#FCFC00] text-3xl tracking-wide">{title}</h2>
          <p className="text-[#FCFC00] text-sm md:text-base leading-relaxed tracking-wider">
            {message}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 text-left"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[#FCFC00] text-sm tracking-wider">
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value as any);
                if (e.target.value !== "other") {
                  setContent("");
                }
              }}
              className="w-full bg-black/40 border border-white/20 text-white rounded-xl p-3 focus:outline-none focus:border-[#FCFC00] transition-colors"
              required
            >
              <option value="" disabled>
                Select a reason...
              </option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="irrelevant">Irrelevant</option>
              <option value="other">Other</option>
            </select>
          </div>

          {reason === "other" && (
            <div className="flex flex-col gap-2">
              <label className="text-[#FCFC00] text-sm tracking-wider">
                Additional details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black/40 border border-white/20 text-white rounded-xl p-3 focus:outline-none focus:border-[#FCFC00] min-h-[100px] resize-none transition-colors"
                placeholder="Please specify..."
                maxLength={500}
                required
              />
            </div>
          )}

          <div className="flex gap-4 justify-center mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-white/10 text-white px-8 py-3 rounded-2xl text-sm transition-all border border-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#000B72] hover:bg-[#000B72]/80 text-white px-8 py-3 rounded-2xl text-sm transition-all transform hover:scale-105 border border-white/10 shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
