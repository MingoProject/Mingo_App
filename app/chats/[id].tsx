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
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useChatContext } from "../../context/ChatContext";
import {
  getAllChat,
  getListChat,
  getListGroupChat,
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
import { FileContent, ItemChat, ResponseMessageDTO } from "@/dtos/MessageDTO";
import { FindUserDTO } from "@/dtos/UserDTO";
import { getFileFormat } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pusherClient } from "@/lib/pusher";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";

const Chat = () => {
  const { messages, setMessages } = useChatContext();
  const { profile } = useAuth();
  const { colorScheme } = useTheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [temporaryToCloudinaryMap, setTemporaryToCloudinaryMap] = useState<
    { tempUrl: string; cloudinaryUrl: string }[]
  >([]);
  const [allChat, setAllChat] = useState<ItemChat[]>([]);
  const [user, setUser] = useState<FindUserDTO | null>(null);
  const { width: screenWidth } = Dimensions.get("window");
  // Fetch danh sách chat khi component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Lấy danh sách chat thường
        const normalChats = await getListChat();
        // Lấy danh sách group chat
        const groupChats = await getListGroupChat();

        // Kết hợp cả hai danh sách
        const combinedChats = [...normalChats, ...groupChats];
        setAllChat(combinedChats); // Cập nhật danh sách chat
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };
    fetchChats();
  }, []);

  if (!allChat) {
    return <Text>Loading chat...</Text>;
  }

  const chatItem = allChat.find((chat) => chat.id === id);

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        if (!id) return;
        const data = await getAllChat(id.toString()); // API call with the correct `id`
        if (isMounted && data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    myChat();

    return () => {
      isMounted = false;
    };
  }, [id, setMessages]);

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

  const handleSendTextMessage = async () => {
    // Tạo đối tượng SegmentMessageDTO
    console.log("davo handle");
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

    console.log(formData, "this is form data");
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

  const handleSendMultipleFiles = async (files: File[]) => {
    if (!files.length || !id) return;

    const storedToken = await AsyncStorage.getItem("token");
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

  useEffect(() => {
    if (!id) {
      console.error("boxId is missing or invalid");
      return;
    }

    const handleNewMessage = (data: ResponseMessageDTO) => {
      console.log("Successfully received message: ", data);

      setMessages((prevMessages) => {
        return [...prevMessages, data]; // Thêm tin nhắn mới vào mảng
      });
    };

    console.log(`Đang đăng ký kênh private-${id}`);
    pusherClient.subscribe(`private-${id}`);
    console.log(`Đã đăng ký thành công kênh private-${id}`);

    pusherClient.bind("new-message", handleNewMessage);
    pusherClient.bind("pusher:subscription_error", (error: any) => {
      console.log("Subscription error:", error);
    });
    // Cleanup function to unsubscribe and unbind when component unmounts or boxId changes
    return () => {
      pusherClient.unsubscribe(`private-${id}`);
      pusherClient.unbind("new-message", handleNewMessage);
      console.log(`Unsubscribed from private-${id} channel`);
    };
  }, [id, setMessages]); // Re-run if boxId or setMessages changes

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
          <Link href="/message" className="pt-2 flex flex-row">
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
          const hasFiles = message.contentId && message.contentId.length > 0;
          return (
            <View
              key={message.id}
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
                    hasFiles &&
                    message.contentId.some((file) => file.type === "Image")
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
                    {/* Hiển thị text nếu không có file */}
                    {!hasFiles &&
                      message.text.map((text, index) => (
                        <Text key={index} className="text-sm">
                          {text}
                        </Text>
                      ))}

                    {/* Hiển thị file nếu contentId có dữ liệu */}
                    {hasFiles &&
                      message.contentId.map((file, index) => (
                        <View key={index} className="">
                          {file.type === "Image" ? (
                            <Image
                              source={
                                file?.url
                                  ? { uri: file.url }
                                  : require("../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg")
                              }
                              style={{
                                width: screenWidth * 0.5, // Chiều rộng bằng 90% màn hình
                                height:
                                  screenWidth *
                                    0.5 *
                                    (parseInt(file.height) /
                                      parseInt(file.width)) || 200, // Giữ tỷ lệ ảnh
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
                                const downloadUrl = file.url;
                                const fileName =
                                  file.fileName || "downloaded_file";
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
                                                file.format ||
                                                  "application/octet-stream"
                                              )
                                                .then(async (fileUri) => {
                                                  await FileSystem.writeAsStringAsync(
                                                    fileUri,
                                                    base64,
                                                    {
                                                      encoding:
                                                        FileSystem.EncodingType
                                                          .Base64,
                                                    }
                                                  );
                                                  Alert.alert(
                                                    "File Saved Successfully!"
                                                  );
                                                })
                                                .catch((e) => console.error(e));
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
                              {file.fileName || "Download File"}
                            </Text>
                          )}
                        </View>
                      ))}
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
            onChangeText={(text) => setValue(text)}
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
