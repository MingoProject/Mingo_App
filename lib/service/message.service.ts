import {
  ChatResponse,
  FileContent,
  ItemChat,
  ResponseMessageBoxDTO,
} from "@/dtos/MessageDTO";
import { create } from "domain";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAllChat(boxId: string): Promise<ChatResponse> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    console.log(
      `${BASE_URL}/message/getAllChat?boxId=${boxId}`,
      "this is getallchat"
    );
    const response = await fetch(
      `${BASE_URL}/message/getAllChat?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Kiểm tra format Authorization
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching box chat by boxId: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch box chat by boxId:", error);
    throw error;
  }
}

export async function getListChat(): Promise<ItemChat[]> {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage, adjust if necessary.

  if (!token || !userId) {
    console.error("Token or User ID is missing");
    throw new Error("Authentication token or User ID is missing.");
  }

  try {
    console.log(`${BASE_URL}/message/getListChat`);

    const response = await fetch(`${BASE_URL}/message/getListChat`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Check authorization format
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching list chat: ${response.status}`);
    }

    const rawData: ResponseMessageBoxDTO = await response.json();

    // Mapping the response to ItemChat
    const chat: ItemChat[] = rawData.box
      .map((box: any) => {
        // Filter out the current logged-in user from receiverIds
        const receiver = box.receiverIds.find(
          (receiver: any) => receiver._id !== userId
        );

        // Return null if no valid recipient is found (i.e., the logged-in user is the only one)
        if (!receiver) return null;

        return {
          id: box._id,
          userName:
            `${receiver.firstName || ""} ${receiver.lastName || ""}`.trim(),
          avatarUrl: receiver.avatar || "", // Get the avatar URL of the recipient
          status: box.readStatus, // Adjust status according to the 'flag'
          lastMessage: {
            id: box.lastMessage._id,
            text: box.lastMessage.text.join(" "), // Join text segments if multiple parts
            timestamp: new Date(box.lastMessage.createAt),
            createBy: box.lastMessage.createBy,
          },
          isRead: box.readStatus,
        };
      })
      .filter((item): item is ItemChat => item !== null); // Filter out null values and ensure the type is ItemChat

    return chat;
  } catch (error) {
    console.error("Failed to fetch list chat", error);
    throw error;
  }
}

export async function sendMessage(formData: any): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(`${BASE_URL}/message/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `${token}`, // Use 'Bearer' for token authorization
      },
      body: formData, // FormData should be sent directly as the body
    });

    if (!response.ok) {
      const errorMessage = `Error sending message: ${response.statusText} (${response.status})`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Optional: if the response includes any data you need to handle
    const responseData = await response.json();
    console.log("Message sent successfully", responseData);
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

export async function getImageList(boxId: string): Promise<FileContent[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/getImageList?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Kiểm tra format Authorization
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching image list by boxId: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch image list by boxId:", error);
    throw error;
  }
}

export async function getVideoList(boxId: string): Promise<FileContent[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/getVideoList?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Kiểm tra format Authorization
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching video list by boxId: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch video list by boxId:", error);
    throw error;
  }
}

export async function getOrtherList(boxId: string): Promise<FileContent[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/getOrtherList?boxId=${boxId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Kiểm tra format Authorization
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching video list by boxId: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch video list by boxId:", error);
    throw error;
  }
}
