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
import { FileContent, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { pusherClient } from "@/lib/pusher";
import { colors } from "@/styles/colors";
import { useTheme } from "@/context/ThemeContext";
import { useChatContext } from "@/context/ChatContext";

const RenderMessageItem = ({ item }: { item: any }) => {
  const timeString = `${item.lastMessage.timestamp.getHours()}:${item.lastMessage.timestamp.getMinutes()}`;
  const isReceiver = item.lastMessage.createBy !== item.id;
  const [lastMessage, setLastMessage] = useState(item.lastMessage);
  const router = useRouter(); // Khởi tạo router
  const { colorScheme } = useTheme();
  const { messages, setMessages } = useChatContext();
  console.log(item, "this is item");
  const handleNewMessage = async (data: ResponseMessageDTO) => {
    if (data.boxId !== item.id) return;
    const userId = await AsyncStorage.getItem("userId");

    try {
      const mark = await MarkMessageAsRead(
        data.boxId,
        userId?.toString() || ""
      );
      console.log(mark, "this is mark");
    } catch (error) {
      console.error("Error marking message as read:", error);
    }

    setMessages((prevMessages: any) => {
      const updatedMessages = [...prevMessages, data];

      // Lấy tin nhắn mới nhất
      const latestMessage = updatedMessages.sort(
        (a: any, b: any) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      )[0];

      // Kiểm tra xem userId có trong mảng readedId không

      const isRead =
        latestMessage.readedId.includes(userId?.toString() || "") ||
        data.boxId === item.id;

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
        status: isRead, // Cập nhật trạng thái dựa vào `readedId`
      });

      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  const handleDeleteMessage = (data: any) => {
    if (data.boxId !== item.id) return;

    setMessages((prevMessages) => {
      // Lọc ra các tin nhắn thuộc box chat hiện tại
      const boxChatMessages = prevMessages.filter(
        (msg) => msg.boxId === item.id
      );

      // Loại bỏ tin nhắn bị xóa
      const updatedMessages = boxChatMessages.filter(
        (chat) => chat.id !== data.id
      );

      // Khởi tạo giá trị mặc định cho fileContent
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

      // Xử lý cập nhật lastMessage
      if (updatedMessages.length > 0) {
        // Lấy tin nhắn mới nhất từ updatedMessages
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text || "",
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: false, // Có thể cập nhật trạng thái theo logic
        });
      } else if (boxChatMessages.length > 0) {
        // Nếu không còn tin nhắn trong updatedMessages, lấy từ prevMessages
        const latestMessage = boxChatMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0];

        if (latestMessage) {
          setLastMessage({
            id: latestMessage.boxId,
            text: latestMessage.text || "",
            contentId: latestMessage.contentId || fileContent,
            createBy: latestMessage.createBy,
            timestamp: new Date(latestMessage.createAt),
            status: true,
          });
        }
      } else {
        // Nếu không còn tin nhắn nào
        setLastMessage({
          id: item.id,
          text: "",
          contentId: fileContent,
          createBy: "",
          timestamp: new Date(),
          status: true,
        });
      }

      return prevMessages
        .filter((msg) => msg.boxId !== item.id)
        .concat(updatedMessages);
    });
  };

  const handleRevokeMessage = (data: any) => {
    setMessages((prevMessages) => {
      // Filter out the deleted message
      const updatedMessages = prevMessages.filter(
        (chat) => chat.id !== data.id
      );
      const fileContent: FileContent = {
        fileName: "",
        bytes: "",
        format: "",
        height: "",
        publicId: "",
        type: "Đã thu hồi tin nhắn",
        url: "",
        width: "",
      };

      // Cập nhật `lastMessage` và trạng thái (`status`)

      // If the deleted message was the last one, update the lastMessage
      if (updatedMessages.length >= 0) {
        const latestMessage = updatedMessages.sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )[0]; // Get the latest message from the updated list

        // Update the `lastMessage` state with the new last message
        setLastMessage({
          id: latestMessage.boxId,
          text: latestMessage.text || "Đã thu hồi tin nhắn",
          contentId: latestMessage.contentId || fileContent,
          createBy: latestMessage.createBy,
          timestamp: new Date(latestMessage.createAt),
          status: true, // Cập nhật trạng thái dựa vào `readedId`
        });
      } else {
        // If no messages left after deletion, clear the lastMessage
        setLastMessage({
          id: "",
          text: "Đã thu hồi tin nhắn",
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
    // Cập nhật người dùng được chọn
    // setSelectedItem(item);
    // Điều hướng đến trang chat với thông tin người dùng được chọn
    // router.push(`/chat?boxId=${item.id}`); // Đường dẫn tới chat.jsx
    router.push(`./chats/${item.id}`);
  };

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
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
          className={`text-[16px] font-mmedium `}
        >
          {item.userName}
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

                if (type !== "") {
                  switch (type) {
                    case "image":
                      return (
                        <Text className={messageStatusClass}>Gửi 1 ảnh</Text>
                      );
                    case "video || mp4":
                      return (
                        <Text className={messageStatusClass}>Gửi 1 video</Text>
                      );
                    case "other":
                      return (
                        <Text className={messageStatusClass}>Gửi 1 file</Text>
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
            <View className="flex items-center gap-1">
              <p className={`"font-normal"`}>Bạn: </p>
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
                      <Text className={messageStatusClass}>Gửi 1 ảnh</Text>
                    );
                  case "video":
                    return (
                      <Text className={messageStatusClass}>Gửi 1 video</Text>
                    );
                  case "other":
                    return (
                      <Text className={messageStatusClass}>Gửi 1 file</Text>
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
      <View className="flex-col items-end">
        <Text className="text-gray-500">{timeString}</Text>
        {item.isActive && (
          <View className="w-3 h-3 bg-green-500 rounded-full mt-1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderMessageItem;
