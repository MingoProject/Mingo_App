import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ArrowIcon } from "../components/icons/Icons";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors"; // import màu sắc từ file colors.js
import Chat from "./chat";
const Message = () => {
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
  const fakeData = [
    {
      id: 1,
      userId: "other_user_id_1", // ID của người dùng
      name: "Nguyễn Văn A",
      avatar:
        "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg",
      isActive: true,
      messages: [
        {
          id: 1,
          senderId: "other_user_id_1", // ID của người gửi
          receiverId: currentUser.userId, // ID của người nhận
          time: "2024-10-13T10:00:00Z",
          content: "Chào bạn! Bạn có rảnh không?",
        },
        {
          id: 2,
          senderId: currentUser.userId, // ID của người gửi
          receiverId: "other_user_id_1", // ID của người nhận
          time: "2024-10-13T10:05:00Z",
          content: "Có, mình có thể nói chuyện!",
        },
      ],
    },
    {
      id: 2,
      userId: "other_user_id_2", // ID của người dùng
      name: "Trần Thị B",
      avatar:
        "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg",
      isActive: false,
      messages: [
        {
          id: 1,
          senderId: "other_user_id_2", // ID của người gửi
          receiverId: currentUser.userId, // ID của người nhận
          time: "2024-10-12T14:00:00Z",
          content: "Mình đã gửi tài liệu cho bạn.",
        },
        {
          id: 2,
          senderId: currentUser.userId, // ID của người gửi
          receiverId: "other_user_id_2", // ID của người nhận
          time: "2024-10-12T14:30:00Z",
          content: "Bạn có nhận được không?",
        },
      ],
    },
    {
      id: 3,
      userId: "other_user_id_3", // ID của người dùng
      name: "Lê Văn C",
      avatar:
        "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg",
      isActive: true,
      messages: [
        {
          id: 1,
          senderId: currentUser.userId, // ID của người gửi
          receiverId: "other_user_id_3", // ID của người nhận
          time: "2024-10-13T09:15:00Z",
          content: "Bạn đã xem tài liệu mình gửi chưa?",
        },
        {
          id: 2,
          senderId: "other_user_id_3", // ID của người gửi
          receiverId: currentUser.userId, // ID của người nhận
          time: "2024-10-13T09:00:00Z",
          content: "Cảm ơn vì đã giúp đỡ hôm qua!",
        },
      ],
    },
    {
      id: 4,
      userId: "other_user_id_4", // ID của người dùng
      name: "Phạm Thị D",
      avatar:
        "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg",
      isActive: false,
      messages: [
        {
          id: 1,
          senderId: "other_user_id_4", // ID của người gửi
          receiverId: currentUser.userId, // ID của người nhận
          time: "2024-10-11T11:00:00Z",
          content: "Xin lỗi vì đã không phản hồi sớm.",
        },
        {
          id: 2,
          senderId: currentUser.userId, // ID của người gửi
          receiverId: "other_user_id_4", // ID của người nhận
          time: "2024-10-11T11:30:00Z",
          content: "Chúng ta có thể gặp nhau vào cuối tuần không?",
        },
      ],
    },
    {
      id: 5,
      userId: "other_user_id_5", // ID của người dùng
      name: "Nguyễn Văn E",
      avatar:
        "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg",
      isActive: true,
      messages: [
        {
          id: 1,
          senderId: "other_user_id_5", // ID của người gửi
          receiverId: currentUser.userId, // ID của người nhận
          time: "2024-10-13T08:00:00Z",
          content: "Nhớ mang laptop khi đi nhé!",
        },
        {
          id: 2,
          senderId: currentUser.userId, // ID của người gửi
          receiverId: "other_user_id_5", // ID của người nhận
          time: "2024-10-13T08:15:00Z",
          content: "Có ai muốn tham gia không?",
        },
      ],
    },
  ];
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const router = useRouter(); // Khởi tạo router
  const [selectedUser, setSelectedUser] = useState(null);
  const handleMessagePress = (item) => {
    // Cập nhật người dùng được chọn
    setSelectedUser(item);
    console.log(item.userId); // Đảm bảo item.userId không phải là undefined

    // Điều hướng đến trang chat với thông tin người dùng được chọn
    router.push(`/chat?userId=${item.userId}`); // Đường dẫn tới chat.jsx
  };

  const renderMessageItem = (item) => {
    const lastMessage = item.messages[item.messages.length - 1];
    //console.log("Last Message Sender ID:", lastMessage.senderId); // Log ID người gửi
    //console.log("Current User ID:", currentUser.userId); // Log ID người dùng hiện tại
    const messageTime = new Date(lastMessage.time);
    const timeString = `${messageTime.getHours()}:${messageTime.getMinutes()}`;
    const messagePrefix =
      lastMessage.senderId === currentUser.userId ? "Bạn: " : `${item.name}: `;

    return (
      <TouchableOpacity
        key={item.id}
        className="flex-row items-center py-2"
        onPress={() => handleMessagePress(item)}
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="ml-3 flex-1">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className={`text-[16px] font-mmedium `}
          >
            {item.name}
          </Text>
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
              flex: 1,
            }}
            className={`text-[15px] font-mregular w-[290px]`}
            numberOfLines={1} // Giới hạn chỉ một dòng
            ellipsizeMode="tail"
          >
            {messagePrefix}
            {lastMessage.content}
          </Text>
        </View>
        <View className="flex-col items-end">
          <Text className="text-gray-500">{timeString}</Text>
          {item.isActive && (
            <View className="w-3 h-3 bg-green-500 rounded-full mt-1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
      className="px-3"
    >
      <Link href="/home" style={{ color: "blue" }} className="flex flex-row">
        <View className="pt-3 ">
          <ArrowIcon size={30} color={"#FFAABB"} />
        </View>

        <View>
          <Text
            style={{
              color: colors.primary[100],
            }}
            className="font-msemibold text-[17px] pb-1"
          >
            Home
          </Text>
        </View>
      </Link>
      <View className="mt-2">
        <TextInput
          placeholder="Tìm kiếm..."
          placeholderTextColor="#D9D9D9"
          className={` flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
            colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
          }`}
          editable={true}
        />
      </View>
      <View className="mt-4">
        {fakeData.map((item) => renderMessageItem(item))}
      </View>
      {/* {selectedUser && (
        <Chat userId={selectedUser.userId} /> // Truyền userId vào component Chat
      )} */}
    </ScrollView>
  );
};

export default Message;
