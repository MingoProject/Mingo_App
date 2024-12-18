import { CommentResponseDTO } from "@/dtos/CommentDTO";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { PostCreateDTO, PostResponseDTO } from "@/dtos/PostDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function fetchPosts() {
  try {
    const response = await fetch(`${BASE_URL}/post/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getCommentsByPostId(
  postId: String
): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-comments?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching comments by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch comments by postId:", error);
    throw error;
  }
}

export async function getAuthorByPostId(
  postId: String
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-author?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching author by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch author by postId:", error);
    throw error;
  }
}

export async function createPost(
  params: PostCreateDTO,
  token: string
): Promise<PostResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/post/create-post`, {
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

    const data: PostResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function editPost(
  params: PostCreateDTO,
  postId: string,
  token: string
): Promise<PostResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/post/update?postId=${postId}`, {
      method: "PATCH",
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

    const data: PostResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
}

export async function getMediasByPostId(
  postId: String
): Promise<MediaResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/post/get-medias?postId=${postId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching medias by postId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch medias by postId:", error);
    throw error;
  }
}

export async function likePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(`${BASE_URL}/post/like?postId=${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error like post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like post:", error);
    throw error;
  }
}

export async function dislikePost(postId: string, token: string) {
  try {
    if (!postId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(`${BASE_URL}/post/dislike?postId=${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error dislike post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to dislike post:", error);
    throw error;
  }
}

export async function getLikesByPostId(postId: String) {
  try {
    const response = await fetch(`${BASE_URL}/post/get-likes?postId=${postId}`);
    if (!response.ok) {
      throw new Error("Error fetching likes by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch likes by postId:", error);
    throw error;
  }
}

export async function deletePost(postId: string, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/post/delete?postId=${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting post");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
}

export async function getTagsByPostId(
  postId: String
): Promise<UserResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/post/get-tags?postId=${postId}`);
    if (!response.ok) {
      throw new Error("Error fetching tags by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch tags by postId:", error);
    throw error;
  }
}

export async function getPostByPostId(postId: String) {
  try {
    const response = await fetch(`${BASE_URL}/post/get-post?postId=${postId}`);
    if (!response.ok) {
      throw new Error("Error fetching post by postId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch post by postId:", error);
    throw error;
  }
}
