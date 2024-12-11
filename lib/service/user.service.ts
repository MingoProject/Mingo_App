import {
  UserResponseDTO,
  UserRegisterDTO,
  UserLoginDTO,
  UpdateUserBioDTO,
  UpdateUserDTO,
} from "@/dtos/UserDTO";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export async function fetchUsers(): Promise<UserResponseDTO[]> {
  try {
    const response = await fetch(`${BASE_URL}/user/all`);
    if (!response.ok) {
      throw new Error("Error fetching users");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function register(
  userData: UserRegisterDTO
): Promise<UserResponseDTO> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error registering user");
    }
    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
}

export async function login(userData: UserLoginDTO) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function getMyProfile(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-profile?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

export async function getMyPosts(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-posts?userId=${id}`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function getMyFriends(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-friends?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching friends");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    throw error;
  }
}

export async function getMyBffs(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-bffs?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching bffs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bffs:", error);
    throw error;
  }
}

export async function getMyFollowings(id: string | null) {
  try {
    const response = await fetch(
      `${BASE_URL}/user/get-my-followings?userId=${id}`
    );

    if (!response.ok) {
      throw new Error("Error fetching followings");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch followings:", error);
    throw error;
  }
}

export async function getMyBlocks(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-blocks?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching blocks");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch blocks:", error);
    throw error;
  }
}

export async function uploadAvatar(formData: any, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/upload-avatar`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload avatar", err);
  }
}

export async function uploadBackground(formData: any, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/upload-background`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error upload background");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload background", err);
  }
}

export async function updateUserBio(
  params: UpdateUserBioDTO,
  token: string | null
) {
  try {
    const response = await fetch(`${BASE_URL}/user/update-bio`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error update bio");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update bio", err);
  }
}

export async function updateInfo(params: UpdateUserDTO, token: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Error update bio");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to update bio", err);
  }
}

export async function getMyImages(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-images?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching images");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    throw error;
  }
}

export async function getMyVideos(id: string | null) {
  try {
    const response = await fetch(`${BASE_URL}/user/get-my-videos?userId=${id}`);

    if (!response.ok) {
      throw new Error("Error fetching videos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    throw error;
  }
}
