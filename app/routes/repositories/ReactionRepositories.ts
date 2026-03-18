export class ReactionRepositories {
  async ToggleReaction(
    reviewId: string,
    type: "like" | "dislike",
    accessToken: string,
  ) {
    const BACKEND_URL = process.env.BACKEND_URL;
    const response = await fetch(`${BACKEND_URL}/reaction/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ reviewId, type }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to toggle reaction");
    }

    return await response.json();
  }
}
