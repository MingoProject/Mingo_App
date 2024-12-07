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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors";
// import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useChatContext } from "../context/ChatContext";
import { getAllChat } from "../lib/service/message.service";

// import { format, isToday } from "date-fns";
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
} from "../components/icons/Icons";
import InfoChat from "../components/forms/chat/InfoChat";
import { useAuth } from "../context/AuthContext";

const Chat = (item) => {
  // Destructure item from the props correctly
  const { messages, setMessages } = useChatContext();
  const { profile } = useAuth();
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);
  const currentDate = new Date();

  const id = item?.id; // Assuming `item` is an object that contains `id`
  const avatarUrl = item?.avatarUrl
    ? item.avatarUrl
    : require("../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg");
  const formatMessageTime = (messageDate) => {
    const isSameDay = currentDate.toDateString() === messageDate.toDateString();
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  console.log(id, "this is id");

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getAllChat(id); // API call with the correct `id`
        if (isMounted && data.success) {
          setMessages(data.messages); // Update the state with the messages
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    if (id) {
      // Make sure id is available before making the API call
      myChat();
    }

    return () => {
      isMounted = false; // Cleanup when component unmounts
    };
  }, [id, setMessages]); // Add id and setMessages as dependencies

  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className=" flex flex-row items-center px-3 pt-3 pb-1 shadow-md">
        <View className="flex flex-row">
          <Link href="/message" className="pt-2 flex flex-row">
            <View className="pt-3">
              <ArrowIcon size={30} color={iconColor} />
            </View>

            {/* <View className="w-10"></View> */}
          </Link>
          <View className="flex-row items-center pb-2">
            <Image
              source={avatarUrl}
              style={{ width: 70, height: 70, borderRadius: 50 }}
            />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
              className={`text-[16px] font-mmedium `}
            >
              {item?.userName}
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
          const isNextMessageFromSameUser =
            index < messages.length - 1 &&
            messages[index + 1].createBy === message.createBy;

          const currentMessageDate = new Date(message.createAt);
          const previousMessageDate =
            index > 0 ? new Date(messages[index - 1].createAt) : null;

          // Kiểm tra xem tin nhắn hiện tại có phải là tin nhắn đầu tiên của ngày hay không
          const isFirstMessageOfDay =
            !previousMessageDate || // Tin nhắn đầu tiên trong danh sách
            currentMessageDate.toDateString() !==
              previousMessageDate.toDateString(); // Ngày hiện tại khác với ngày trước đó

          return (
            <View
              key={message.id}
              className={`mb-4 flex ${
                isCurrentUser
                  ? "justify-end items-end"
                  : "justify-start items-start"
              }`}
            >
              {/* Hiển thị ngày nếu là tin nhắn đầu tiên của ngày */}
              {isFirstMessageOfDay && (
                <View className="mx-auto">
                  <Text className="text-center text-light-600 mb-2">
                    {currentMessageDate.toLocaleDateString()}
                  </Text>
                </View>
              )}

              <View className="flex flex-row">
                {!isCurrentUser && (
                  <Image
                    source={
                      item.avatarUrl
                        ? { uri: item.avatarUrl }
                        : require("../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")
                    }
                    style={{ width: 70, height: 70, borderRadius: 50 }}
                  />
                )}
                {isCurrentUser && (
                  <View className="justify-end items-end">
                    <Text className="text-xs text-light-600 mb-1 mr-1">
                      {formatMessageTime(new Date(message.createAt))}
                    </Text>
                  </View>
                )}
                <View
                  className={`max-w-[75%] p-3 ${
                    isCurrentUser
                      ? "bg-primary-100 text-white"
                      : colorScheme === "dark"
                      ? "bg-dark-400 text-white"
                      : "bg-light-800 text-black"
                  }`}
                  style={{
                    borderRadius: isNextMessageFromSameUser ? 20 : 20,
                    borderTopLeftRadius: isCurrentUser ? 20 : 20,
                    borderTopRightRadius: isCurrentUser ? 20 : 20,
                    borderBottomLeftRadius:
                      isCurrentUser && !isNextMessageFromSameUser ? 20 : 20,
                    borderBottomRightRadius:
                      !isCurrentUser && !isNextMessageFromSameUser ? 20 : 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                  }}
                >
                  <Text
                    className={`font-mregular text-[15px] ${
                      isCurrentUser
                        ? "text-white"
                        : colorScheme === "dark"
                        ? "text-dark-100"
                        : "text-light-500"
                    }`}
                  >
                    {message.text?.map((text, index) => (
                      <Text key={index} className="text-sm">
                        {text}
                      </Text>
                    ))}
                  </Text>
                </View>
                {!isCurrentUser && (
                  <View className=" justify-end items-end mb-1 ml-1">
                    <Text className="text-xs text-light-600">
                      {formatMessageTime(new Date(message.createAt))}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <InfoChat item={item} setModalVisible={setModalVisible} />
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={80} // Điều chỉnh giá trị này nếu cần
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <PlusIcon size={35} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <CameraIcon size={35} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <ImageIcon size={28} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <MicroIcon size={28} color={iconColor} />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhập tin nhắn..."
            className={`flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 mx-2 rounded-full text-sm border border-[#D9D9D9] ${
              colorScheme === "dark" ? "bg-dark-200" : "bg-light-700"
            }`}
          />
          <TouchableOpacity className="pr-2 rounded-full">
            <SendIcon size={28} color={iconColor} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end", // Để đảm bảo View nằm ở dưới cùng
    marginBottom: 5,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20, // Cách xa đáy màn hình
    paddingHorizontal: 10,
    backgroundColor: (colorScheme) =>
      colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Màu nền tùy theo chủ đề
  },
});
export default Chat;
