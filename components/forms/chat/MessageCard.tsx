import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import {
  FileContent,
  ItemChat,
  PusherDelete,
  PusherRevoke,
  ResponseMessageDTO,
} from "@/dtos/MessageDTO";
import { UserResponseDTO } from "@/dtos/UserDTO";
import { pusherClient } from "@/lib/pusher";
import { isLoading } from "expo-font";
import { useChatContext } from "@/context/ChatContext";
import { removeMessage, revokeMessage } from "@/lib/service/message.service";
import {
  DocTypeIcon,
  PdfTypeIcon,
  PlusIcon,
  PptTypeIcon,
  ThreeDotsIcon,
} from "@/components/shared/icons/Icons";
// import { Video, ResizeMode } from "expo-av";
import VideoPlayer from "../media/VideoPlayer";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import AudioPlayer from "../media/AudioPlayer";
import { openWebFile } from "@/lib/utils/File";
import { colors } from "@/styles/colors";
import { EndCallCard } from "./EndCallCard";

const MessageCard = ({
  message,
  isCurrentUser,
  isFirstMessageOfDay,
  chatItem,
  colorScheme,
  screenWidth,
}: {
  message: ResponseMessageDTO;
  isCurrentUser: boolean;
  isFirstMessageOfDay: boolean;
  chatItem?: ItemChat | null;
  colorScheme: any;
  screenWidth: any;
}) => {
  const currentMessageDate = new Date(message.createAt);
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const hasFiles = message.contentId && message.contentId.url ? true : false;
  const hasText = message.text && message.text.length > 0 ? true : false;
  const { messages, setMessages } = useChatContext();
  const [isModalVisible, setModalVisible] = useState(false); // Điều khiển việc hiển thị modal

  const numColumns = 4;
  const mediaSize = screenWidth / numColumns - 10;

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleDelete = async () => {
    try {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== message.id)
      );
      await removeMessage(message.id);
    } catch (error) {
      alert("Failed to delete chat. Please try again.");
    }
  };

  const handleRevoke = async () => {
    // Cập nhật giao diện trước để tạo phản hồi nhanh cho người dùng
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === message.id ? { ...msg, flag: false } : msg
      )
    );

    try {
      // Gửi yêu cầu lên server để cập nhật trạng thái thu hồi
      await revokeMessage(message.id);
    } catch (error) {
      alert("Failed to unsend. Please try again.");
    }
  };

  const handleEdit = async () => {
    // Cập nhật giao diện trước để tạo phản hồi nhanh cho người dùng
    console.log("da co revoke");
  };

  const renderFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "doc":
      case "docx":
        return <DocTypeIcon />;
      case "ppt":
      case "pptx":
        return <PptTypeIcon />;
      case "pdf":
        return <PdfTypeIcon />;
      default:
        return <DocTypeIcon />; // Fallback to a default icon
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
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
      }}
      onPress={async () => await openWebFile(item.url!)}
    >
      <View
        className="bg-light-300 dark:bg-dark-20 flex rounded-2xl items-center justify-center"
        style={{ width: mediaSize, height: mediaSize }}
      >
        {renderFileIcon(item.url?.split(".").pop()!)}
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

  return (
    <View
      className={`mb-4 flex ${
        isCurrentUser ? "justify-end items-end" : "justify-start items-start"
      }`}
    >
      {isFirstMessageOfDay && (
        <View className="mx-auto">
          <Text className="text-center font-mmedium text-light-600 mb-2">
            {currentMessageDate.toLocaleDateString()}
          </Text>
        </View>
      )}

      <View className="flex flex-row gap-1 items-center relative">
        {/* Biểu tượng 3 chấm nằm ngoài message, ở bên trái */}
        {isCurrentUser && (
          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              <ThreeDotsIcon
                size={16}
                color={
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500]
                }
              />
            </Text>
            {/* Bạn có thể thay đổi màu sắc của icon */}
          </TouchableOpacity>
        )}

        {!isCurrentUser && (
          <Image
            source={
              chatItem?.avatarUrl
                ? { uri: chatItem.avatarUrl }
                : require("../../../assets/images/default-user.png")
            }
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
        )}

        <View
          className={`max-w-[75%] p-3  ${
            hasFiles
              ? " p-0"
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
            // elevation: 2,
          }}
        >
          {/* Hiển thị modal với các hành động nếu isAction là true và người dùng là current user */}
          {isModalVisible && isCurrentUser && (
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={toggleModal}
            >
              <View className="flex-1 justify-center items-center">
                {/* Lớp nền mờ phía sau modal */}
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền mờ
                  }}
                  onPress={toggleModal} // Đóng modal khi nhấn ra ngoài
                />

                {/* Nội dung modal */}
                <View
                  className="bg-white rounded-lg"
                  style={{
                    width: 250,
                    padding: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 10, // Bóng mờ trên Android
                  }}
                >
                  {/* Nút đóng */}
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 1000,
                    }}
                  >
                    <Text
                      style={{ fontSize: 18, fontWeight: "bold" }}
                      className="text-primary-100 font-mmedium"
                    >
                      ×
                    </Text>
                  </TouchableOpacity>

                  {/* Các tùy chọn */}
                  <TouchableOpacity
                    className="flex items-center justify-center w-full h-[50px] font-mmedium border-b border-gray-200"
                    onPress={() => {
                      handleRevoke();
                      toggleModal();
                    }}
                  >
                    <Text className="text-center text-sm text-primary-100 font-mmedium">
                      Unsend
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex items-center justify-center w-full h-[50px] border-t border-gray-200"
                    onPress={() => {
                      handleDelete();
                      toggleModal();
                    }}
                  >
                    <Text className="text-center text-sm text-primary-100 font-mmedium">
                      Delete
                    </Text>
                  </TouchableOpacity>

                  {/* Tùy chọn Edit */}
                  {hasFiles && !isCurrentUser && (
                    <TouchableOpacity
                      className="flex items-center justify-center w-full h-[50px] border-t border-gray-200"
                      onPress={() => {
                        handleEdit();
                        toggleModal();
                      }}
                    >
                      <Text className="text-center text-sm text-primary-100 font-mmedium">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
          )}

          {/* Nếu tin nhắn đã bị thu hồi */}
          {!message.flag ? (
            <Text
              className={`${
                isCurrentUser ? "text-white" : "text-gray-500"
              } text-sm italic font-mmedium`}
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              Message unsent
            </Text>
          ) : (
            <>
              {/* Render message text properly inside Text component */}
              <Text
                className={`text-sm font-mregular ${
                  isCurrentUser ? "text-white" : "text-black"
                }`}
              >
                {message.text &&
                message.text.startsWith("//Cuoc goi ket thuc; time:") ? (
                  // Nếu tin nhắn là "Cuộc gọi kết thúc", hiển thị EndCallCard
                  <EndCallCard
                    duration={message.text.split("time:")[1].trim()}
                  />
                ) : (
                  // Hiển thị nội dung tin nhắn bình thường nếu không phải "Cuộc gọi kết thúc"
                  message.text
                )}
              </Text>
              {/* Display files */}
              {hasFiles && (
                <View>
                  {message.contentId.type === "Image" ? (
                    <Image
                      source={
                        message.contentId?.url
                          ? { uri: message.contentId.url }
                          : require("../../../assets/images/0dd7ef2b0c1abd4c1783b1878c4ae633.jpg")
                      }
                      style={{
                        width: screenWidth * 0.5,
                        height:
                          screenWidth *
                            0.5 *
                            (parseInt(message.contentId.height) /
                              parseInt(message.contentId.width)) || 200,
                        borderRadius: 12,
                      }}
                      resizeMode="contain"
                    />
                  ) : message.contentId.type === "Video" ? (
                    (() => {
                      const containerWidth = screenWidth * 0.5; // 50% màn hình
                      const aspectRatio =
                        parseInt(message.contentId.width) /
                        parseInt(message.contentId.height);

                      const videoHeight = Math.min(
                        containerWidth / aspectRatio,
                        200
                      ); // Giới hạn chiều cao tối đa là 200px
                      const videoWidth = videoHeight * aspectRatio; // Tính lại chiều rộng theo tỷ lệ

                      return (
                        <View
                          style={{
                            width: containerWidth,
                            height: videoHeight,
                            borderRadius: 12,
                            overflow: "hidden", // Giới hạn nội dung bên trong View
                            alignItems: "center", // Căn giữa nội dung
                            justifyContent: "center", // Căn giữa nội dung
                          }}
                          className="mb-6"
                        >
                          <VideoPlayer videoSource={message.contentId.url} />
                        </View>
                      );
                    })()
                  ) : message.contentId.type === "Audio" ? (
                    (() => {
                      return (
                        <View
                          style={{}}
                          className="w-fi flex justify-center pb-6"
                        >
                          <AudioPlayer
                            audioUri={message.contentId.url}
                            isSender={isCurrentUser}
                          />
                        </View>
                      );
                    })()
                  ) : message.contentId.type === "Other" ? (
                    <RenderFileItem item={message.contentId} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                      className="font-mregular"
                    >
                      This format is not supported.
                    </Text>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageCard;
