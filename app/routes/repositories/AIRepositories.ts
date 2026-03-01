import type { ReviewSummary } from "../models/Review";

export class AIRepositories {
  async GetAISummary(courseId: string): Promise<ReviewSummary | null> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${BACKEND_URL}/ai/reviews/${courseId}/summary-qdrant`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch AI summary:", response.statusText);
        return null;
      }

      const data = await response.json();
      return data.result as ReviewSummary;
    } catch (error) {
      console.error("Error fetching AI summary:", error);
      return null;
    }
  }
}
