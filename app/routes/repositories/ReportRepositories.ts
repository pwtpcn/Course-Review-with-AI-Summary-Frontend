import type { Report, ReportFilter } from "../models/Report";

export class ReportRepositories {
  public async GetAllReports(
    filter?: ReportFilter,
  ): Promise<Report[] | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    const queryParams = new URLSearchParams();

    if (filter?.sortBy) queryParams.append("sortBy", filter.sortBy);
    if (filter?.status) queryParams.append("status", filter.status);
    if (filter?.reason) queryParams.append("reason", filter.reason);
    if (filter?.search) queryParams.append("search", filter.search);

    try {
      const res = await fetch(
        `${BACKEND_URL}/reports/getall?${queryParams.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await res.json();
      return data.reports;
    } catch (e) {
      console.error("Failed to fetch reports:", e);
      return null;
    }
  }

  public async CreateReport(
    reviewId: string,
    reason: string,
    content: string,
    accessToken: string,
  ): Promise<Report | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/reports/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId, reason, content }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create report");
      }
      const data = await res.json();
      return data.report;
    } catch (e) {
      console.error("Failed to create report:", e);
      throw e;
    }
  }

  public async ApproveReport(
    id: string,
    accessToken: string,
  ): Promise<Report | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/reports/approve/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to approve report");
      }
      const data = await res.json();
      return data.report;
    } catch (e) {
      console.error("Failed to approve report:", e);
      throw e;
    }
  }

  public async CancelReport(
    id: string,
    accessToken: string,
  ): Promise<Report | null> {
    const BACKEND_URL = process.env.BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND_URL}/reports/cancel/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to cancel report");
      }
      const data = await res.json();
      return data.report;
    } catch (e) {
      console.error("Failed to cancel report:", e);
      throw e;
    }
  }
}
