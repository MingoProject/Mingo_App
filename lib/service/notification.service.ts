import { CreateNotificationDTO } from "@/dtos/NotificationDTO";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createNotification(
  params: CreateNotificationDTO,
  token: string | null
) {
  try {
    const response = await fetch(
      `${BASE_URL}/notification/create-notification`,
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Upload error:", error.message);
    throw error;
  }
}

export async function getNotifications(token: String) {
  try {
    const response = await fetch(`${BASE_URL}/notification/get-notifications`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error fetching notifications ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
}

export async function UpdateStatusNotifications(notificationId: String) {
  try {
    const response = await fetch(
      `${BASE_URL}/notification/update-status?notificationId=${notificationId}`
    );
    if (!response.ok) {
      throw new Error("Error fetching notifications ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
}

export async function deleteNotification(
  notificationId: String,
  token: string | null
) {
  try {
    const response = await fetch(
      `${BASE_URL}/notification/delete-notification?notificationId=${notificationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error deleting notifications ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete notifications:", error);
    throw error;
  }
}
