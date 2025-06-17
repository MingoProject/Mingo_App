import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { ArrowIcon, PlusIcon } from "../components/shared/icons/Icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "../context/ThemeContext";
import { colors } from "../styles/colors";
import { getListChat } from "../lib/service/message.service";
import { getListGroupChat } from "../lib/service/message.service";
import RenderMessageItem from "@/components/forms/chat/RenderMessageItem";
import { useChatItemContext } from "@/context/ChatItemContext";
import { pusherClient } from "@/lib/pusher";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "expo-router/build/hooks";
import CreateGroupChat from "@/components/forms/chat/CreateGroupChat";
import debounce from "lodash.debounce";
import Input from "@/components/shared/ui/input";

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

  const fetchSearchResults = (text: string) => {
    console.log(`Searching for: ${text}`);
  };

  const debouncedSearch = useMemo(
    () => debounce((text: string) => fetchSearchResults(text), 300),
    []
  );
  const sortedChats = useMemo(() => {
    return [...allChat].sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp).getTime() -
        new Date(a.lastMessage.timestamp).getTime()
    );
  }, [allChat]);

  const handleSearch = useCallback(
    (text: string) => {
      const lowercasedText = text.toLowerCase();
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
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (id !== data.boxId) return;

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
        className="w-full p-4 h-full space-y-6"
        style={{
          paddingTop: Platform.OS === "android" ? 14 : 52,
          backgroundColor:
            colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
          flex: 1,
        }}
      >
        <View
          className="flex flex-row max-h-16"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[200] : colors.light[200], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <TouchableOpacity className="">
            <ArrowIcon size={28} color={iconColor} />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
              className="font-msemibold text-[18px] ml-1"
            >
              Messages
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center w-full px-2 flex-1">
          <View className="flex-1">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(text) => {
                setSearchText(text);
                handleSearch(text);
              }}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity onPress={() => setCreateGroup(true)}>
            <PlusIcon color={iconColor} size={40} />
          </TouchableOpacity>
        </View>

        <View className="">
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
              colorScheme === "dark" ? colors.dark[200] : colors.light[300],
            zIndex: 10,
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
