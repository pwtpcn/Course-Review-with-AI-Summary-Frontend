import type { ActionFunctionArgs } from "react-router";
import { ReactionRepositories } from "../repositories/ReactionRepositories";
import { getAccessToken } from "~/lib/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return Response.json(
      { error: "Unauthorized. Please log in first." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const reviewId = formData.get("reviewId") as string;
  const type = formData.get("type") as "like" | "dislike";

  if (!reviewId || !type) {
    return Response.json(
      { error: "Review ID and type are required" },
      { status: 400 },
    );
  }

  const reactionRepository = new ReactionRepositories();
  try {
    const result = await reactionRepository.ToggleReaction(
      reviewId,
      type,
      accessToken,
    );
    return Response.json({ success: true, ...result });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to toggle reaction" },
      { status: 500 },
    );
  }
};
