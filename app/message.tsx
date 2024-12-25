import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { ArrowIcon, PlusIcon } from "../components/icons/Icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, router, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors"; // import màu sắc từ file colors.js
import { getListChat } from "../lib/service/message.service";
import { getListGroupChat } from "../lib/service/message.service";
import RenderMessageItem from "@/components/forms/chat/RenderMessageItem";
import { useChatItemContext } from "@/context/ChatItemContext";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "expo-router/build/hooks";
import CreateGroupChat from "@/components/forms/chat/CreateGroupChat";
import { debouncedSearch } from "@/lib/untils/declarations";
import debounce from "lodash.debounce";

const Message = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const { allChat, setAllChat } = useChatItemContext();
  const [searchText, setSearchText] = useState("");
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
  }, [setAllChat, setFilteredChat, allChat]);

  useEffect(() => {
    fetchChats();
  }, [setAllChat]);

  // Handle search results
  const fetchSearchResults = (text: string) => {
    console.log(`Searching for: ${text}`);
  };

  // Debounce search function
  const debouncedSearch = useMemo(
    () => debounce((text: string) => fetchSearchResults(text), 300),
    []
  );

  // Filter sorted chats
  const sortedChats = useMemo(() => {
    return [...allChat].sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime()
    );
  }, [allChat]);

  // Handle search input change and filtering
  const handleSearch = useCallback(
    (text: string) => {
      const lowercasedText = text.toLowerCase();
      // Lọc allChat theo groupName
      const filtered = allChat.filter((chat) =>
        chat.groupName.toLowerCase().includes(lowercasedText)
      );
      setFilteredChat(filtered);
    },
    [allChat]
  );

  useEffect(() => {
    debouncedSearch(searchText);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);

  // Handle new messages and update chats
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
            groupName: data.groupName,
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

    // Set up new message subscription
    channelRefs.current.forEach((channel) => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(channel.name);
    });

    const channels: any[] = allChat.map((chat) => {
      const channel = pusherClient.subscribe(`private-${chat.id.toString()}`);
      channel.bind("new-message", handleNewMessage);
      return channel;
    });

    channelRefs.current = channels;

    return () => {
      channels.forEach((channel: any) => {
        channel.unbind("new-message", handleNewMessage);
        pusherClient.unsubscribe(channel.name);
      });
    };
  }, [id, allChat, profile._id, setAllChat, setFilteredChat]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScrollView
        style={{
          marginTop: Platform.OS === "android" ? 0 : 12, // Android: 0, iOS: 10
          backgroundColor:
            colorScheme === "dark" ? colors.dark[300] : colors.light[700],
          flex: 1,
        }}
        className="px-3"
      >
        <View className="flex flex-row items-center w-full px-2 mt-6">
          {/* Nút quay lại */}
          <TouchableOpacity className="pr-2" onPress={() => router.back()}>
            <ArrowIcon size={30} color={"#FFAABB"} />
          </TouchableOpacity>

          {/* TextInput và nút Thêm */}
          <View className="flex-1 flex flex-row items-center space-x-2">
            <TextInput
              placeholder="Find..."
              placeholderTextColor="#D9D9D9"
              className={`flex-1 h-[42px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
                colorScheme === "dark" ? "bg-dark-200" : "bg-light-800"
              }`}
              style={{
                borderWidth: 1, // Thêm borderWidth nếu cần
                borderColor:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng borderColor thay vì borderBlockColor
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              editable={true}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text); // Cập nhật giá trị tìm kiếm
                handleSearch(text); // Gọi hàm tìm kiếm
              }}
            />
            <TouchableOpacity onPress={() => setCreateGroup(true)}>
              <PlusIcon color={iconColor} size={40} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          {filteredChat.map((item) => (
            <RenderMessageItem item={item} key={item.id} itemUserId={userId} />
          ))}
        </View>
      </ScrollView>

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
