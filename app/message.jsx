import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ArrowIcon } from "../components/icons/Icons";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors"; // import màu sắc từ file colors.js
import { getListChat } from "../lib/service/message.service";
import { getListGroupChat } from "../lib/service/message.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatProvider } from "../context/ChatContext";

const Message = () => {
  const { colorScheme } = useTheme();

  const router = useRouter(); // Khởi tạo router
  const [selectedItem, setSelectedItem] = useState(null);
  const [allChat, setAllChat] = useState([]);
  const [filteredChat, setFilteredChat] = useState([]); // State lưu trữ các cuộc trò chuyện đã lọc
  const [id, setId] = useState("");

  const fetchChats = async () => {
    try {
      // Lấy danh sách chat thường
      const normalChats = await getListChat();
      // Lấy danh sách group chat
      const groupChats = await getListGroupChat();
      const userId = await AsyncStorage.getItem("userId");
      setId(userId);
      // Kết hợp cả hai danh sách
      const combinedChats = [...normalChats, ...groupChats];
      setAllChat(combinedChats); // Cập nhật danh sách chat
      setFilteredChat(combinedChats); // Cập nhật danh sách chat đã lọc ban đầu
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleMessagePress = (item) => {
    // Cập nhật người dùng được chọn
    setSelectedItem(item);

    // Điều hướng đến trang chat với thông tin người dùng được chọn
    // router.push(`/chat?boxId=${item.id}`); // Đường dẫn tới chat.jsx
    router.push(`/chats/${item.id}`);
  };

  const renderMessageItem = (item) => {
    const timeString = `${item.lastMessage.timestamp.getHours()}:${item.lastMessage.timestamp.getMinutes()}`;
    const isReceiver = item.lastMessage.createBy !== id;
    return (
      <TouchableOpacity
        key={item.id}
        className="flex-row items-center py-2"
        onPress={() => handleMessagePress(item)}
      >
        <Image
          source={
            item.avatarUrl
              ? { uri: item.avatarUrl }
              : require("../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")
          }
          style={{ width: 70, height: 70, borderRadius: 50 }}
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
            {item.userName}
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
            {isReceiver ? (
              <>
                {item.userName.trim().split(" ").pop()}:{" "}
                {item.lastMessage.text.trim() !== ""
                  ? item.lastMessage.text
                  : "Đã gửi 1 file"}
              </>
            ) : (
              <>
                Bạn:{" "}
                {item.lastMessage.text.trim() !== ""
                  ? item.lastMessage.text
                  : "Đã gửi 1 file"}
              </>
            )}
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

  // Hàm lọc các cuộc trò chuyện theo tên
  const handleSearch = () => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Lọc các cuộc trò chuyện theo tên
    const filtered = allChat.filter((chat) =>
      chat.userName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredChat(filtered);
  };

  return (
    <ScrollView
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
      className="px-3 pt-12"
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
            className="font-semibold text-[17px] pb-1"
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
        {filteredChat.map((item) => renderMessageItem(item))}
      </View>
    </ScrollView>
  );
};

export default Message;
