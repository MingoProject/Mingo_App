import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
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
} from "../../icons/Icons"; // Đảm bảo đường dẫn đúng
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { FileContent, ItemChat } from "@/dtos/MessageDTO";
import {
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

const getAllImagesFromChat = (chatMessages: FileContent[]) => {
  return chatMessages.filter((message) => message.type === "Image");
};

const getAllVideosFromChat = (chatMessages: FileContent[]) => {
  return chatMessages.filter((message) => message.type === "Video");
};

const InfoChat = ({
  item,
  setModalVisible,
  setRelation,
}: {
  item: any;
  setModalVisible: (visible: boolean) => void;
  setRelation: any;
}) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [notification, setNotification] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext(); // State lưu trữ các cuộc trò chuyện đã lọc
  const { id } = useLocalSearchParams();
  const toggleNotification = () => {
    setNotification((prev) => !prev);
  };
  const router = useRouter(); // Khởi tạo router
  const [messages, setMessages] = useState<FileContent[]>([]);
  const [videoList, setVideoList] = useState<FileContent[]>([]);
  const [files, setFiles] = useState<FileContent[]>([]);
  const [isReport, setIsReport] = useState(false);

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
        const data = await getOrtherList(item.id.toString()); // Gọi API
        if (isMounted && data) {
          setFiles(data); // Lưu dữ liệu file từ API
        }
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [item.id.toString()]);

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getImageList(item.id.toString()); // Gọi API
        if (isMounted && data) {
          setMessages(data); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }

      try {
        const data = await getVideoList(item.id.toString()); // Gọi API
        if (isMounted && data) {
          setVideoList(data); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    myChat();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [item.id.toString()]);

  const imagesInChat = getAllImagesFromChat(messages);
  const videosInChat = getAllVideosFromChat(videoList);

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
              Alert.alert("Xóa đoạn chat thành công");

              if (combinedChats.length >= 0) {
                const firstChat = combinedChats[0];
                router.push(`./message/${firstChat.id}`); // Điều hướng sang chat đầu tiên
              } else {
                router.push("/message"); // Nếu không còn chat, điều hướng về trang tin nhắn chính
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      alert("Xóa chat thất bại. Vui lòng thử lại.");
    }
  };

  const handleBlockChat = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (!item && !userId) return;
    try {
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
              // Kiểm tra xem receiverId và senderId có tồn tại hay không
              if (!item?.receiverId || !item?.senderId) {
                alert("Lỗi: Không có ID người nhận hoặc người gửi.");
                return;
              }

              // Tạo đối tượng params theo kiểu FriendRequestDTO
              const params: FriendRequestDTO = {
                sender: item.senderId || null, // Nếu senderId là undefined, sử dụng null
                receiver: item.receiverId || null, // Nếu receiverId là undefined, sử dụng null
              };

              await block(params, token); // Gọi API block
              setRelation("blocked"); // Hoặc bạn có thể thay thế với giá trị mới mà bạn muốn

              Alert.alert("Block thành công!");
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      alert("Block chat thất bại. Vui lòng thử lại.");
    }
  };

  const handleProfileClick = () => {
    router.push(`/user/${item.receiverId}`); // Điều hướng sang chat đầu tiên
  };

  return (
    <>
      <View
        className="flex-1 mt-10"
        style={{
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
              Chi tiết
            </Text>
          </View>
        </View>

        <View className="justify-center mx-auto">
          <Image
            source={
              item.avatarUrl
                ? { uri: item.avatarUrl }
                : require("../../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")
            }
            style={{ width: 70, height: 70, borderRadius: 50 }}
          />
        </View>

        <View className="flex justify-center h-12">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className={`text-[18px] text-center font-mmedium mt-2`}
          >
            {item.userName}
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
              Trang cá nhân
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
              {notification ? "Tắt thông báo" : "Bật thông báo"}
            </Text>
          </View>

          <View className="h-20 justify-center items-center w-24">
            <TouchableOpacity
              className="ml-2 items-center justify-center w-10 h-10 rounded-full "
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800],
              }}
            >
              <SearchIcon size={28} color={iconColor} />
            </TouchableOpacity>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[12px] text-center font-mregular`}
            >
              Tìm kiếm
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
              Phương tiện
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllImages(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row mt-3 mx-10">
          {imagesInChat.slice(0, 4).map((url, index) => (
            <Image
              key={index}
              source={{ uri: url.url }}
              className="w-20 h-20 rounded-md mr-2"
            />
          ))}
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
              File
            </Text>
            <TouchableOpacity
              onPress={() => setShowAllFiles(true)}
              className="ml-auto"
            >
              <Text className="text-primary-100 text-sm text-right mr-5">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row mt-3 mx-10">
          {files.slice(0, 2).map((file, index) => (
            <View
              className={`flex-1 flex-row h-[32px] mb-2 items-center font-mregular px-4 mx-8 rounded-lg text-sm border border-[#D9D9D9] ${
                colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
              }`}
              key={index}
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[200] : colors.light[800], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
            >
              <FileIcon size={28} color={iconColor} />
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                  flex: 1,
                }}
                className={`text-[14px] ml-1 font-mmedium `}
              >
                {file.fileName}
              </Text>
            </View>
          ))}
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
              Báo cáo
            </Text>
          </TouchableOpacity>
        </View>
        <View className="ml-5 mt-5">
          <TouchableOpacity className="flex flex-row" onPress={handleBlockChat}>
            <BlockIcon size={28} color={iconColor} />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className={`text-[16px] ml-3 mt-1 font-mregular`}
            >
              Chặn
            </Text>
          </TouchableOpacity>
        </View>
        <View className="ml-5 mt-5">
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
              Xóa đoạn chat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
                className="mt-3"
              >
                <ArrowIcon size={30} color={"#FFAABB"} />
              </TouchableOpacity>
              <View>
                <Text
                  style={{ color: colors.primary[100] }}
                  className="font-msemibold text-[17px] mt-4 ml-1"
                >
                  Phương tiện
                </Text>
              </View>
            </View>
            <FlatList
              data={imagesInChat}
              className="mt-5"
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.url }}
                  className="w-28 h-28 rounded-md mb-2" // Kích thước hình ảnh
                />
              )}
              numColumns={3} // Hiển thị 3 hình trong 1 hàng
              columnWrapperStyle={{ justifyContent: "space-between" }} // Căn chỉnh các cột
            />
            <TouchableOpacity
              onPress={() => setShowAllImages(false)}
              className="mt-2 bg-primary-100 rounded p-2"
            >
              <Text className="text-white text-center font-mmedium">Đóng</Text>
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
                Files
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
              data={files}
              className="h-[700px]"
              renderItem={({ item }) => (
                <View
                  className={`flex-1 flex-row h-[50px] mb-2 items-center font-mregular px-4  rounded-lg text-sm border border-[#D9D9D9] ${
                    colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
                  }`}
                  style={{
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.dark[200]
                        : colors.light[800], // Sử dụng giá trị màu từ file colors.js
                    flex: 1,
                  }}
                >
                  <FileIcon size={28} color={iconColor} />
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                      flex: 1,
                    }}
                    className={`text-[14px] ml-1 font-mmedium `}
                  >
                    {item.fileName}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.publicId}
            />
            <View className="justify-end mt-auto ">
              <TouchableOpacity
                onPress={() => setShowAllFiles(false)}
                className="mt-4 bg-primary-100 rounded-full py-2"
              >
                <Text className="text-white text-center font-mmedium">
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
