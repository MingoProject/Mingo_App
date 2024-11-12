import React, { useState } from "react";
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

const Chat = () => {
  //   const router = useRouter();

  //   // Kiểm tra router và router.query
  //   useEffect(() => {
  //     if (router && router.query) {
  //       const { userId } = router.query;
  //       console.log("User ID:", userId);
  //     } else {
  //       console.log("Router or query is not defined yet.");
  //     }
  //   }, [router]);
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);
  const currentDate = new Date();
  const formatMessageTime = (messageDate) => {
    const isSameDay = currentDate.toDateString() === messageDate.toDateString();
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentUser = {
    userId: "652c02b2fc13ae1c41000002",
    username: "john_doe",
    fullname: "John Doe",
    numberphone: "0123456789",
    email: "john.doe@example.com",
    birthday: new Date("1990-01-01"),
    gender: "male",
    password: "securepassword",
    avatar: require("../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
    background: require("../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
    address: "123 Main Street, New York, NY",
    job: "Software Engineer",
    hobbies: ["coding", "reading", "travelling"],
    bio: "ರ ‿ ರ.  A passionate developer who loves to build things.",
    nickName: "Johnny",
    friends: [
      {
        name: "Jane Smith",
        avatar: require("../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
      {
        name: "Alice Johnson",
        avatar: require("../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
      {
        name: "Bob Brown",
        avatar: require("../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
    ],
    bestFriends: [
      { name: "Jane Smith", avatar: "https://example.com/avatar/jane.jpg" },
      { name: "Bob Brown", avatar: "https://example.com/avatar/bob.jpg" },
    ],
    following: [
      { name: "Chris Evans", avatar: "https://example.com/avatar/chris.jpg" },
      { name: "Emily Davis", avatar: "https://example.com/avatar/emily.jpg" },
    ],
    block: [
      { name: "Tom Hanks", avatar: "https://example.com/avatar/tom.jpg" },
    ],
    isAdmin: false,
  };
  const fakeData = {
    id: 1,
    userId: "other_user_id_1",
    name: "Nguyễn Văn A",
    avatar:
      "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg",
    messages: [
      {
        id: 1,
        senderId: "other_user_id_1",
        receiverId: currentUser.userId,
        time: "2024-10-13T10:00:00Z",
        content: "Chào bạn! Bạn có rảnh không?",
      },
      {
        id: 2,
        senderId: currentUser.userId,
        receiverId: "other_user_id_1",
        time: "2024-10-13T10:05:00Z",
        content: "Có, mình có thể nói chuyện!",
      },
      {
        id: 3,
        senderId: "other_user_id_1",
        receiverId: currentUser.userId,
        time: "2024-10-13T10:10:00Z",
        content: "Tốt quá! Mình muốn hỏi bạn một số câu hỏi về dự án.",
      },
      {
        id: 4,
        senderId: currentUser.userId,
        receiverId: "other_user_id_1",
        time: "2024-10-13T10:12:00Z",
        content: "Chắc chắn rồi! Bạn có thể hỏi ngay.",
      },
      {
        id: 5,
        senderId: "other_user_id_1",
        receiverId: currentUser.userId,
        time: "2024-10-13T10:15:00Z",
        content: "Mình muốn biết về công nghệ mà bạn đang sử dụng.",
      },
      {
        id: 6,
        senderId: currentUser.userId,
        receiverId: "other_user_id_1",
        time: "2024-10-13T10:20:00Z",
        content: "Mình đang sử dụng React Native để phát triển ứng dụng.",
      },
      {
        id: 7,
        senderId: "other_user_id_1",
        receiverId: currentUser.userId,
        time: "2024-10-13T10:25:00Z",
        content: "Nghe có vẻ thú vị! Bạn có gặp khó khăn gì không?",
      },
      {
        id: 8,
        senderId: currentUser.userId,
        receiverId: "other_user_id_1",
        time: "2024-10-14T10:30:00Z",
        content: "Có vài vấn đề nhỏ, nhưng mình đã tìm ra cách giải quyết.",
      },
    ],
  };

  // const pickImage = async () => {
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (permissionResult.granted === false) {
  //     alert("Permission to access camera roll is required!");
  //     return;
  //   }
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   // Kiểm tra xem người dùng đã chọn hình ảnh chưa
  //   if (!result.canceled) {
  //     setSelectedImage(result.assets[0].uri); // Lưu đường dẫn hình ảnh đã chọn
  //   }
  // };

  return (
    <View
      className="flex-1 "
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className=" flex flex-row items-center justify-between px-3 pt-3 pb-1 shadow-md">
        <View className="flex flex-row">
          <Link href="/message" className="pt-2 flex flex-row">
            <View className="pt-3">
              <ArrowIcon size={30} color={iconColor} />
            </View>

            {/* <View className="w-10"></View> */}
          </Link>
          <View className="flex-row items-center pb-2">
            <Image
              source={{ uri: fakeData.avatar }}
              className="w-12 h-12 rounded-full mr-2"
            />
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
                flex: 1,
              }}
              className={`text-[16px] font-mmedium `}
            >
              {fakeData.name}
            </Text>
          </View>
        </View>

        <View className="flex flex-row ml-auto">
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
        {fakeData.messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.userId;
          const isNextMessageFromSameUser =
            index < fakeData.messages.length - 1 &&
            fakeData.messages[index + 1].senderId === message.senderId;

          const currentMessageDate = new Date(message.time);
          const previousMessageDate =
            index > 0 ? new Date(fakeData.messages[index - 1].time) : null;

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
                    source={{ uri: fakeData.avatar }}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                {isCurrentUser && (
                  <View className="justify-end items-end">
                    <Text className="text-xs text-light-600 mb-1 mr-1">
                      {formatMessageTime(new Date(message.time))}
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
                    {message.content}
                  </Text>
                </View>
                {!isCurrentUser && (
                  <View className=" justify-end items-end mb-1 ml-1">
                    <Text className="text-xs text-light-600">
                      {formatMessageTime(new Date(message.time))}
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
        <InfoChat fakeData={fakeData} setModalVisible={setModalVisible} />
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
