import {
  CommentResponseDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "@/dtos/CommentDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchComments(): Promise<CommentResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/comment/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function createComment(
  params: CreateCommentDTO,
  token: string,
  postId: string
): Promise<CommentResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/create-comment?postId=${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating comment");
    }

    const data: CommentResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
}

export async function createReplyComment(
  params: CreateCommentDTO,
  token: string
): Promise<CommentResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/comment/create-reply-comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating comment");
    }

    const data: CommentResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
}

export async function getAuthorByCommentId(
  commentId: String
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-author?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching author by commentId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch author by commentId:", error);
    throw error;
  }
}

export async function updateComment(
  params: UpdateCommentDTO,
  commentId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/update?commentId=${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error updating comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
}

export async function addReplyToComment(
  commentId: string,
  replyId: string,
  token: string
) {
  try {
    const response = await fetch(`${BASE_URL}/comment/add-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ commentId, replyId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error reply comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to reply comment:", error);
    throw error;
  }
}

export async function deleteComment(
  commentId: string,
  postId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/delete?commentId=${commentId}&postId=${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
}

export async function likeComment(commentId: string, token: string) {
  try {
    if (!commentId || !token) {
      throw new Error("comment ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/comment/like?commentId=${commentId}`,
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
      throw new Error(errorData.message || "Error liking comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like comment:", error);
    throw error;
  }
}

export async function dislikeComment(commentId: string, token: string) {
  try {
    if (!commentId || !token) {
      throw new Error("Post ID and token are required");
    }

    const response = await fetch(
      `${BASE_URL}/comment/dislike?commentId=${commentId}`,
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
      throw new Error(errorData.message || "Error like comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to like comment:", error);
    throw error;
  }
}

export async function getLikesByCommentId(
  commentId: String
): Promise<UserResponseDTO[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-likes?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching likes by commentId");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch likes by commentId:", error);
    throw error;
  }
}

export async function createCommentMedia(
  params: CreateCommentDTO,
  token: string,
  mediaId: string
): Promise<CommentResponseDTO> {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/create-comment-media?mediaId=${mediaId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating comment");
    }

    const data: CommentResponseDTO = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
}

export async function deleteCommentMedia(
  commentId: string,
  mediaId: string,
  token: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/delete-comment-media?commentId=${commentId}&mediaId=${mediaId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting comment");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
}

export async function getRepliesByCommentId(commentId: String) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-replies?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching replies by commentId");
    }
    const data = await response.json();
    console.log("replies", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch replies by commentId:", error);
    throw error;
  }
}

export async function getCommentByCommentId(commentId: String) {
  try {
    const response = await fetch(
      `${BASE_URL}/comment/get-comment?commentId=${commentId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching comment by commentId");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch comment by commentId:", error);
    throw error;
  }
}
