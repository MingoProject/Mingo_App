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
import { useChatItemContext } from "@/context/ChatItemContext";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { pickMedia } from "@/lib/untils/GalleryPicker";
import MessageCard from "@/components/forms/chat/MessageCard";

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
  // const [isRecording, setIsRecording] = useState(false); // Để theo dõi trạng thái ghi âm
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL của file audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Để lưu MediaRecorder instance
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentContentType, setCurrentContentType] = useState<
    "text" | "voice" | "file" | null
  >(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [relation, setRelation] = useState<string>("");

  // const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [selectedMedia, setSelectedMedia] = useState<
    { uri: string; type: string; name: string | null | undefined }[]
  >([]);

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

  const handlePickMedia = async () => {
    const media = await pickMedia();
    setCurrentContentType("file");
    setSelectedMedia((prev) => [...prev, ...media]);
  };

  const handleTextInput = (text: any) => {
    setValue(text);
    setCurrentContentType("text");
  };

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
        // await handleSendVoiceMessage();
        break;
      case "file":
        await handleSendMultipleFiles(selectedMedia);
        break;
      default:
        console.log("No content to send");
    }
    // Reset trạng thái sau khi gửi
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

  const handleSendMultipleFiles = async (
    files: { uri: string; type: string; name: string | undefined | null }[]
  ) => {
    const storedToken = await AsyncStorage.getItem("token");
    if (!storedToken) return;
    try {
      console.log("files: ", files);
      if (files.length != 0) {
        for (const file of files) {
          const formData = new FormData();
          const fileContent: any = {
            fileName: file.name,
            url: "",
            publicId: "",
            bytes: "",
            width: "0",
            height: "0",
            format: file.name?.split(".").pop(),
            type: file.type,
          };
          let newFile = null;
          if (
            file.type === "image" ||
            file.type === "video" ||
            file.type === "audio"
          ) {
            newFile = {
              uri: file.uri,
              type: "image/jpeg",
              name: file.name,
            };
          } else {
            console.log("type: ", file.name?.split(".").pop());
            const tempUri = await prepareFileForUpload(file.uri, file.name!);
            console.log("prepare uri: ", tempUri);
            newFile = {
              uri: tempUri,
              type: file.name?.split(".").pop(),
              name: file.name,
            };
          }
          formData.append("boxId", id.toString());
          formData.append("content", JSON.stringify(fileContent));
          formData.append("file", newFile as any);

          try {
            const storedToken = await AsyncStorage.getItem("token");
            if (!storedToken) return;

            const response = await sendMessage(formData);
            console.log("Message sent successfully:", response);
          } catch (error) {
            console.error("Error sending message: ", error);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
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

  useEffect(() => {
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    // console.log(messages, "this is message");
    const handleNewMessage = (data: ResponseMessageDTO) => {
      console.log("Successfully received message: ", data);
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      setMessages((prevMessages) => {
        return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
      });
    };

    const handleDeleteMessage = ({ id: messageId }: PusherDelete) => {
      console.log("Successfully deleted message: ", messageId);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    };

    const handleRevokeMessage = ({ id: messageId }: PusherRevoke) => {
      console.log("Successfully revoked message: ", messageId);
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

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Cuộn khi `messages` thay đổi

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
        <InfoChat item={chatItem} setModalVisible={setModalVisible} />
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inputContainer} className="gap-2 flex">
          <TouchableOpacity>
            <PlusIcon size={27} color={iconColor} onClick={handleIconClick} />
          </TouchableOpacity>
          <TouchableOpacity>
            <CameraIcon size={27} color={iconColor} onClick={handlePickMedia} />
          </TouchableOpacity>
          <TouchableOpacity>
            <ImageIcon size={25} color={iconColor} onClick={handlePickMedia} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MicroIcon
              size={25}
              color={iconColor}
              // onClick={recording ? stopRecording : startRecording}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            className={`flex-1 text-sm border rounded-full px-4`}
            onChangeText={handleTextInput}
            value={value}
          />

          <TouchableOpacity>
            <SendIcon size={28} color={iconColor} onClick={handleSend} />
          </TouchableOpacity>
          <View>
            {selectedFiles.map((file, index) => (
              <Text key={index}>{file.name}</Text>
            ))}
          </View>
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
