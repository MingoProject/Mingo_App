import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import {
  ArrowIcon,
  UserIcon,
  NotificationIcon,
  NotificationOffIcon,
  SearchIcon,
  ImageIcon,
  FileIcon,
  ReportIcon,
  BlockIcon,
  TrashIcon,
  DocTypeIcon,
  PdfTypeIcon,
  PptTypeIcon,
  VideoIcon,
  PlusIcon,
} from "../../shared/icons/Icons"; // Đảm bảo đường dẫn đúng
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import {
  FileContent,
  FindMessageResponse,
  ItemChat,
  ResponseGroupMessageDTO,
} from "@/dtos/MessageDTO";
import {
  createGroup,
  findMessage,
  getImageList,
  getListChat,
  getListGroupChat,
  getOrtherList,
  getVideoList,
  removeChatBox,
} from "@/lib/service/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";
import { FriendRequestDTO } from "@/dtos/FriendDTO";
import { block } from "@/lib/service/friend.service";
import ReportCard from "@/components/card/report/ReportCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openWebFile } from "@/lib/utils/File";
import message from "@/app/message";
import VideoPlayer from "../media/VideoPlayer";
import ChangeAvatar from "./ChangeAvatar";
import debounce from "lodash.debounce";
import CreateGroupChat from "./CreateGroupChat";
import RenderMessageItem from "./RenderMessageItem";
import MessageCard from "./MessageCard";
import { useAuth } from "@/context/AuthContext";
const screenWidth = Dimensions.get("window").width;

const getAllImagesFromChat = (chatimageList: FileContent[]) => {
  return chatimageList.filter((message) => message.type === "Image");
};

const getAllVideosFromChat = (chatimageList: FileContent[]) => {
  return chatimageList.filter((message) => message.type === "Video");
};

const getAllFileFromChat = (chatimageList: FileContent[]) => {
  return chatimageList.filter((message) => message.type === "Other");
};

const InfoChat = ({
  item,
  setModalVisible,
  setRelation,
  relation,
  setGroupData,
}: {
  item: ItemChat | null;
  setModalVisible: (visible: boolean) => void;
  setRelation: any;
  relation: string;
  setGroupData: any;
}) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [notification, setNotification] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const { setAllChat } = useChatItemContext();
  const { setFilteredChat } = useChatItemContext(); // State lưu trữ các cuộc trò chuyện đã lọc
  const { id } = useLocalSearchParams();
  const toggleNotification = () => {
    setNotification((prev) => !prev);
  };
  const router = useRouter(); // Khởi tạo router
  const [imageList, setImageList] = useState<FileContent[]>([]);
  const [videoList, setVideoList] = useState<FileContent[]>([]);
  const [files, setFiles] = useState<FileContent[]>([]);
  const [isReport, setIsReport] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const numColumns = 4;
  const mediaSize = screenWidth / numColumns - 10;
  const containerWidth = screenWidth * 0.5; // 50% màn hình
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<ResponseGroupMessageDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { profile } = useAuth();

  const handleIsReport = () => {
    setIsReport(true);
  };

  const closeReport = () => {
    setIsReport(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFiles = async () => {
      try {
        const data = await getOrtherList(item?.id.toString() || id.toString()); // Gọi API
        const videodata = await getVideoList(
          item?.id.toString() || id.toString()
        ); // Gọi API
        const imagedata = await getImageList(
          item?.id.toString() || id.toString()
        ); // Gọi API
        if (isMounted && data) {
          setFiles(data); // Lưu dữ liệu file từ API
          setVideoList(videodata); // Lưu trực tiếp `imageList` từ API
          setImageList(imagedata); // Lưu trực tiếp `imageList` từ API
        }
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, []);

  const imagesInChat = getAllImagesFromChat(imageList);
  const videosInChat = getAllVideosFromChat(videoList);
  const fileInChat = getAllFileFromChat(files);

  console.log(videosInChat, "videosInChat");

  const handleDeleteChat = async () => {
    try {
      Alert.alert(
        "Delete Message", // Tiêu đề
        "Are you sure you want to delete this message?", // Nội dung
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              await removeChatBox(id?.toString() || "");

              // Lấy danh sách chat sau khi xóa
              const normalChats = await getListChat();
              const groupChats = await getListGroupChat();
              const combinedChats = [...normalChats, ...groupChats];

              // Cập nhật danh sách chat
              setAllChat(combinedChats);
              setFilteredChat(combinedChats);
              Alert.alert("Deleted successfully!");

              router.push("/message");
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      alert("Failed to delete chat.");
    }
  };

  const handleBlockChat = async (relation: string) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      Alert.alert(
        "Block Message", // Tiêu đề
        "Are you sure you want to block this message?", // Nội dung
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              const token = await AsyncStorage.getItem("token");

              // Tạo đối tượng params theo kiểu FriendRequestDTO
              const params = {
                sender: userId || item?.senderId || "", // Nếu senderId là undefined, sử dụng null
                receiver: item?.receiverId || "", // Nếu receiverId là undefined, sử dụng null
              };

              if (relation !== "block") {
                await block(params, token); // Gọi API block
                setRelation("blocked"); // Hoặc bạn có thể thay thế với giá trị mới mà bạn muốn
                Alert.alert("Block successfully!");
              } else {
                Alert.alert("User is already blocked!");
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      alert("Failed to block. Please try again.");
    }
  };

  const handleProfileClick = () => {
    router.push(`/user/${item?.receiverId}`); // Điều hướng sang chat đầu tiên
  };

  const renderFileIcon = (fileType: string, size: number) => {
    switch (fileType.toLowerCase()) {
      case "doc":
      case "docx":
        return <DocTypeIcon size={size} />;
      case "ppt":
      case "pptx":
        return <PptTypeIcon size={size} />;
      case "pdf":
        return <PdfTypeIcon size={size} />;
      default:
        return <DocTypeIcon size={size} />; // Fallback to a default icon
    }
  };

  const RenderFileItem = ({ item }: { item: FileContent }) => (
    <TouchableOpacity
      className={`flex items-center justify-center`}
      style={{
        width: mediaSize,
        margin: 5,
        borderRadius: 8,
        rowGap: 4,
      }}
      onPress={async () => await openWebFile(item.url!)}
    >
      <View className="bg-light-300 dark:bg-dark-20 flex rounded-2xl items-center justify-center gap-2">
        {renderFileIcon(item.url?.split(".").pop()!, 30)}
      </View>
      <View className="w-full flex justify-center">
        <View>
          <Text
            className={`text-[10px] ml-4 font-helvetica-bold`}
            numberOfLines={2}
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
            }}
          >
            {`${item.fileName}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RenderFileDetailItem = ({ item }: { item: FileContent }) => (
    <TouchableOpacity
      className={`flex flex-row w-full  items-center `}
      onPress={async () => await openWebFile(item.url!)}
    >
      <View className="bg-light-300 dark:bg-dark-20 flex flex-row p-6 rounded-2xl items-center  gap-2">
        {renderFileIcon(item.url?.split(".").pop()!, 50)}
        <View className="flex flex-row ">
          <Text
            className={`text-[14px] font-helvetica-bold`}
            numberOfLines={2}
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
            }}
          >
            {`${item.fileName}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Fetch messages whenever query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        setLoading(true);
        findMessage(item?.id || "", query)
          .then((result: FindMessageResponse) => {
            if (result.success && Array.isArray(result.messages)) {
              const filteredMessages = result.messages.filter(
                (message) =>
                  Array.isArray(message.contentId) &&
                  message.contentId.length === 0
              );
              setMessages(filteredMessages);
            } else {
              setMessages([]);
            }
            console.log(result.messages, "Fetched messages");
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setMessages([]);
      }
    }, 500); // Delay để giảm số lần gọi API không cần thiết

    return () => clearTimeout(delayDebounceFn);
  }, [query, item?.id]);
  const fetchSearchResults = (text: string) => {
    console.log(`Searching for: ${text}`);
  };

  // Debounce search function
  const debouncedSearch = useMemo(
    () => debounce((text: string) => fetchSearchResults(text), 300),
    []
  );
  // Handle search input change
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const handleSearch = useCallback(
    (text: string) => {
      const lowercasedText = text.toLowerCase();

      // Filter messages array safely
      const filtered = messages.filter(
        (chat) =>
          typeof chat.text === "string" &&
          chat.text.toLowerCase().includes(lowercasedText)
      );

      setMessages(filtered);
    },
    [messages]
  );

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 4 : 32, // Giữ nguyên giá trị pt-4
          paddingBottom: Platform.OS === "android" ? 10 : 10, // Giữ nguyên giá trị pb-10
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        }}
      >
        <View className="flex flex-row">
          <TouchableOpacity
            className="pt-3"
            onPress={() => setModalVisible(false)}
          >
            <ArrowIcon size={30} color={"#FFAABB"} />
          </TouchableOpacity>
          <View>
            <Text
              style={{ color: colors.primary[100] }}
              className="font-msemibold text-[17px] mt-4 ml-1"
            >
              Detail
            </Text>
          </View>
        </View>

        <View className="justify-center mx-auto">
          {item && (
            <>
              {item?.groupName === item?.userName ? (
                <Image
                  source={
                    item.avatarUrl
                      ? { uri: item.avatarUrl }
                      : require("../../../assets/images/default-user.png")
                  }
                  style={{ width: 70, height: 70, borderRadius: 50 }}
                />
              ) : (
                <ChangeAvatar groupData={item} setGroupData={setGroupData} />
              )}
            </>
          )}
        </View>

        <View className="flex justify-center h-12">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className={`text-[18px] text-center font-mmedium mt-2`}
          >
            {item?.groupName}
          </Text>
        </View>

        <View className="flex flex-row mx-auto">
          <View className="justify-center items-center w-28">
            <TouchableOpacity
              className="items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
              onPress={handleProfileClick}
            >
              <UserIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              Profile
            </Text>
          </View>

          <View className="h-20 justify-center items-center w-24">
            <TouchableOpacity
              className="ml-2 items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
              onPress={toggleNotification}
            >
              {notification ? (
                <NotificationIcon size={30} color={iconColor} />
              ) : (
                <NotificationOffIcon size={30} color={iconColor} />
              )}
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              {notification ? "Turn off" : "Notifications"}
            </Text>
          </View>

          <View className="h-20 justify-center items-center w-24">
            <TouchableOpacity
              className="ml-2 items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
              onPress={() => setIsSearch(true)}
            >
              <SearchIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center ml-3 font-mregular`}
            >
              Find
            </Text>
          </View>
        </View>

        <View className="mt-3 ml-5">
          <View className="flex flex-row">
            <ImageIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Images
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllImages(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5 font-mregular">
                More images
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row mt-3 mx-10">
          {/* Hiển thị ảnh */}
          {imagesInChat.slice(0, 4).map((url, index) => (
            <Image
              key={index}
              source={{ uri: url.url }}
              className="w-20 h-20 rounded-md mr-2"
            />
          ))}
        </View>

        <View className="mt-3 ml-5">
          <View className="flex flex-row">
            <VideoIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Videos
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllVideos(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right font-mregular mr-5">
                More videos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row mt-3 mx-10">
          {videosInChat.slice(0, 2).map((url, index) => {
            // Giả sử bạn đã có thông tin chiều rộng và chiều cao của video trong url.width và url.height
            const aspectRatio = parseInt(url.width) / parseInt(url.height); // Sử dụng url.width và url.height thay cho message.contentId

            const videoHeight = Math.min(containerWidth / aspectRatio, 200); // Giới hạn chiều cao tối đa là 200px
            const videoWidth = videoHeight * aspectRatio; // Tính lại chiều rộng theo tỷ lệ

            return (
              <View
                key={index}
                style={{
                  width: 90, // Sử dụng videoWidth thay vì containerWidth để đảm bảo tỷ lệ đúng
                  height: 90,
                  borderRadius: 12,
                  overflow: "hidden", // Giới hạn nội dung bên trong View
                  alignItems: "center", // Căn giữa nội dung
                  justifyContent: "center", // Căn giữa nội dung
                }}
                className="mb-6 mr-2"
              >
                <VideoPlayer videoSource={url.url} />
              </View>
            );
          })}
        </View>

        <View className="ml-5 mt-5">
          <View className="flex flex-row">
            <FileIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Files
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllFiles(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5 font-mregular">
                More files
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row justify-center items-center mx-10">
          {fileInChat.slice(0, 4).map((file, index) => {
            // Giả sử bạn đã có thông tin chiều rộng và chiều cao của video trong url.width và url.height
            return (
              <View
                key={index}
                style={{
                  width: 80, // Sử dụng videoWidth thay vì containerWidth để đảm bảo tỷ lệ đúng
                  height: 80,
                  borderRadius: 12,
                  overflow: "hidden", // Giới hạn nội dung bên trong View
                  alignItems: "center", // Căn giữa nội dung
                  justifyContent: "flex-start", // Căn giữa nội dung
                }}
                className="mt-3"
              >
                <View className="mt-2">
                  <RenderFileItem item={file} />
                </View>
              </View>
            );
          })}
        </View>

        <View className="ml-5 mt-5">
          <TouchableOpacity className="flex flex-row" onPress={handleIsReport}>
            <ReportIcon size={30} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Report
            </Text>
          </TouchableOpacity>
        </View>
        <View className="ml-5 mt-5">
          <TouchableOpacity
            className="flex flex-row"
            onPress={() => handleBlockChat(relation)}
          >
            <BlockIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Block
            </Text>
          </TouchableOpacity>
        </View>
        <View className="ml-5 mt-5 pb-10">
          <TouchableOpacity
            className="flex flex-row"
            onPress={handleDeleteChat}
          >
            <TrashIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        className="p-10"
        visible={showAllImages}
        onRequestClose={() => setShowAllImages(false)}
      >
        <View
          className="flex-1 "
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex-1 rounded-t-lg p-4"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <View
              className="flex flex-row pt-5 max-h-20"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowAllImages(false)}
                className=""
              >
                <ArrowIcon size={30} color={"#FFAABB"} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{ color: colors.primary[100] }}
                  className="font-msemibold text-[17px] mt-1 h-7 ml-1"
                >
                  Back
                </Text>
              </View>
            </View>
            <FlatList
              data={imagesInChat}
              className=""
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    padding: 6,
                    paddingTop: 0,
                  }}
                >
                  <Image
                    source={{ uri: item.url }}
                    className="w-28 h-28 rounded-md  " // Kích thước hình ảnh
                  />
                </View>
              )}
              numColumns={3} // Hiển thị 3 hình trong 1 hàng
            />
            <TouchableOpacity
              onPress={() => setShowAllImages(false)}
              className="mt-2 bg-primary-100 rounded p-2"
            >
              <Text className="text-white text-center font-mmedium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        className="p-10"
        visible={showAllVideos}
        onRequestClose={() => setShowAllVideos(false)}
      >
        <View
          className="flex-1 "
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex-1 rounded-t-lg p-4"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <View
              className="flex flex-row pt-5 max-h-20"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowAllVideos(false)}
                className="mt-3"
              >
                <ArrowIcon size={30} color={"#FFAABB"} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{ color: colors.primary[100] }}
                  className="font-msemibold text-[17px] mt-4 ml-1"
                >
                  Back
                </Text>
              </View>
            </View>
            <FlatList
              data={videosInChat}
              className="mt-5"
              renderItem={({ item }) => {
                // Giả sử video có width và height, tính toán kích thước video
                const aspectRatio =
                  parseInt(item.width) / parseInt(item.height);
                const videoHeight = Math.min(containerWidth / aspectRatio, 200); // Giới hạn chiều cao tối đa là 200px
                const videoWidth = videoHeight * aspectRatio; // Tính lại chiều rộng theo tỷ lệ

                return (
                  <View
                    key={item.url}
                    style={{
                      width: 170,
                      height: 190,
                      borderRadius: 12,
                      overflow: "hidden",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 6,
                      marginRight: 6,
                    }}
                  >
                    <VideoPlayer videoSource={item.url} />
                    {/* Hiển thị video */}
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2} // Hiển thị 2 video trong mỗi hàng
              columnWrapperStyle={{ justifyContent: "space-between" }} // Căn chỉnh các cột
            />
            <TouchableOpacity
              onPress={() => setShowAllVideos(false)}
              className="mt-2 bg-primary-100 rounded p-2 "
            >
              <Text className="text-white text-center font-mmedium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showAllFiles}
        onRequestClose={() => setShowAllFiles(false)}
      >
        <View
          className="flex-1 p-4"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View
            className="flex flex-row pt-5 max-h-16"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAllFiles(false)}
              className="mt-3"
            >
              <ArrowIcon size={30} color={"#FFAABB"} />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <Text
                style={{ color: colors.primary[100] }}
                className="font-msemibold text-[17px] mt-4 ml-1"
              >
                Back
              </Text>
            </View>
          </View>
          <View
            className="w-full  rounded-lg py-5 px-1"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
          >
            <FlatList
              data={fileInChat}
              className="h-[700px]"
              renderItem={({ item }) => (
                <View className="w-full  items-start justify-center ">
                  <RenderFileDetailItem item={item} />
                </View>
              )}
              numColumns={1} // Hiển thị một file trong mỗi hàng
              keyExtractor={(item, index) => index.toString()}
            />
            <View className="justify-end mt-auto ">
              <TouchableOpacity
                onPress={() => setShowAllFiles(false)}
                className="mt-4 bg-primary-100 rounded-full py-2"
              >
                <Text className="text-white text-center font-mmedium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={false}
        animationType="none"
        visible={isSearch}
        onRequestClose={() => setShowAllFiles(false)}
      >
        <View style={{ flex: 1, position: "relative" }}>
          <ScrollView
            style={{
              paddingTop: Platform.OS === "android" ? 4 : 32, // Giữ nguyên giá trị pt-4
              paddingBottom: Platform.OS === "android" ? 10 : 10,
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700],
              flex: 1,
            }}
            className="px-3 mt-0"
          >
            <View className="flex flex-row py-4">
              <TouchableOpacity
                onPress={() => setIsSearch(false)}
                className="pt-2 pr-1 flex flex-row"
              >
                <ArrowIcon size={30} color={"#FFAABB"} />
              </TouchableOpacity>
              <TextInput
                placeholder="Find..."
                placeholderTextColor="#D9D9D9"
                className={` flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
                  colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
                }`}
                style={{
                  borderWidth: 1, // Thêm borderWidth nếu cần
                  borderColor:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng borderColor thay vì borderBlockColor
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                editable={true}
                value={query}
                onChangeText={(text) => {
                  setQuery(text); // Cập nhật giá trị tìm kiếm
                  handleSearch(text); // Gọi hàm tìm kiếm
                }}
              />
            </View>
            <View className="mt-4">
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
                    chatItem={item || null}
                    colorScheme={colorScheme}
                    screenWidth={screenWidth}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {isReport && (
        <ReportCard
          onClose={closeReport}
          type="message"
          entityId={id.toString()}
          reportedId={item?.receiverId || ""}
        />
      )}
    </>
  );
};

export default InfoChat;
