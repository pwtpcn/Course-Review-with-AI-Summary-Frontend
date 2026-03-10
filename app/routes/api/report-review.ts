import type { ActionFunctionArgs } from "react-router";
import { ReportRepositories } from "../repositories/ReportRepositories";

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  let accessToken = "";

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, v.join("=")];
      }),
    );
    accessToken = cookies["access_token"] || "";
  }

  if (!accessToken) {
    return Response.json(
      { error: "Unauthorized. Please log in first." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const reviewId = formData.get("reviewId") as string;
  const reason = formData.get("reason") as string;
  const content = formData.get("content") as string;

  if (!reviewId || !reason) {
    return Response.json(
      { error: "Review ID and reason are required" },
      { status: 400 },
    );
  }

  const reportRepository = new ReportRepositories();
  try {
    const report = await reportRepository.CreateReport(
      reviewId,
      reason,
      content,
      accessToken,
    );
    return Response.json({ success: true, report });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create report" },
      { status: 500 },
    );
  }
};
