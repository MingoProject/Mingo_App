import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  getAllChat,
  getListChat,
  MarkMessageAsRead,
} from "../../../lib/service/message.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FileContent,
  ItemChat,
  PusherDelete,
  ResponseGroupMessageDTO,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { colors } from "@/styles/colors";
import { useTheme } from "@/context/ThemeContext";
import { useChatContext } from "@/context/ChatContext";

const RenderMessageItem = ({
  item,
  itemUserId,
}: {
  item: ItemChat;
  itemUserId: any;
}) => {
  const timeString = `${item.lastMessage.timestamp.getHours()}:${item.lastMessage.timestamp.getMinutes()}`;
  const [lastMessage, setLastMessage] = useState(item.lastMessage);
  const router = useRouter(); // Khởi tạo router
  const { colorScheme } = useTheme();
  const { messages, setMessages } = useChatContext();
  console.log(item, "this is item");
  const [userId, setUserId] = useState("");

  const handleNewMessage = async (data: ResponseGroupMessageDTO) => {
    if (data.boxId !== itemChat.id) return;

    try {
      if (data.boxId === id) {
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, data];

      // Lấy tin nhắn mới nhất
      const latestMessage = updatedMessages.sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];

      // Kiểm tra xem userId có trong mảng readedId không
      const userId = localStorage.getItem("userId");

      const isReadNow = updatedMessages.some(
        (msg) =>
          msg.readedId.includes(userId?.toString() || "") || data.boxId === id
      );

      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)
      setLastMessage({
        id: latestMessage.boxId,
        text: latestMessage.text || "",
        contentId: latestMessage.contentId || fileContent,
        createBy: latestMessage.createBy,
        timestamp: new Date(latestMessage.createAt),
        status: isReadNow, // Cập nhật trạng thái dựa vào `readedId`
      });

      // console.log(isRead, "updatedMessages");
      if (data.boxId === id) {
        markMessagesAsRead(data.boxId); // Gọi API đánh dấu tin nhắn đã đọc
      }
      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  const handleDeleteMessage = (data: PusherDelete) => {
    // Kiểm tra nếu không phải tin nhắn trong box hiện tại
    if (data.boxId !== itemChat.id) return;

    const currentUserId = localStorage.getItem("userId");

    setMessages((prevMessages) => {
      // Lọc tin nhắn trong box chat hiện tại
      const boxChatMessages = prevMessages.filter(
        (msg) => msg.boxId === itemChat.id
      );

      console.log("Box chat messages before delete: ", boxChatMessages);

      // Nếu `visibility` là `false`, xử lý tin nhắn bị xóa
      if (!data.visibility) {
        // Lọc các tin nhắn còn lại sau khi xóa tin nhắn bị thu hồi
        const updatedMessages = boxChatMessages.filter(
          (msg) => msg.id !== data.id
        );

        console.log("Updated messages after delete: ", updatedMessages);

        const fileContent = {
          fileName: "",
          bytes: "",
          format: "",
          height: "",
          publicId: "",
          type: "",
          url: "",
          width: "",
        };

        // Chỉ cập nhật `lastMessage` cho người xóa
        if (data.createBy === currentUserId) {
          let latestMessage;

          if (updatedMessages.length > 0) {
            // Lấy tin nhắn mới nhất từ `updatedMessages`
            latestMessage = updatedMessages.sort(
              (a, b) =>
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            )[0];
          } else {
            // Nếu không còn tin nhắn, gọi API để lấy lại danh sách tin nhắn
            myChat();
            return prevMessages; // Tạm thời trả về danh sách hiện tại
          }

          if (latestMessage) {
            console.log("Last message after deletion: ", latestMessage);

            setLastMessage({
              id: latestMessage.boxId,
              text: latestMessage.text || "",
              contentId: latestMessage.contentId || fileContent,
              createBy: latestMessage.createBy,
              timestamp: new Date(latestMessage.createAt),
              status: false, // Tùy chỉnh logic trạng thái nếu cần
            });
          } else {
            // Không còn tin nhắn nào, đặt giá trị mặc định cho `lastMessage`
            setLastMessage({
              id: itemChat.id,
              text: "",
              contentId: fileContent,
              createBy: "",
              timestamp: new Date(),
              status: true,
            });
          }
        }

        // Trả về danh sách đã cập nhật (xóa tin nhắn bị thu hồi)
        return prevMessages.filter((msg) => msg.id !== data.id);
      }

      // Nếu `visibility` không phải `false`, giữ nguyên danh sách
      return prevMessages;
    });
  };

  const handleRevokeMessage = (data: any) => {
    if (data.boxId !== item.id) return;

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((chat) => {
        // Nếu là tin nhắn bị thu hồi, cập nhật nội dung
        if (chat.id === data.id) {
          return {
            ...chat,
            text: "Đã thu hồi", // Hoặc nội dung tùy chỉnh
            type: "recalled", // Có thể thêm type để phân loại tin nhắn đã thu hồi
          };
        }
        return chat;
      });

      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "Đã thu hồi",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)
      if (updatedMessages.length > 0) {
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text,
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: true,
        });
      } else {
        setLastMessage({
          id: "",
          text: "Đã thu hồi",
          contentId: fileContent,
          createBy: "",
          timestamp: new Date(),
          status: true,
        });
      }

      return updatedMessages;
    });
  };

  useEffect(() => {
    if (!item.id) {
      console.error("ID is missing or invalid");
      return;
    }
    // const pusherChannel = `private-${item.id}`;
    //pusherClient.subscribe(pusherChannel);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);
    // pusherClient.bind("revoke-message", handleRevokeMessage);

    // Dọn dẹp khi component bị unmount
    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
      // pusherClient.unbind("revoke-message", handleRevokeMessage);
    };
  }, [item.id, setMessages]);

  const handleMessagePress = (item: any) => {
    router.push(`./chats/${item.id}`);
  };

  const isReceiver = lastMessage.createBy !== itemUserId;

  console.log(isReceiver, "isReceiver");
  console.log(item.lastMessage.createBy, "item.lastMessage.createBy");
  console.log(userId, "userId");
  console.log(itemUserId, "itemUserId");

  return (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center py-2"
      onPress={() => handleMessagePress(item)}
    >
      <Image
        source={
          item.avatarUrl
            ? { uri: item.avatarUrl }
            : require("../../../assets/images/default-user.png")
        }
        style={{ width: 70, height: 70, borderRadius: 50 }}
      />
      <View className="ml-3 flex-1">
        <View className="flex flex-col gap-2">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className={`text-[16px] font-mmedium  `}
          >
            {item.groupName}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className={`text-[15px] font-mregular w-[290px]`}
            numberOfLines={1} // Giới hạn chỉ một dòng
            ellipsizeMode="tail"
          >
            {isReceiver ? (
              <View className="flex flex-row gap-1">
                <Text
                  className={`${
                    lastMessage.status || !isReceiver
                      ? "font-normal"
                      : "font-bold"
                  }`}
                >
                  {item.userName.trim().split(" ").pop()}:{" "}
                </Text>
                {(() => {
                  console.log(lastMessage.contentId?.type?.toLowerCase());
                  const type = lastMessage.contentId?.type?.toLowerCase() || "";
                  const messageStatusClass = lastMessage.status
                    ? "font-normal"
                    : "font-bold";

                  if (lastMessage.text !== "") {
                    return (
                      <Text className={messageStatusClass}>
                        {lastMessage.text}
                      </Text>
                    );
                  }

                  if (type) {
                    switch (type) {
                      case "image":
                        return (
                          <Text className={messageStatusClass}>
                            đã gửi 1 ảnh
                          </Text>
                        );
                      case "video":
                        return (
                          <Text className={messageStatusClass}>
                            đã gửi 1 video
                          </Text>
                        );
                      case "audio":
                        return (
                          <Text className={messageStatusClass}>
                            đã gửi 1 âm thanh
                          </Text>
                        );
                      case "other":
                        return (
                          <Text className={messageStatusClass}>
                            đã gửi 1 file
                          </Text>
                        );
                      default:
                        return (
                          <Text className={messageStatusClass}>
                            Bắt đầu đoạn chat
                          </Text>
                        );
                    }
                  }
                })()}
              </View>
            ) : (
              <View className="flex flex-row items-center gap-1">
                <Text className={`"font-normal"`}>Bạn: </Text>
                {(() => {
                  const type = lastMessage.contentId?.type?.toLowerCase() || "";
                  const messageStatusClass = lastMessage.status
                    ? "font-normal"
                    : "font-normal";

                  if (lastMessage.text !== "") {
                    return (
                      <Text className={messageStatusClass}>
                        {lastMessage.text}
                      </Text>
                    );
                  }

                  switch (type) {
                    case "image":
                      return (
                        <Text className={messageStatusClass}>đã gửi 1 ảnh</Text>
                      );
                    case "video":
                      return (
                        <Text className={messageStatusClass}>
                          đã gửi 1 video
                        </Text>
                      );
                    case "audio":
                      return (
                        <Text className={messageStatusClass}>
                          đã gửi 1 âm thanh
                        </Text>
                      );
                    case "other":
                      return (
                        <Text className={messageStatusClass}>
                          đã gửi 1 file
                        </Text>
                      );
                    default:
                      return (
                        <Text className={messageStatusClass}>
                          Bắt đầu đoạn chat
                        </Text>
                      );
                  }
                })()}
              </View>
            )}
          </Text>
        </View>
      </View>
      <View className="flex-col items-end">
        <Text className="text-gray-500">{timeString}</Text>
        {item.status && (
          <View className="w-3 h-3 bg-green-500 rounded-full mt-1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderMessageItem;
