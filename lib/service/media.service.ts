import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createMedia(file: File, caption: string, token: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    const response = await fetch(`${BASE_URL}/media/create-media`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Upload error:", error.message);
    throw error;
  }
}

export async function getCommentsByMediaId(
  mediaId: String
): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/media/get-comments?mediaId=${mediaId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching comments by mediaId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch comments by mediaId:", error);
    throw error;
  }
}

export async function getAuthorByMediaId(
  mediaId: String
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/media/get-author?mediaId=${mediaId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching author by mediaId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch author by mediaId:", error);
    throw error;
  }
}

export async function likeMedia(mediaId: string, token: string) {
  try {
    if (!mediaId || !token) {
      throw new Error("media ID and token are required");
    }

    const response = await fetch(`${BASE_URL}/media/like?mediaId=${mediaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error like media");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like media:", error);
    throw error;
  }
}

export async function dislikeMedia(mediaId: string, token: string) {
  try {
    if (!mediaId || !token) {
      throw new Error("Media ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/media/dislike?mediaId=${mediaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error liking media");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like media:", error);
    throw error;
  }
}

export async function getLikesByMediaId(
  mediaId: String
): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/media/get-likes?mediaId=${mediaId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching likes by mediaId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch likes by mediaId:", error);
    throw error;
  }
}
