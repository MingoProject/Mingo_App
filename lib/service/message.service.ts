import {
  ChatResponse,
  FileContent,
  FindMessageResponse,
  GroupChatResponse,
  ItemChat,
  RequestCreateGroup,
  ResponseMessageBoxDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { create } from "domain";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const fileContent: FileContent = {
  fileName: "",
  url: "",
  publicId: "",
  bytes: "",
  width: "0",
  height: "0",
  format: "",
  type: "",
};

export async function getAllChat(boxId: string): Promise<ChatResponse> {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/getAllChat?boxId=${boxId}&&userId=${userId}`,
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

// export async function getListChat(): Promise<ItemChat[]> {
//   const token = await AsyncStorage.getItem("token");
//   const userId = await AsyncStorage.getItem("userId"); // Assuming userId is stored in AsyncStorage, adjust if necessary.

//   if (!token || !userId) {
//     console.error("Token or User ID is missing");
//     throw new Error("Authentication token or User ID is missing.");
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/message/getListChat`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`, // Check authorization format
//       },
//     });

//     if (!response.ok) {
//       if (response.status === 403) {
//         console.error("Access Denied: You do not have permission.");
//       }
//       throw new Error(`Error fetching list chat: ${response.status}`);
//     }

//     const rawData: ResponseMessageBoxDTO = await response.json();

//     // Mapping the response to ItemChat
//     const chat: ItemChat[] = rawData.box
//       .map((box: any) => {
//         // Filter out the current logged-in user from receiverIds
//         const receiver = box.receiverIds.find(
//           (receiver: any) => receiver._id !== userId
//         );

//         // Return null if no valid recipient is found (i.e., the logged-in user is the only one)
//         if (!receiver) return null;

//         const lastMessage = box.responseLastMessage
//           ? {
//               id: box.responseLastMessage.id,
//               text: box.responseLastMessage.text
//                 ? box.responseLastMessage.text
//                 : box.responseLastMessage.text || "",
//               timestamp: new Date(box.responseLastMessage.createAt),
//               createBy: box.responseLastMessage.createBy,
//             }
//           : { id: "", text: "", timestamp: new Date(), createBy: "" };
//         return {
//           id: box._id,
//           userName: `${receiver.firstName || ""} ${
//             receiver.lastName || ""
//           }`.trim(),
//           avatarUrl: receiver.avatar || "", // Get the avatar URL of the recipient
//           status: box.readStatus, // Adjust status according to the 'flag'
//           lastMessage: lastMessage,
//           isRead: box.readStatus,
//           receiverId: receiver._id,
//           senderId: box.senderId,
//         };
//       })
//       .filter((item): item is ItemChat => item !== null); // Filter out null values and ensure the type is ItemChat

//     return chat;
//   } catch (error) {
//     console.error("Failed to fetch list chat", error);
//     throw error;
//   }
// }

// export async function getListGroupChat(): Promise<ItemChat[]> {
//   const token = await AsyncStorage.getItem("token");
//   const userId = await AsyncStorage.getItem("userId"); // Assuming userId is stored in AsyncStorage, adjust if necessary.

//   // Kiểm tra xem token và userId có tồn tại trong await AsyncStorage không
//   if (!token || !userId) {
//     console.error("Token or User ID is missing");
//     throw new Error("Authentication token or User ID is missing.");
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/message/getListGroupChat`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${token}`, // Đảm bảo định dạng Authorization là "Bearer <token>"
//       },
//     });

//     // Kiểm tra trạng thái phản hồi
//     if (!response.ok) {
//       if (response.status === 403) {
//         console.error("Access Denied: You do not have permission.");
//       }
//       throw new Error(`Error fetching list chat: ${response.status}`);
//     }

//     const rawData: ResponseMessageBoxDTO = await response.json();
//     // console.log(rawData, "raw data");

//     // Mapping the response to ItemChat
//     const chat: ItemChat[] = rawData.box
//       .map((box: any) => {
//         // Lọc ra người nhận hợp lệ (không phải người dùng hiện tại)
//         const receiver = box.receiverIds.find(
//           (receiver: any) => receiver._id !== userId
//         );

//         // Nếu không tìm thấy người nhận hợp lệ và không có groupName, trả về null
//         if (!receiver && !box.groupName) return null;

//         // Xử lý trường hợp lastMessage là null
//         const lastMessage = box.lastMessage
//           ? {
//               id: box.lastMessage.id,
//               text: box.lastMessage.text
//                 ? box.lastMessage.text
//                 : box.lastMessage.text || "Bắt đầu đoạn chat",
//               contentId: box.lastMessage.contentId || fileContent,
//               timestamp: new Date(box.lastMessage.createAt),
//               createBy: box.lastMessage.createBy,
//             }
//           : {
//               id: "",
//               text: "Bắt đầu đoạn chat",
//               timestamp: new Date(),
//               createBy: "",
//               contentId: fileContent,
//             };

//         return {
//           id: box._id,
//           userName:
//             box.groupName ||
//             `${receiver?.firstName || ""} ${receiver?.lastName || ""}`.trim(),
//           avatarUrl: box.groupAva || receiver?.avatar || "", // Lấy avatar của người nhận hoặc nhóm
//           status: box.readStatus, // Trạng thái đọc
//           lastMessage, // Tin nhắn cuối
//           isRead: box.readStatus, // Trạng thái đã đọc
//           receiverId: receiver._id,
//           senderId: box.senderId,
//         };
//       })
//       .filter((item): item is ItemChat => item !== null); // Lọc bỏ các phần tử null

//     return chat;
//   } catch (error) {
//     console.error("Failed to fetch list chat", error);
//     throw error;
//   }
// }

export async function getListChat(): Promise<ItemChat[]> {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId"); // Assuming userId is stored in await AsyncStorage, adjust if necessary.

  if (!token || !userId) {
    console.error("Token or User ID is missing");
    throw new Error("Authentication token or User ID is missing.");
  }

  console.log(userId, "log userId");

  try {
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
    console.log(rawData, "rawData");

    // console.log(rawData, "status lisstchat");

    // Mapping the response to ItemChat
    const chat: ItemChat[] = rawData.box
      .map((box: any) => {
        // Filter out the current logged-in user from receiverIds
        const receiver = box.receiverIds.find(
          (receiver: any) => receiver._id !== userId
        );
        const senderId = box.receiverIds.find(
          (receiver: any) => receiver._id === userId
        );

        // Return null if no valid recipient is found (i.e., the logged-in user is the only one)
        if (!receiver) return null;

        console.log(receiver, "box.receiver");
        console.log(senderId, "box.sender");

        const lastMessage = box.responseLastMessage
          ? {
              id: box.responseLastMessage.id,
              text: box.responseLastMessage.text
                ? box.responseLastMessage.text
                : box.responseLastMessage.text || "",
              contentId: box.responseLastMessage.contentId || fileContent,
              timestamp: new Date(box.responseLastMessage.createAt),
              createBy: box.responseLastMessage.createBy,
              status: box.receiverIds.includes(userId) ? true : false,
            }
          : {
              id: "",
              text: "Bắt đầu đoạn chat",
              timestamp: new Date(),
              createBy: "",
              contentId: fileContent,
              status: false,
            };
        return {
          id: box._id,
          userName: `${receiver.firstName || ""} ${
            receiver.lastName || ""
          }`.trim(),
          groupName: `${receiver.firstName || ""} ${
            receiver.lastName || ""
          }`.trim(),
          avatarUrl: receiver.avatar || "", // Get the avatar URL of the recipient
          status: box.status, // Adjust status according to the 'flag'
          lastMessage: lastMessage,
          isRead: box.readStatus,
          receiverId: receiver._id,
          senderId: senderId._id,
        };
      })
      .filter((item): item is ItemChat => item !== null); // Filter out null values and ensure the type is ItemChat

    return chat;
  } catch (error) {
    console.error("Failed to fetch list chat", error);
    throw error;
  }
}

export async function getListGroupChat(): Promise<ItemChat[]> {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId");

  // Kiểm tra xem token và userId có tồn tại trong await AsyncStorage không
  if (!token || !userId) {
    console.error("Token or User ID is missing");
    throw new Error("Authentication token or User ID is missing.");
  }

  try {
    const response = await fetch(`${BASE_URL}/message/getListGroupChat`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`, // Đảm bảo định dạng Authorization là "Bearer <token>"
      },
    });

    // Kiểm tra trạng thái phản hồi
    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(`Error fetching list chat: ${response.status}`);
    }

    const rawData: ResponseMessageBoxDTO = await response.json();
    // console.log(rawData, "raw data");

    // Mapping the response to ItemChat
    const chat: ItemChat[] = rawData.box
      .map((box: any) => {
        // Lọc ra người nhận hợp lệ (không phải người dùng hiện tại)
        const receiver = box.receiverIds.find(
          (receiver: any) => receiver._id !== userId
        );

        // Nếu không tìm thấy người nhận hợp lệ và không có groupName, trả về null
        if (!receiver && !box.groupName) return null;

        // Xử lý trường hợp lastMessage là null
        const lastMessage = box.lastMessage
          ? {
              id: box.lastMessage.id,
              text: box.lastMessage.text
                ? box.lastMessage.text
                : box.lastMessage.text || "Bắt đầu đoạn chat",
              contentId: box.lastMessage.contentId || fileContent,
              timestamp: new Date(box.lastMessage.createAt),
              createBy: box.lastMessage.createBy,
              status: box.isRead,
            }
          : {
              id: "",
              text: "Bắt đầu đoạn chat",
              timestamp: new Date(),
              createBy: "",
              contentId: fileContent,
              status: false,
            };

        return {
          id: box._id,
          userName: `${box.senderId.firstName} ${box.senderId.lastName}`.trim(),
          groupName: box.groupName || "",
          avatarUrl: box.groupAva || receiver?.avatar || "", // Lấy avatar của người nhận hoặc nhóm
          status: box.status, // Trạng thái đọc
          lastMessage, // Tin nhắn cuối
          isRead: box.readStatus, // Trạng thái đã đọc
          receiverId: receiver._id,
          senderId: box.senderId,
        };
      })
      .filter((item): item is ItemChat => item !== null); // Lọc bỏ các phần tử null

    return chat;
  } catch (error) {
    console.error("Failed to fetch list chat", error);
    throw error;
  }
}

export async function sendMessage(formData: any): Promise<void> {
  const token = await AsyncStorage.getItem("token");
  console.log(formData, "formadatata");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(`${BASE_URL}/message/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
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
  const token = await AsyncStorage.getItem("token");
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
  const token = await AsyncStorage.getItem("token");
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
  const token = await AsyncStorage.getItem("token");
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

export async function removeChatBox(boxId: string | null) {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/removeChat?boxId=${boxId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting chat box");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete chat box:", error);
    throw error;
  }
}

export async function findMessage(
  boxId: string,
  query: string
): Promise<FindMessageResponse> {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/findMessage?boxId=${boxId}&query=${query}`,
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
      throw new Error(`Error find message: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to find message:", error);
    throw error;
  }
}

export async function createGroup(data: any): Promise<any> {
  // Lấy token từ await AsyncStorage
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    // Gửi yêu cầu API
    const response = await fetch(`${BASE_URL}/message/createGroup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo thông báo content type là JSON
        Authorization: `${token}`, // Đảm bảo sử dụng định dạng 'Bearer'
      },
      body: JSON.stringify(data), // Dữ liệu phải được chuyển thành JSON
    });

    // Kiểm tra trạng thái phản hồi
    if (!response.ok) {
      const errorMessage = `Error creating group: ${response.statusText} (${response.status})`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Phân tích dữ liệu phản hồi
    const responseData = await response.json();
    console.log("Group created successfully", responseData);
    return responseData;
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
}

export async function removeMessage(messageId: string | null) {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/deleteMessage?messageId=${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting message");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
}

export async function revokeMessage(messageId: string | null) {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/revokeMessage?messageId=${messageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error deleting message");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
}

export async function MarkMessageAsRead(boxId: string, userId: string) {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/markMessageAsRead?boxId=${boxId}&&userId=${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`, // Kiểm tra format Authorization
        },
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        console.error("Access Denied: You do not have permission.");
      }
      throw new Error(
        `Error fetching mark as read list by boxId: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch mark as read list by boxId:", error);
    throw error;
  }
}

export async function createGroups(param: RequestCreateGroup, groupAva?: File) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No token found" };
    }

    const formData = new FormData();
    formData.append("membersIds", JSON.stringify(param.membersIds)); // Giữ JSON.stringify cho membersIds
    formData.append("groupName", param.groupName);

    if (groupAva) {
      formData.append("file", groupAva);
    }

    const response = await fetch(`${BASE_URL}/message/createGroup`, {
      method: "POST",
      headers: {
        Authorization: `${token}`, // Sử dụng 'Bearer'
      },
      body: formData, // Truyền formData mà không cần stringify
    });

    const responseData = await response.json();
    console.log(responseData);

    return responseData;
  } catch (error: any) {
    console.error("Failed to create group:", error);
    throw error;
  }
}

export async function uploadGroupAvatar(
  formData: any,
  boxId: string,
  token: string | null
) {
  try {
    console.log(
      `${BASE_URL}/message/upload-group-avatar?boxId=${boxId}`,
      formData,
      boxId,
      "this is for update group"
    );
    const response = await fetch(
      `${BASE_URL}/message/upload-group-avatar?boxId=${boxId}`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to upload avatar", err);
  }
}

export async function getGroupAllChat(
  boxId: string
): Promise<GroupChatResponse> {
  const token = await AsyncStorage.getItem("token");
  const userId = await AsyncStorage.getItem("userId");
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token is missing.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/message/getGroupAllChat?boxId=${boxId}&&userId=${userId}`,
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
