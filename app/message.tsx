import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { ArrowIcon, PlusIcon } from "../components/icons/Icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors"; // import màu sắc từ file colors.js
import { getAllChat, getListChat } from "../lib/service/message.service";
import { getListGroupChat } from "../lib/service/message.service";
import { useChatContext } from "../context/ChatContext";
import { ItemChat } from "@/dtos/MessageDTO";
import RenderMessageItem from "@/components/forms/chat/RenderMessageItem";
import { useChatItemContext } from "@/context/ChatItemContext";
import { pusherClient } from "@/lib/pusher";
import profile from "./(tabs)/profile";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";
import { isColor } from "react-native-reanimated";
import CreateGroupChat from "@/components/forms/chat/CreateGroupChat";

const Message = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const router = useRouter(); // Khởi tạo router
  const [selectedItem, setSelectedItem] = useState(null);
  const { allChat, setAllChat } = useChatItemContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { profile } = useAuth();
  const [userId, setUserId] = useState<string>(profile._id);
  const id = useSearchParams();
  const { filteredChat, setFilteredChat } = useChatItemContext();
  const channelRefs = useRef<any[]>([]);
  const [createGroup, setCreateGroup] = useState(false);

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

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (id !== data.boxId) return; // Kiểm tra đúng kênh
      // console.log(data.boxId);

      setAllChat((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                text: data.text || "",
                timestamp: new Date(data.createAt),
              },
            };
          }
          return chat;
        });

        const isNewChat = !updatedChats.find(
          (chat: any) => chat.id === data.boxId
        );
        if (isNewChat) {
          updatedChats.unshift({
            id: data.boxId,
            userName: data.userName || "Người dùng mới",
            avatarUrl: data.avatarUrl || "/assets/images/default-avatar.png",
            lastMessage: {
              id: "unique-id",
              createBy: "system",
              text: "",
              timestamp: new Date(data.createAt),
              status: false,
              contentId: {
                fileName: "",
                bytes: "",
                format: "",
                height: "",
                publicId: "",
                type: "",
                url: "",
                width: "",
              },
            },
            status: "active",
            isRead: false,
            senderId: profile._id,
            receiverId: data.receiverIds,
          });
        }

        return updatedChats.sort(
          (a: any, b: any) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );
      });

      setFilteredChat((prevFiltered) => {
        const updatedChats = prevFiltered.map((chat) => {
          if (chat.id === data.boxId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                text: data.text || "Đã gửi 1 file",
                timestamp: new Date(data.createAt),
              },
            };
          }
          return chat;
        });

        const isNewChat = !updatedChats.find((chat) => chat.id === data.boxId);
        if (isNewChat) {
          updatedChats.unshift({
            id: data.boxId,
            userName: data.userName || "Người dùng mới",
            avatarUrl: data.avatarUrl || "/assets/images/default-avatar.png",
            lastMessage: {
              id: "unique-id",
              createBy: "system",
              text: "",
              timestamp: new Date(data.createAt),
              status: false,
              contentId: {
                fileName: "",
                bytes: "",
                format: "",
                height: "",
                publicId: "",
                type: "",
                url: "",
                width: "",
              },
            },
            status: "active",
            isRead: false,
            senderId: profile._id,
            receiverId: data.receiverIds,
            groupName: data.groupName,
          });
        }

        return updatedChats.sort(
          (a: any, b: any) => b.lastMessage.timestamp - a.lastMessage.timestamp
        );
      });
    };

    // Đảm bảo hủy đăng ký kênh cũ
    channelRefs.current.forEach((channel) => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(channel.name);
    });

    // Đăng ký kênh mới
    const channels: any[] = allChat.map((chat) => {
      const channel = pusherClient.subscribe(`private-${chat.id.toString()}`);
      channel.bind("new-message", handleNewMessage); // Đảm bảo lại bind sự kiện
      return channel;
    });

    // Lưu lại các kênh đã đăng ký
    channelRefs.current = channels;

    // Hủy đăng ký khi component unmount hoặc khi allChat thay đổi
    return () => {
      channels.forEach((channel: any) => {
        channel.unbind("new-message", handleNewMessage);
        pusherClient.unsubscribe(channel.name); // Hủy đăng ký kênh
      });
    };
  }, [id, allChat]);

  const handleCloseCreateGroup = () => {
    setCreateGroup(false);
  };

  return (
    // <ScrollView
    //   style={{
    //     backgroundColor:
    //       colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
    //     flex: 1,
    //   }}
    //   className="px-3"
    // >
    //   <Link href="./home" style={{ color: "blue" }} className="flex flex-row">
    //     <View className="pt-3 ">
    //       <ArrowIcon size={30} color={"#FFAABB"} />
    //     </View>
    //     <View>
    //       <Text
    //         style={{
    //           color: colors.primary[100],
    //         }}
    //         className="font-semibold text-[17px] pb-1"
    //       >
    //         Home
    //       </Text>
    //     </View>
    //   </Link>
    //   <View className="mt-2 flex flex-row items-center gap-2">
    //     <TextInput
    //       placeholder="Find..."
    //       placeholderTextColor="#D9D9D9"
    //       className={` flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
    //         colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
    //       }`}
    //       editable={true}
    //       value={searchTerm}
    //       onChangeText={(text) => setSearchTerm(text)}
    //     />
    //     <TouchableOpacity className="mt-2" onPress={() => setCreateGroup(true)}>
    //       <PlusIcon color={iconColor} size={40} />
    //     </TouchableOpacity>
    //   </View>
    //   <View className="mt-4">
    //     {filteredChat.map((item) => (
    //       <RenderMessageItem item={item} key={item.id} itemUserId={userId} />
    //     ))}
    //   </View>
    //   {createGroup && <CreateGroupChat onClose={handleCloseCreateGroup} />}
    // </ScrollView>
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          flex: 1,
        }}
        className="px-3 mt-10"
      >
        {/* Content */}
        <Link
          href="./home"
          style={{ color: "blue" }}
          className="flex flex-row py-4"
        >
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
        <View className="mt-2 flex flex-row items-center gap-2">
          <TextInput
            placeholder="Find..."
            placeholderTextColor="#D9D9D9"
            className={` flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
              colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
            }`}
            editable={true}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <TouchableOpacity
            className="mt-2"
            onPress={() => setCreateGroup(true)}
          >
            <PlusIcon color={iconColor} size={40} />
          </TouchableOpacity>
        </View>
        <View className="mt-4">
          {filteredChat.map((item) => (
            <RenderMessageItem item={item} key={item.id} itemUserId={userId} />
          ))}
        </View>
      </ScrollView>

      {/* Absolute overlay */}
      {createGroup && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[700],
            zIndex: 10,
            padding: 16,
          }}
        >
          <CreateGroupChat
            onClose={() => setCreateGroup(false)}
            setAllChat={setAllChat}
            setFilteredChat={setFilteredChat}
          />
        </View>
      )}
    </View>
  );
};

export default Message;
