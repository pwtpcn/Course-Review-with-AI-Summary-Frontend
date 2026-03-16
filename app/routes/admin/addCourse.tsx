import type { ActionFunction, LoaderFunctionArgs } from "react-router";
import { NavLink, useFetcher, useLoaderData, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { CourseRepositories } from "../repositories/CourseRepositories";
import { CautionPopup } from "~/component/CautionPopup";
import { requireAdmin, getAccessToken } from "../../lib/auth";
import type { Course, CreateCourse } from "../models/Course";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireAdmin(request);
    return null;
};

export const action: ActionFunction = async ({ request }) => {
    await requireAdmin(request);
    const accessToken = getAccessToken(request) || "";

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const nameTh = formData.get("nameTh") as string;
    const nameEn = formData.get("nameEn") as string;
    const description = formData.get("description") as string;
    const credits = Number(formData.get("credits"));
    const year = Number(formData.get("year"));
    const category = formData.get("category") as "Core" | "Elective";

    let errors: Record<string, string> = {};

    if (!id) errors.id = "Course ID is required";
    if (!nameTh) errors.nameTh = "Course Name (TH) is required";
    if (!nameEn) errors.nameEn = "Course Name (EN) is required";
    if (!description) errors.description = "Description is required";
    if (!credits) errors.credits = "Credits is required";
    if (!year) errors.year = "Year is required";
    if (!category) errors.category = "Category is required";

    if (Object.keys(errors).length > 0) {
        return {
            message: "Validation error",
            error: errors,
            data: null,
        };
    }

    const courseRepository = new CourseRepositories();
    const newCourse: CreateCourse = {
        id: id,
        nameTh: nameTh,
        nameEn: nameEn,
        description: description,
        credits: credits,
        year: year,
        category: category,
    };

    const createdCourse = await courseRepository.CreateCourse(newCourse, accessToken);

    if (!createdCourse) {
        return {
            message: "Failed to create course",
            error: { form: "Failed to create course. It might already exist." },
            data: null,
        };
    }

    return { message: "Course submitted", error: "", data: createdCourse };
};

export default function AddCourse() {
    const fetcher = useFetcher();
    const errors = fetcher.data?.error || {};

    const [showRecheckedConfirm, setShowRecheckedConfirm] = useState(false);
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [nameTh, setNameTh] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [description, setDescription] = useState("");
    const [credits, setCredits] = useState<number | "">("");
    const [year, setYear] = useState<number | "">("");
    const [category, setCategory] = useState<"Core" | "Elective">("Core");

    const isFormValid =
        id.length > 0 &&
        nameTh.length > 0 &&
        nameEn.length > 0 &&
        description.length > 0 &&
        credits !== "" &&
        year !== "";

    useEffect(() => {
        if (
            fetcher.state === "idle" &&
            fetcher.data?.message === "Course submitted"
        ) {
            navigate(`/admin/courseManage`, {
                state: { courseSubmitted: true },
            });
        }
    }, [fetcher.state, fetcher.data, navigate]);

    return (
        <div className="min-h-screen bg-black text-white font-['Press_Start_2P'] flex flex-col items-center py-12 px-4 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-[#FCFC00] text-xl md:text-3xl mb-4 ">
                    Add Course
                </h1>
            </div>

            <fetcher.Form method="post" className="w-full max-w-2xl space-y-8">
                {errors.form && (
                    <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl text-xs">
                        {errors.form}
                    </div>
                )}

                {/* Course ID Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Course ID</label>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                        placeholder="e.g. 01234567"
                        maxLength={10}
                    />
                    {errors.id && <p className="text-red-500 text-xs">{errors.id}</p>}
                </div>

                {/* Course Name (TH) Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Course Name (TH)</label>
                    <input
                        type="text"
                        name="nameTh"
                        value={nameTh}
                        onChange={(e) => setNameTh(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                    />
                    {errors.nameTh && <p className="text-red-500 text-xs">{errors.nameTh}</p>}
                </div>

                {/* Course Name (EN) Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Course Name (EN)</label>
                    <input
                        type="text"
                        name="nameEn"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                    />
                    {errors.nameEn && <p className="text-red-500 text-xs">{errors.nameEn}</p>}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-32 bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs leading-relaxed resize-none"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs">{errors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Credits Field */}
                    <div className="space-y-2">
                        <label className="text-white text-xs md:text-sm block">Credits</label>
                        <input
                            type="number"
                            name="credits"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value ? Number(e.target.value) : "")}
                            className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                            min={1}
                        />
                        {errors.credits && <p className="text-red-500 text-xs">{errors.credits}</p>}
                    </div>

                    {/* Year Field */}
                    <div className="space-y-2">
                        <label className="text-white text-xs md:text-sm block">Year</label>
                        <input
                            type="number"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                            className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-xs"
                            min={1}
                            max={6}
                        />
                        {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
                    </div>
                </div>

                {/* Category Field */}
                <div className="space-y-2">
                    <label className="text-white text-xs md:text-sm block">Category</label>
                    <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as "Core" | "Elective")}
                        className="w-full bg-black border-2 border-[#0016D8] rounded-xl p-4 text-white focus:outline-none focus:border-blue-400 text-xs appearance-none"
                    >
                        <option value="Core">Core</option>
                        <option value="Elective">Elective</option>
                    </select>
                    {errors.category && <p className="text-[#D80004] text-xs">{errors.category}</p>}
                </div>

                <p className="text-[#FCFC00] text-[14px] pt-4">
                    Caution! : Please recheck your course information before add!
                </p>

                {/* Buttons */}
                <div className="flex justify-between pt-8">
                    <NavLink to={`/admin/courseManage`}>
                        <button
                            type="button"
                            className="btn-cancel-add-data btn-cancel-add-data:hover text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase"
                        >
                            Cancel
                        </button>
                    </NavLink>

                    <button
                        type="button"
                        disabled={!isFormValid}
                        onClick={() => setShowRecheckedConfirm(true)}
                        className={`btn-auth-add-data text-white px-8 py-3 rounded-2xl text-xs transition-colors uppercase
                ${isFormValid
                                ? "btn-auth-add-data:hover"
                                : "opacity-50 cursor-not-allowed"
                            }`}
                    >
                        Add
                    </button>
                </div>

                {/* Re confirm Popup */}
                <CautionPopup
                    isOpen={showRecheckedConfirm}
                    onClose={() => setShowRecheckedConfirm(false)}
                    isSubmitting={fetcher.state !== "idle"}
                />
            </fetcher.Form>
        </div>
    );
}
