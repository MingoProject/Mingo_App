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
  PusherDelete,
  PusherRevoke,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pusherClient } from "@/lib/pusher";
import * as FileSystem from "expo-file-system";
import { useChatItemContext } from "@/context/ChatItemContext";
import { pickMedia } from "@/lib/untils/GalleryPicker";
import MessageCard from "@/components/forms/chat/MessageCard";
import { checkRelation } from "@/lib/service/relation.service";
import { FriendRequestDTO } from "@/dtos/FriendDTO";
import { unblock } from "@/lib/service/friend.service";
import ReportCard from "@/components/card/report/ReportCard";
import MyInput from "@/components/share/MyInput";
import { pickDocument } from "@/lib/untils/DoucmentPicker";
import AudioRecorder from "@/components/forms/media/AudioRecorder";
import { useClickOutside } from "react-native-click-outside";
const Chat = () => {
  const [messages, setMessages] = useState<ResponseMessageDTO[]>([]); // Mảng tin nhắn
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
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [currentContentType, setCurrentContentType] = useState<
    "text" | "voice" | "file" | null
  >(null);
  const [relation, setRelation] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<
    { uri: string; type: string; name: string | null | undefined }[]
  >([]);
  const [isReport, setIsReport] = useState(false);
  const [isMicroOpen, setIsMicroOpen] = useState(false);

  const ref = useClickOutside<View>(() => {
    setIsMicroOpen(false);
  });

  const handleIsReport = () => {
    setIsReport(true);
  };

  const closeReport = () => {
    setIsReport(false);
  };

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
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getAllChat(chatItem?.id.toString() || ""); // Gọi API
        // console.log(data, "this is data of body");
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

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        // const userId = await AsyncStorage.getItem("userId");
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
      isMounted = false; // Cleanup khi component unmount
    };
  }, [chatItem?.receiverId]);

  const handlePickMedia = async () => {
    const media = await pickMedia();
    setSelectedMedia((prev) => [...prev, ...media]);
  };

  const handleTextInput = (text: any) => {
    setValue(text);
    setCurrentContentType("text");
  };

  const resetContent = () => {
    setValue("");
    setSelectedMedia([]);
  };

  const handleSend = async () => {
    if (currentContentType === "text") {
      await handleSendTextMessage();
    } else {
      await handleSendMultipleFiles(selectedMedia);
    }
    resetContent();
  };

  const prepareFileForUpload = async (fileUri: string, fileName: string) => {
    try {
      const newUri = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.copyAsync({
        from: fileUri,
        to: newUri,
      });
      return newUri;
    } catch (error) {
      console.error("Error preparing file:", error);
      throw error;
    }
  };

  const handlePickDocument = async () => {
    const document = await pickDocument();

    if (document) {
      setSelectedMedia((prev) => [
        ...prev,
        ...document.map((item) => ({
          ...item,
          type: item.type ?? "defaultType",
        })),
      ]);
    }
  };

  // const handleSendMultipleFiles = async (
  //   files: { uri: string; type: string; name: string | undefined | null }[]
  // ) => {
  //   const storedToken = await AsyncStorage.getItem("token");
  //   if (!storedToken) return;
  //   try {
  //     if (files.length != 0) {
  //       for (const file of files) {
  //         const formData = new FormData();
  //         const fileContent: any = {
  //           fileName: file.name,
  //           url: "",
  //           publicId: "",
  //           bytes: "",
  //           width: "0",
  //           height: "0",
  //           format: file.name?.split(".").pop(),
  //           type: file.type,
  //         };
  //         let newFile = null;
  //         if (
  //           file.type === "image" ||
  //           file.type === "video" ||
  //           file.type === "audio"
  //         ) {
  //           newFile = {
  //             uri: file.uri,
  //             type: "image/jpeg",
  //             name: file.name,
  //           };
  //         } else {
  //           const formData = new FormData();
  //           const fileType = file.name?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  //           const mimeType =
  //             fileType === "txt"
  //               ? "text/plain"
  //               : fileType?.startsWith("image")
  //               ? `image/${fileType.split("/")[1]}` // For images, e.g., "image/png"
  //               : fileType?.startsWith("video")
  //               ? `video/${fileType.split("/")[1]}` // For videos, e.g., "video/mp4"
  //               : `application/${fileType || "octet-stream"}`;
  //           console.log(mimeType, "mimeType");
  //           console.log(selectedMedia);
  //           console.log("type: ", mimeType);
  //           const tempUri = await prepareFileForUpload(file.uri, file.name!);
  //           console.log("prepare uri: ", tempUri);
  //           newFile = {
  //             uri: tempUri,
  //             type: mimeType,
  //             name: file.name,
  //           };
  //         }
  //         formData.append("boxId", id.toString());
  //         formData.append("content", JSON.stringify(fileContent));
  //         formData.append("file", newFile as any);

  //         try {
  //           const storedToken = await AsyncStorage.getItem("token");
  //           if (!storedToken) return;

  //           const response = await sendMessage(formData);
  //           console.log(response, "response");
  //         } catch (error) {
  //           console.error("Error sending message: ", error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //     throw error;
  //   }
  // };

  const handleSendMultipleFiles = async (
    files: { uri: string; type: string; name: string | undefined | null }[]
  ) => {
    const storedToken = await AsyncStorage.getItem("token");
    if (!storedToken) return;

    if (files.length === 0) return;

    try {
      for (const file of files) {
        const formData = new FormData();

        // File content object
        const fileContent = {
          fileName: file.name,
          url: "",
          publicId: "",
          bytes: "",
          width: "0",
          height: "0",
          format: file.name?.split(".").pop(),
          type: file.type,
        };

        const fileType = file.name?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
        let mimeType = "application/octet-stream"; // Default MIME type

        if (fileType === "txt") {
          mimeType = "text/plain";
        } else if (
          // Check for image types
          fileType?.match(/(jpeg|png|jpg|svg)/)
        ) {
          mimeType = `image/${fileType}`;
        } else if (fileType?.startsWith("mp4")) {
          mimeType = `video/mp4`; // Handle MP4 video files
        } else if (fileType?.startsWith("avi")) {
          mimeType = `video/avi`; // Handle AVI video files
        } else if (fileType?.startsWith("mkv")) {
          mimeType = `video/mkv`; // Handle MKV video files
        } else if (fileType?.startsWith("mp3")) {
          mimeType = `audio/mp3`; // Handle MP3 audio files
        } else if (fileType?.startsWith("wav")) {
          mimeType = `audio/wav`; // Handle WAV audio files
        } else if (fileType?.startsWith("ogg")) {
          mimeType = `audio/ogg`; // Handle OGG audio files
        }

        console.log(mimeType); // Output the determined MIME type

        console.log("file.name:", file.name);
        console.log("fileType", fileType);

        let newFile = null;

        // Prepare file based on type
        if (
          file.type === "image" ||
          file.type === "video" ||
          file.type === "audio"
        ) {
          newFile = {
            uri: file.uri,
            type: mimeType,
            name: file.name,
          };
        } else {
          const tempUri = await prepareFileForUpload(file.uri, file.name!);
          newFile = {
            uri: tempUri,
            type: mimeType,
            name: file.name,
          };
        }

        // Append to FormData
        formData.append("boxId", id.toString());
        formData.append("content", JSON.stringify(fileContent));
        formData.append("file", newFile as any);

        try {
          // Send the message
          const response = await sendMessage(formData);
          setSelectedMedia([]);
          console.log("Response:", response);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    } catch (error) {
      console.error("Error processing files:", error);
      throw error;
    }
  };

  const handleSendTextMessage = async () => {
    if (!value.trim()) return;

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
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  useEffect(() => {
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    // console.log(messages, "this is message");
    const handleNewMessage = (data: ResponseMessageDTO) => {
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      setMessages((prevMessages) => {
        return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
      });
    };

    const handleDeleteMessage = ({ id: messageId }: PusherDelete) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    };

    const handleRevokeMessage = ({ id: messageId }: PusherRevoke) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, flag: false } : msg
        )
      );
    };

    pusherClient.subscribe(`private-${id}`);
    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("delete-message", handleDeleteMessage);
    pusherClient.bind("revoke-message", handleRevokeMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });

    return () => {
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("delete-message", handleDeleteMessage);
      pusherClient.unbind("revoke-message", handleRevokeMessage);
      console.log(`Unsubscribed from private-${id} channel`);
    };
  }, []); // Re-run if boxId or setMessages changes

  const handleIconPress = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUnBlockChat = async (relation: string) => {
    const userId = await AsyncStorage.getItem("userId");

    if (!chatItem && !userId) return;

    try {
      const token = await AsyncStorage.getItem("token");

      const userId = await AsyncStorage.getItem("userId");

      // Tạo đối tượng params theo kiểu FriendRequestDTO
      const params = {
        sender: userId || null, // Nếu senderId là undefined, sử dụng null
        receiver: chatItem?.receiverId || null, // Nếu receiverId là undefined, sử dụng null
      };

      if (relation === "blocked") {
        await unblock(params, token);
        setRelation("stranger"); // Hoặc bạn có thể thay thế với giá trị mới mà bạn muốn
        Alert.alert("Unblock thành công!");
      } else {
        Alert.alert("Hiện tại đã là người lạ!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DefaultView = () => (
    <View className="flex flex-col items-center justify-center w-full h-full">
      <Text className="text-lg text-gray-600">
        Chọn một cuộc trò chuyện để bắt đầu.
      </Text>
      <Text className="text-sm text-gray-400">
        Không có cuộc trò chuyện nào được chọn.
      </Text>
    </View>
  );

  // Component khi bị chặn bởi người dùng
  const BlockedByView = () => (
    <View className="flex flex-col items-center justify-center w-full h-20 border-t border-border-color text-gray-700">
      <Text className="text-sm">
        Bạn không thể liên lạc với người dùng này.
      </Text>
    </View>
  );

  // Component khi bị người dùng chặn
  const BlockedView = () => (
    <View className="flex flex-col items-center justify-center w-full border-t border-border-color text-gray-700">
      <Text className="text-sm p-4 flex">Bạn đã chặn người dùng này.</Text>
      {/* Nút "Bỏ chặn" */}
      <TouchableOpacity
        style={[styles.button, styles.unblockButton]}
        className="flex  items-center justify-center w-fit  h-11"
        onPress={() => handleUnBlockChat(relation)}
      >
        <Text className="self-center w-14 justify-center">Bỏ chặn</Text>
      </TouchableOpacity>

      {/* Nút "Báo cáo" */}
      <TouchableOpacity
        style={[styles.button, styles.reportButton]}
        className="flex  items-center justify-center w-fit  h-11"
        onPress={handleIsReport}
      >
        <Text className="self-center w-14 justify-center text-white">
          Báo cáo
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (!chatItem) {
      return <DefaultView />;
    }

    switch (relation) {
      case "blockedBy":
        return <BlockedByView />;
      case "blocked":
        return <BlockedView />;
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Cuộn khi `messages` thay đổi

  return (
    <View
      className="flex-1 pt-12"
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
                  : require("../../assets/images/default-user.png") // Đảm bảo bạn có ảnh mặc định
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
        ref={scrollViewRef}
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

          return (
            <MessageCard
              key={index}
              message={message}
              isCurrentUser={isCurrentUser}
              isFirstMessageOfDay={isFirstMessageOfDay}
              chatItem={chatItem}
              colorScheme={colorScheme}
              screenWidth={screenWidth}
            />
          );
        })}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <InfoChat
          item={chatItem}
          setModalVisible={setModalVisible}
          setRelation={setRelation}
          relation={relation}
        />
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handlePickDocument}>
            <PlusIcon size={27} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickMedia}>
            <CameraIcon size={27} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickMedia}>
            <ImageIcon size={25} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MicroIcon
              size={25}
              color={iconColor}
              onClick={() => setIsMicroOpen(true)}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            className={`flex-1 text-sm border rounded-full px-4`}
            onChangeText={handleTextInput}
            value={value}
          />

          <TouchableOpacity onPress={handleSend}>
            <SendIcon size={28} color={iconColor} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View className="justify-end">{renderContent()}</View>

      {isReport && (
        <ReportCard
          onClose={closeReport}
          type="message"
          entityId={id.toString()}
          reportedId={chatItem?.receiverId || ""}
        />
      )}
      {isMicroOpen ? (
        <View ref={ref}>
          <AudioRecorder
            setSelectedMedia={(uri: string, type: string, name: string) =>
              setSelectedMedia([{ uri: uri, type: type, name }])
            }
          />
        </View>
      ) : null}
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },

  message: {
    fontSize: 14,
    color: "#4B5563", // Màu xám
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "70%",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10, // Khoảng cách giữa các nút
  },
  unblockButton: {
    backgroundColor: "#d6d9de", // Màu đỏ cho nút "Báo cáo"
  },
  reportButton: {
    backgroundColor: colors.primary[100], // Màu xanh dương cho nút "Bỏ chặn"
  },
  buttonText: {
    fontSize: 14,
    color: "white", // Màu chữ trắng cho các nút
    alignSelf: "center",
  },
});

export default Chat;
