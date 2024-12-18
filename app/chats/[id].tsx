import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useChatContext } from "../../context/ChatContext";
import {
  getAllChat,
  getListChat,
  getListGroupChat,
  MarkMessageAsRead,
  removeMessage,
  revokeMessage,
  sendMessage,
} from "../../lib/service/message.service";
import {
  ArrowIcon,
  CallIcon,
  InfoIcon,
  VideoCallIcon,
  CameraIcon,
  ImageIcon,
  MicroIcon,
  PlusIcon,
  SendIcon,
} from "../../components/icons/Icons";
import InfoChat from "../../components/forms/chat/InfoChat";
import { useAuth } from "../../context/AuthContext";
import {
  FileContent,
  ItemChat,
  PusherDelete,
  PusherRevoke,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { FindUserDTO } from "@/dtos/UserDTO";
import { getFileFormat } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pusherClient } from "@/lib/pusher";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { checkRelation } from "@/lib/service/relation.service";
import MyInput from "@/components/share/MyInput";
import { useChatItemContext } from "@/context/ChatItemContext";
import { isLoading } from "expo-font";

const Chat = () => {
  const { messages, setMessages } = useChatContext();
  const { profile } = useAuth();
  const { colorScheme } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [value, setValue] = useState("");
  const { allChat, setAllChat } = useChatItemContext();

  const { width: screenWidth } = Dimensions.get("window");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [isRecording, setIsRecording] = useState(false); // Để theo dõi trạng thái ghi âm
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL của file audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Để lưu MediaRecorder instance
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentContentType, setCurrentContentType] = useState<
    "text" | "voice" | "file" | null
  >(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [relation, setRelation] = useState<string>("");

  useEffect(() => {
    if (temporaryToCloudinaryMap.length === 0) return;

    setMessages((prev: any) =>
      prev.map((msg: any) => {
        const mapEntry = temporaryToCloudinaryMap.find(
          (entry) => msg.contentId[0].url === entry.tempUrl
        );
        return mapEntry
          ? {
              ...msg,
              contentId: [{ ...msg.contentId[0], url: mapEntry.cloudinaryUrl }],
            }
          : msg;
      })
    );

    // Sau khi cập nhật xong, loại bỏ các URL đã xử lý
    setTemporaryToCloudinaryMap([]);
  }, [temporaryToCloudinaryMap]);

  const chatItem = allChat.find((chat) => chat.id === id);

  useEffect(() => {
    if (!chatItem) {
      return; // Nếu chưa có chatItem, không thực hiện gì
    }
    let isMounted = true;

    const check = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(
            userId,
            chatItem?.receiverId?.toString()
          );
          if (isMounted) {
            if (!res) {
              setRelation("stranger");
              // setRelationStatus(false);
            } else {
              const { relation, status, sender, receiver } = res;

              if (relation === "bff") {
                if (status) {
                  setRelation("bff"); //
                } else if (userId === sender) {
                  setRelation("senderRequestBff"); //
                } else if (userId === receiver) {
                  setRelation("receiverRequestBff"); //
                }
              } else if (relation === "friend") {
                if (status) {
                  setRelation("friend"); //
                } else if (userId === sender) {
                  setRelation("following"); //
                } else if (userId === receiver) {
                  setRelation("follower"); //
                }
              } else if (relation === "block") {
                if (userId === sender) {
                  setRelation("blocked"); //
                } else if (userId === receiver) {
                  setRelation("blockedBy");
                }
              } else {
                setRelation("stranger"); //
              }
              // setRelationStatus(status);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, [chatItem]);

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getAllChat(chatItem?.id.toString() || ""); // Gọi API
        console.log(data, "this is data of body");
        if (isMounted && data.success) {
          setMessages(data.messages); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    myChat();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, []);

  const resetContent = () => {
    setValue("");
    setAudioBlob(null);
    setSelectedFiles([]);
    setCurrentContentType(null);
  };

  const handleSend = async () => {
    switch (currentContentType) {
      case "text":
        await handleSendTextMessage();
        break;
      case "voice":
        await handleSendVoiceMessage();
        break;
      case "file":
        await handleSendMultipleFiles(selectedFiles);
        break;
      default:
        console.log("No content to send");
    }
    // Reset trạng thái sau khi gửi
    resetContent();
  };

  // const handleMarkAsRead = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem("userId");

  //     const mark = await MarkMessageAsRead(
  //       chatItem?.id || "",
  //       userId?.toString() || ""
  //     );
  //     console.log(mark, "this is mark");
  //   } catch (error) {
  //     console.error("Error marking message as read:", error);
  //   }
  // };

  const handleSendMultipleFiles = async (files: File[]) => {
    if (!files.length || !id) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      // Gửi từng file lên server
      for (const file of files) {
        const fileContent: FileContent = {
          fileName: file.name,
          url: "",
          publicId: "", // Cloudinary Public ID
          bytes: file.size.toString(),
          width: "0",
          height: "0",
          format: getFileFormat(file.type, file.name),
          type: file.type.split("/")[0],
        };

        const formData = new FormData();
        formData.append("boxId", id.toString());
        formData.append("content", JSON.stringify(fileContent));
        formData.append("file", file);

        await sendMessage(formData);
      }
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setCurrentContentType("voice");
    console.log("Recording started...");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl); // Lưu URL của file audio
        };

        mediaRecorder.start();
        setIsRecording(true); // Đánh dấu trạng thái ghi âm
      })
      .catch((err) => {
        console.error("Error accessing audio: ", err);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Giả lập audioBlob (thay bằng logic thực)
    const mockBlob = new Blob(["audio data"], { type: "audio/wav" });
    setAudioBlob(mockBlob);
    console.log("Recording stopped");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false); // Đánh dấu ghi âm đã dừng
    }
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob) return;
    console.log("Sending voice message:", audioBlob);
    if (!audioUrl || !id) return;

    const storedToken = await AsyncStorage.getItem("token");

    if (!storedToken) return;

    try {
      const formData = new FormData();
      formData.append("boxId", id.toString());

      // Đọc file từ audio URL và gửi lên server
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      const fileContent: FileContent = {
        fileName: "voice-message.wav",
        url: "",
        publicId: "", // Cloudinary Public ID
        bytes: audioBlob.size.toString(),
        width: "0",
        height: "0",
        format: "wav",
        type: "audio",
      };

      formData.append("content", JSON.stringify(fileContent));
      formData.append("file", audioBlob, "voice-message.wav");

      const messageResponse = await sendMessage(formData);
      console.log("Voice message sent successfully:", messageResponse);
    } catch (error) {
      console.error("Error sending voice message: ", error);
    }
  };

  const handleSendTextMessage = async () => {
    if (!value.trim()) return;
    console.log("Sending text message:", value);
    // handleMarkAsRead();
    // Tạo đối tượng SegmentMessageDTO
    const messageData = {
      boxId: id.toString(),
      content: value, // content is now a string
    };

    if (!messageData.boxId) {
      console.error("Missing required fields in message data");
      return;
    }

    // Reset input value
    setValue("");

    // Gửi request đến API để gửi tin nhắn với file đã chọn
    if (value === "") {
      console.log("Missing value");
      return;
    }

    const formData = new FormData();
    formData.append("boxId", messageData.boxId.toString());
    formData.append("content", JSON.stringify(messageData.content)); // Directly append the string

    // Gửi API
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken) return;

      const response = await sendMessage(formData);
      console.log("Message sent successfully:", response);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleNewMessage = async (data: ResponseMessageDTO) => {
    // if (chatItem?.id !== data.boxId) return;
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
      return updatedMessages;
    });

    // Đánh dấu tin nhắn là đã đọc nếu người dùng là receiver
  };

  useEffect(() => {
    // const handleNewMessage = (data: ResponseMessageDTO) => {
    //   console.log("Successfully received message: ", data);
    //   if (chatItem?.id !== data.boxId) return; // Kiểm tra đúng kênh
    //   setMessages((prevMessages) => {
    //     return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
    //   });
    // };

    pusherClient.subscribe(`private-${id}`);
    pusherClient.bind("new-message", handleNewMessage);
    // pusherClient.bind("delete-message", handleDeleteMessage);
    // pusherClient.bind("revoke-message", handleRevokeMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(`private-${id}`);
      // pusherClient.bind("delete-message", handleDeleteMessage);
      // pusherClient.bind("revoke-message", handleRevokeMessage);
      console.log(`Unsubscribed from private-${id} channel`);
    };
  }, [setMessages]); // Re-run if boxId or setMessages changes

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setCurrentContentType("file");
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await removeMessage(messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (error) {
      alert("Xóa chat thất bại. Vui lòng thử lại.");
    }
  };

  const handleRevoke = async (messageId: string) => {
    // Cập nhật giao diện trước để tạo phản hồi nhanh cho người dùng
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, flag: false } : msg
      )
    );

    try {
      // Gửi yêu cầu lên server để cập nhật trạng thái thu hồi
      await revokeMessage(messageId);
    } catch (error) {
      alert("Khôi phục thất bại. Vui lòng thử lại.");
    }
  };

  // useEffect(() => {
  //   if (!chatItem?.id) {
  //     console.error("boxId is missing or invalid");
  //     return;
  //   }

  //   const handleDeleteMessage = ({ id: messageId }: PusherDelete) => {
  //     console.log("Successfully deleted message: ", messageId);
  //     setMessages((prevMessages) =>
  //       prevMessages.filter((msg) => msg.id !== messageId)
  //     );
  //   };

  //   const handleRevokeMessage = ({ id: messageId }: PusherRevoke) => {
  //     console.log("Successfully revoked message: ", messageId);
  //     setMessages((prevMessages) =>
  //       prevMessages.map((msg) =>
  //         msg.id === messageId ? { ...msg, flag: false } : msg
  //       )
  //     );
  //   };

  //   const channels: any[] = allChat.map((chat) => {
  //     const channel = pusherClient.subscribe(`private-${chat.id.toString()}`);
  //     channel.bind("delete-message", handleDeleteMessage);
  //     channel.bind("revoke-message", handleRevokeMessage);
  //     return channel;
  //   });

  //   // Hủy đăng ký khi component unmount hoặc khi allChat thay đổi
  //   return () => {
  //     channels.forEach((channel: any) => {
  //       channel.bind("delete-message", handleDeleteMessage);
  //       channel.bind("revoke-message", handleRevokeMessage);
  //     });
  //   };
  // }, [chatItem?.id, setMessages]);

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
      }}
    >
      <View className="flex flex-row items-center px-3 pt-3 pb-1 shadow-md">
        <View className="flex flex-row">
          <Link href="./message" className="pt-2 flex flex-row">
            <View className="pt-3">
              <ArrowIcon size={30} color={iconColor} />
            </View>
          </Link>
          <View className="flex-row items-center pb-2 gap-2">
            <Image
              source={
                chatItem?.avatarUrl
                  ? { uri: chatItem.avatarUrl }
                  : require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg") // Đảm bảo bạn có ảnh mặc định
              }
              style={{ width: 55, height: 55, borderRadius: 50 }}
            />

            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="text-[16px] font-medium"
            >
              {chatItem?.userName}
            </Text>
          </View>
        </View>
      </View>
      <View className="absolute flex flex-row right-2 top-5">
        <TouchableOpacity>
          <CallIcon size={28} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-2">
          <VideoCallIcon size={30} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-2"
          onPress={() => setModalVisible(true)}
        >
          <InfoIcon size={30} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: "#D9D9D9",
          width: "100%",
        }}
      />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        }}
      >
        {messages.map((message, index) => {
          const isCurrentUser = message.createBy === profile._id;
          const currentMessageDate = new Date(message.createAt);
          const previousMessageDate =
            index > 0 ? new Date(messages[index - 1].createAt) : null;

          const isFirstMessageOfDay =
            !previousMessageDate ||
            currentMessageDate.toDateString() !==
              previousMessageDate.toDateString();

          const hasFiles =
            message.contentId && message.contentId.url ? true : false;
          const hasText =
            message.text && message.text.length > 0 ? true : false;

          return (
            <View
              key={index}
              className={`mb-4 flex ${
                isCurrentUser
                  ? "justify-end items-end"
                  : "justify-start items-start"
              }`}
            >
              {isFirstMessageOfDay && (
                <View className="mx-auto">
                  <Text className="text-center text-light-600 mb-2">
                    {currentMessageDate.toLocaleDateString()}
                  </Text>
                </View>
              )}
              <View className="flex flex-row gap-2">
                {!isCurrentUser && (
                  <Image
                    source={
                      chatItem?.avatarUrl
                        ? { uri: chatItem.avatarUrl }
                        : require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg") // Đảm bảo bạn có ảnh mặc định
                    }
                    style={{ width: 40, height: 40, borderRadius: 50 }}
                  />
                )}
                <View
                  className={`max-w-[75%] p-3 ${
                    hasFiles && hasFiles && message.contentId.type === "Image"
                      ? "bg-white p-0" // Không áp dụng nền nếu là hình ảnh
                      : isCurrentUser
                      ? "bg-primary-100 text-white"
                      : colorScheme === "dark"
                      ? "bg-dark-400 text-white"
                      : "bg-light-800 text-black"
                  }`}
                  style={{
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}
                >
                  <Text
                    className={`font-regular text-[15px] ${
                      isCurrentUser
                        ? "text-white"
                        : colorScheme === "dark"
                        ? "text-dark-100"
                        : "text-light-500"
                    }`}
                  >
                    {!message.flag ? (
                      <p
                        className={` ${
                          isCurrentUser ? "text-white" : "text-gray-500"
                        } text-sm italic   `}
                      >
                        Tin nhắn đã được thu hồi
                      </p>
                    ) : (
                      <>
                        {/* Hiển thị text nếu không có file */}
                        {!hasFiles && (
                          <Text className="text-sm">{message.text}</Text>
                        )}

                        {/* Hiển thị file nếu contentId có dữ liệu */}
                        {hasFiles && (
                          <View className="">
                            {message.contentId.type === "Image" ? (
                              <Image
                                source={
                                  message.contentId?.url
                                    ? { uri: message.contentId.url }
                                    : require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg")
                                }
                                style={{
                                  width: screenWidth * 0.5, // Chiều rộng bằng 90% màn hình
                                  height:
                                    screenWidth *
                                      0.5 *
                                      (parseInt(message.contentId.height) /
                                        parseInt(message.contentId.width)) ||
                                    200, // Giữ tỷ lệ ảnh
                                  borderRadius: 12,
                                }}
                                resizeMode="contain" // Hoặc "cover" nếu bạn muốn ảnh phủ đầy
                              />
                            ) : (
                              <Text
                                style={{
                                  color: "#007bff",
                                  textDecorationLine: "underline",
                                  fontSize: 14,
                                }}
                                onPress={async () => {
                                  const downloadUrl = message.contentId.url;
                                  const fileName =
                                    message.contentId.fileName ||
                                    "downloaded_file";
                                  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

                                  try {
                                    const downloadResumable =
                                      FileSystem.createDownloadResumable(
                                        downloadUrl,
                                        fileUri,
                                        {},
                                        (downloadProgress) => {
                                          const progress =
                                            downloadProgress.totalBytesWritten /
                                            downloadProgress.totalBytesExpectedToWrite;
                                          console.log(
                                            `Progress: ${Math.round(
                                              progress * 100
                                            )}%`
                                          );
                                        }
                                      );

                                    const { uri } =
                                      await downloadResumable.downloadAsync();
                                    console.log("File downloaded to:", uri);

                                    if (Platform.OS === "android") {
                                      Alert.alert(
                                        "Download Complete",
                                        "File has been downloaded. What would you like to do?",
                                        [
                                          {
                                            text: "Open",
                                            onPress: () => shareAsync(uri),
                                          },
                                          {
                                            text: "Save",
                                            onPress: async () => {
                                              const permissions =
                                                await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                                              if (permissions.granted) {
                                                const base64 =
                                                  await FileSystem.readAsStringAsync(
                                                    uri,
                                                    {
                                                      encoding:
                                                        FileSystem.EncodingType
                                                          .Base64,
                                                    }
                                                  );
                                                await FileSystem.StorageAccessFramework.createFileAsync(
                                                  permissions.directoryUri,
                                                  fileName,
                                                  message.contentId.format ||
                                                    "application/octet-stream"
                                                )
                                                  .then(async (fileUri) => {
                                                    await FileSystem.writeAsStringAsync(
                                                      fileUri,
                                                      base64,
                                                      {
                                                        encoding:
                                                          FileSystem
                                                            .EncodingType
                                                            .Base64,
                                                      }
                                                    );
                                                    Alert.alert(
                                                      "File Saved Successfully!"
                                                    );
                                                  })
                                                  .catch((e) =>
                                                    console.error(e)
                                                  );
                                              } else {
                                                Alert.alert(
                                                  "Permission denied to save file."
                                                );
                                              }
                                            },
                                          },
                                          { text: "Cancel", style: "cancel" },
                                        ]
                                      );
                                    } else {
                                      shareAsync(uri);
                                    }
                                  } catch (e) {
                                    console.error(
                                      "Error during file download:",
                                      e
                                    );
                                    Alert.alert(
                                      "Download Error",
                                      "Failed to download the file. Please try again."
                                    );
                                  }
                                }}
                              >
                                {message.contentId.fileName || "Download File"}
                              </Text>
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <InfoChat item={chatItem} setModalVisible={setModalVisible} />
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <PlusIcon size={35} color={iconColor} />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            className={`flex-1 text-sm border rounded-full px-4`}
            onChangeText={setValue}
            value={value}
          />

          <TouchableOpacity>
            <SendIcon
              size={28}
              color={iconColor}
              onClick={handleSendTextMessage}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    marginBottom: 5,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Chat;
