import { FriendRequestDTO } from "@/dtos/FriendDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function requestAddFriend(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/request-add-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error sending friend request");
    }

    const data = await response.json();
    console.log("Friend request result:", data);
    return data;
  } catch (error) {
    console.error("Failed to send friend request:", error);
    throw error;
  }
} //

export async function acceptAddFriend(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/accept-friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error accepting friend request");
    }

    const data = await response.json();
    console.log("Friend accept result:", data);
    return data;
  } catch (error) {
    console.error("Failed to send friend accept:", error);
    throw error;
  }
} //

export async function unfollowOrRefuseFriendRequest(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error unfollowing user");
    }

    const data = await response.json();
    console.log("Unfollow result:", data);
    return data;
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    throw error;
  }
} //

export async function requestAddBFF(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/request-add-bff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error sending BFF request");
    }

    const data = await response.json();
    console.log("BFF request result:", data);
    return data;
  } catch (error) {
    console.error("Failed to send BFF request:", error);
    throw error;
  }
} //

export async function acceptAddBff(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/accept-bff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error accepting bff request");
    }

    const data = await response.json();
    console.log("bff accept result:", data);
    return data;
  } catch (error) {
    console.error("Failed to send bff accept:", error);
    throw error;
  }
} //

export async function unrequestBffOrRefuseBffRequest(
  params: FriendRequestDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/friend/delete-request-add-bff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting bff request");
    }

    const data = await response.json();
    console.log("Delete bff request result:", data);
    return data;
  } catch (error) {
    console.error("Failed to Delete bff request:", error);
    throw error;
  }
} //

export async function unfriend(params: FriendRequestDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/friend/unfriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error unfriending");
    }

    const data = await response.json();
    console.log("Unfriend result:", data);
    return data;
  } catch (error) {
    console.error("Failed to unfriend:", error);
    throw error;
  }
}

export async function block(params: FriendRequestDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/friend/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error blocking user");
    }

    const data = await response.json();
    console.log("Block result:", data);
    return data;
  } catch (error) {
    console.error("Failed to block user:", error);
    throw error;
  }
} //

export async function unBFF(params: FriendRequestDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/friend/unbff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error removing BFF");
    }

    const data = await response.json();
    console.log("Un-BFF result:", data);
    return data;
  } catch (error) {
    console.error("Failed to remove BFF:", error);
    throw error;
  }
} //

export async function unblock(params: FriendRequestDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/friend/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error unblocking user");
    }

    const data = await response.json();
    console.log("Unblock result:", data);
    return data;
  } catch (error) {
    console.error("Failed to unblock user:", error);
    throw error;
  }
} //
