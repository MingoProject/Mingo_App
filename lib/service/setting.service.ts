import { PostResponseDTO, PostYouLikeDTO } from "@/dtos/PostDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getPostsLikedByUser(
  userId: string
): Promise<PostYouLikeDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-list-like?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching posts liked by user");
    }
    const data = await response.json();
    // console.log(data); // Debug nếu cần kiểm tra dữ liệu trả về
    return data;
  } catch (error) {
    console.error("Failed to fetch posts liked by user:", error);
    throw error;
  }
}

export async function getPostsSavedByUser(
  userId: string
): Promise<PostYouLikeDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-list-save?userId=${userId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching posts save by user");
    }
    const data = await response.json();
    // console.log(data); // Debug nếu cần kiểm tra dữ liệu trả về
    return data;
  } catch (error) {
    console.error("Failed to fetch posts save by user:", error);
    throw error;
  }
}
