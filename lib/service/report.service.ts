import {
  CommentReportCreateDTO,
  ReportCreateDTO,
  ReportResponseDTO,
} from "@/dtos/reportDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function createReport(
  params: ReportCreateDTO,
  token: string
): Promise<ReportResponseDTO> {
  try {
    console.log(params, "param");
    console.log(`${BASE_URL}/report/create-report`, "param url");
    const response = await fetch(`${BASE_URL}/report/create-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data: ReportResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function createCommentReport(
  params: CommentReportCreateDTO,
  token: string
): Promise<ReportResponseDTO> {
  try {
    console.log(params, "param");
    console.log(`${BASE_URL}/report/create-report`, "param url");
    const response = await fetch(`${BASE_URL}/report/create-comment-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating media");
    }

    const data: ReportResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}
