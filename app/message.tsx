import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ArrowIcon } from "../components/icons/Icons";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors"; // import màu sắc từ file colors.js
import { getAllChat, getListChat } from "../lib/service/message.service";
import { getListGroupChat } from "../lib/service/message.service";
import { useChatContext } from "../context/ChatContext";
import { ItemChat } from "@/dtos/MessageDTO";
import RenderMessageItem from "@/components/forms/chat/RenderMessageItem";
import { useChatItemContext } from "@/context/ChatItemContext";

const Message = () => {
  const { colorScheme } = useTheme();

  const router = useRouter(); // Khởi tạo router
  const [selectedItem, setSelectedItem] = useState(null);
  const { allChat, setAllChat } = useChatItemContext();
  const [filteredChat, setFilteredChat] = useState<ItemChat[]>([]); // State lưu trữ các cuộc trò chuyện đã lọc
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChats = useCallback(async () => {
    try {
      const [normalChats, groupChats] = await Promise.all([
        getListChat(),
        getListGroupChat(),
      ]);
      const combinedChats = [
        ...(normalChats || []),
        ...(groupChats || []),
      ].sort((a, b) => {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      });

      setAllChat(combinedChats);
      setFilteredChat(combinedChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, [setAllChat, setFilteredChat]);

  useEffect(() => {
    fetchChats();
  }, []);

  const handleMessagePress = (item: any) => {
    // Cập nhật người dùng được chọn
    setSelectedItem(item);
    // Điều hướng đến trang chat với thông tin người dùng được chọn
    // router.push(`/chat?boxId=${item.id}`); // Đường dẫn tới chat.jsx
    router.push(`./chats/${item.id}`);
  };

  // Hàm lọc các cuộc trò chuyện theo tên
  const handleSearch = (text: string) => {
    const searchValue = text;
    setSearchTerm(searchValue);

    // Filter the chats by username
    const filtered = allChat.filter((chat) =>
      chat.userName.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort the filtered chats by lastMessage timestamp (createAt)
    const sortedFilteredChats = filtered.sort((a, b) => {
      const timestampA = new Date(a.lastMessage.timestamp).getTime();
      const timestampB = new Date(b.lastMessage.timestamp).getTime();
      return timestampB - timestampA; // Sorting in descending order
    });

    setFilteredChat(sortedFilteredChats);
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
      <Link href="./home" style={{ color: "blue" }} className="flex flex-row">
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
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <View className="mt-4">
        {filteredChat.map((item) => (
          <RenderMessageItem item={item} key={item.id} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Message;
