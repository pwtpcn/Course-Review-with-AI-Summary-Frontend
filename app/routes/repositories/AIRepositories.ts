import type { ReviewSummary } from "../models/Review";

export class AIRepositories {
  async GetAISummary(courseId: string): Promise<ReviewSummary | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/ai/reviews/${courseId}/summary-qdrant`,
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
