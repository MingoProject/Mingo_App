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
  getGroupAllChat,
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
import { getMyProfile } from "@/lib/service/user.service";

const RenderMessageItem = ({
  item,
  itemUserId,
}: {
  item: ItemChat;
  itemUserId: any;
}) => {
  const timeString = `${item.lastMessage.timestamp.getHours()}:${item.lastMessage.timestamp.getMinutes()}`;
  const [lastMessage, setLastMessage] = useState(item.lastMessage);
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { messages, setMessages } = useChatContext();
  const [isRead, setIsRead] = useState(false);
  const { isOnlineChat, setIsOnlineChat } = useChatContext();

  const markMessagesAsRead = async (chatId: string) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      await MarkMessageAsRead(chatId.toString(), userId?.toString() || "");
      setIsRead(true);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const myChat = async () => {
    try {
      const data = await getGroupAllChat(item.id.toString()); // Gọi API

      if (data.success) {
        setMessages(data.messages); // Lưu trực tiếp `messages` từ API
        if (data.messages.length > 0) {
          // Cập nhật `lastMessage`
          const latestMessage = data.messages.sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
          )[0];

          setLastMessage({
            id: latestMessage.boxId,
            text: latestMessage.text || "",
            contentId: latestMessage.contentId || null,
            createBy: latestMessage.createBy,
            timestamp: new Date(latestMessage.createAt),
            status: false,
          });
        } else {
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
          // Nếu không có tin nhắn, đặt giá trị mặc định cho `lastMessage`
          setLastMessage({
            id: item.id,
            text: "",
            contentId: fileContent,
            createBy: "",
            timestamp: new Date(),
            status: true,
          });
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const handleNewMessage = async (data: ResponseGroupMessageDTO) => {
    if (data.boxId !== item.id) return;

    const userId = await AsyncStorage.getItem("userId");
    try {
      if (data.boxId === item.id) {
        markMessagesAsRead(data.boxId);
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

      const isReadNow = updatedMessages.some(
        (msg) =>
          msg.readedId.includes(userId?.toString() || "") ||
          data.boxId === item.id
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
      // if (data.boxId === item.id) {
      //   markMessagesAsRead(data.boxId); // Gọi API đánh dấu tin nhắn đã đọc
      // }
      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  const handleDeleteMessage = async (data: PusherDelete) => {
    if (data.boxId !== item.id) return;

    const currentUserId = await AsyncStorage.getItem("userId");

    setMessages((prevMessages) => {
      const boxChatMessages = prevMessages.filter(
        (msg) => msg.boxId === item.id
      );

      console.log("Box chat messages before delete: ", boxChatMessages);

      if (!data.visibility) {
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

        if (data.createBy === currentUserId) {
          let latestMessage;

          if (updatedMessages.length > 0) {
            latestMessage = updatedMessages.sort(
              (a, b) =>
                new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
            )[0];
          } else {
            myChat();
            return prevMessages;
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
              id: item.id,
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
        if (chat.id === data.id) {
          return {
            ...chat,
            text: "message unsent",
            type: "recalled",
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
        type: "message unsent",
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
          text: "message unsent",
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
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);
    pusherClient.bind("revoke-message", handleRevokeMessage);

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
    };
  }, [item.id, setMessages]);

  const handleMessagePress = (item: any) => {
    console.log("vo");
    router.push(`./chats/${item.id}`);
  };

  const isReceiver = lastMessage.createBy !== itemUserId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (item) {
          const data = await getMyProfile(item?.receiverId?.toString() || "");
          setIsOnlineChat((prevState) => ({
            ...prevState,
            [item?.receiverId?.toString() || ""]: data.userProfile.status,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [item, item?.receiverId]);

  console.log(lastMessage.text, "lastMessage.text");

  return (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center py-2"
      onPress={() => handleMessagePress(item)}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500],
      }}
    >
      <Image
        source={
          item.avatarUrl
            ? { uri: item.avatarUrl }
            : require("../../../assets/images/default-user.png")
        }
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
      <View className="ml-3 flex-1">
        <View className="flex flex-col gap-2">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className={`text-[16px] font-mmedium  `}
          >
            {item.groupName}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
            className={`text-[15px] font-mregular w-[290px]`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lastMessage.text === "Started the chat" ? (
              <View className="w-full flex flex-row justify-center">
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                    flex: 1,
                  }}
                  className={`font-msemibold text-[14px]`}
                >
                  {lastMessage.text}
                </Text>
              </View>
            ) : (
              <>
                {isReceiver ? (
                  <View className="flex flex-row gap-1">
                    <Text
                      className={`${
                        lastMessage.status || !isReceiver
                          ? "font-mregular"
                          : "font-mmedium"
                      }`}
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[100],
                      }}
                    >
                      {item.userName.trim().split(" ").pop()}:{" "}
                    </Text>
                    {(() => {
                      if (
                        lastMessage.text.startsWith(
                          "//Cuoc goi ket thuc; time:"
                        )
                      ) {
                        return (
                          <Text
                            className="font-msemibold"
                            style={{
                              color:
                                colorScheme === "dark"
                                  ? colors.dark[100]
                                  : colors.light[100],
                            }}
                          >
                            Cuộc gọi kết thúc
                          </Text>
                        );
                      }
                      console.log(lastMessage.contentId?.type?.toLowerCase());
                      const type =
                        lastMessage.contentId?.type?.toLowerCase() || "";
                      const messageStatusClass = lastMessage.status
                        ? "font-mregular"
                        : "font-msemibold";

                      if (lastMessage.text !== "") {
                        return (
                          <Text
                            className={messageStatusClass}
                            style={{
                              color:
                                colorScheme === "dark"
                                  ? colors.dark[100]
                                  : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                              flex: 1,
                            }}
                          >
                            {lastMessage.text}
                          </Text>
                        );
                      }

                      if (type) {
                        switch (type) {
                          case "image":
                            return (
                              <Text
                                className={messageStatusClass}
                                style={{
                                  color:
                                    colorScheme === "dark"
                                      ? colors.dark[100]
                                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                                }}
                              >
                                sent an image
                              </Text>
                            );
                          case "video":
                            return (
                              <Text
                                className={messageStatusClass}
                                style={{
                                  color:
                                    colorScheme === "dark"
                                      ? colors.dark[100]
                                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                                }}
                              >
                                sent a video
                              </Text>
                            );
                          case "audio":
                            return (
                              <Text
                                className={messageStatusClass}
                                style={{
                                  color:
                                    colorScheme === "dark"
                                      ? colors.dark[100]
                                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                                }}
                              >
                                sent an audio
                              </Text>
                            );
                          case "other":
                            return (
                              <Text
                                className={messageStatusClass}
                                style={{
                                  color:
                                    colorScheme === "dark"
                                      ? colors.dark[100]
                                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                                }}
                              >
                                sent a file
                              </Text>
                            );
                          default:
                            return (
                              <Text
                                className={messageStatusClass}
                                style={{
                                  color:
                                    colorScheme === "dark"
                                      ? colors.dark[100]
                                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                                }}
                              >
                                undefined
                              </Text>
                            );
                        }
                      }
                    })()}
                  </View>
                ) : (
                  <View className="flex flex-row items-center gap-1">
                    <Text
                      className={`${
                        lastMessage.status ? "font-mregular" : "font-mregular"
                      }`}
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[100],
                      }}
                    >
                      You:{" "}
                    </Text>
                    {(() => {
                      if (
                        lastMessage.text.startsWith(
                          "//Cuoc goi ket thuc; time:"
                        )
                      ) {
                        return (
                          <Text
                            className="font-msemibold"
                            style={{
                              color:
                                colorScheme === "dark"
                                  ? colors.dark[100]
                                  : colors.light[500],
                            }}
                          >
                            Cuộc gọi kết thúc{" "}
                          </Text>
                        );
                      }
                      const type =
                        lastMessage.contentId?.type?.toLowerCase() || "";
                      const messageStatusClass = lastMessage.status
                        ? "font-mregular"
                        : "font-mregular";

                      if (lastMessage.text !== "") {
                        return (
                          <Text
                            className={messageStatusClass}
                            style={{
                              color:
                                colorScheme === "dark"
                                  ? colors.dark[100]
                                  : colors.light[100], // Sử dụng giá trị màu từ file colors.js
                            }}
                          >
                            {lastMessage.text}
                          </Text>
                        );
                      }

                      switch (type) {
                        case "image":
                          return (
                            <Text
                              className={messageStatusClass}
                              style={{
                                color:
                                  colorScheme === "dark"
                                    ? colors.dark[100]
                                    : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                              }}
                            >
                              sent an image
                            </Text>
                          );
                        case "video":
                          return (
                            <Text className={messageStatusClass}>
                              sent a video
                            </Text>
                          );
                        case "audio":
                          return (
                            <Text className={messageStatusClass}>
                              sent an audio
                            </Text>
                          );
                        case "other":
                          return (
                            <Text className={messageStatusClass}>
                              sent a file
                            </Text>
                          );
                        default:
                          return (
                            <Text className={messageStatusClass}>
                              undefined
                            </Text>
                          );
                      }
                    })()}
                  </View>
                )}
              </>
            )}
          </Text>
        </View>
      </View>
      <View className="flex-col items-end">
        <Text
          className=""
          style={{
            color:
              colorScheme === "dark"
                ? colors.dark[100]
                : "text-gray-500 font-mregular",
          }}
        >
          {timeString}
        </Text>
        {isOnlineChat[item.receiverId || ""] && (
          <View className="w-3 h-3 bg-green-500 rounded-full mt-1" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderMessageItem;
