import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import { CancelIcon } from "@/components/icons/Icons";
import { createMedia } from "@/lib/service/media.service";
import { PostCreateDTO } from "@/dtos/PostDTO";
import { createPost } from "@/lib/service/post.service";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import {
  createGroups,
  getListChat,
  getListGroupChat,
} from "@/lib/service/message.service";
import { router } from "expo-router";
import members from "pusher-js/types/src/core/channels/members";
import { RequestCreateGroup } from "@/dtos/MessageDTO";

const CreateGroupChat = ({
  onClose,
  setAllChat,
  setFilteredChat,
}: {
  onClose: () => void;
  setAllChat: any;
  setFilteredChat: any;
}) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(profile._id);
        const bffsData = await getMyBffs(profile._id);
        const combinedFriends = [...bffsData, ...friendsData];

        const uniqueFriends = combinedFriends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f._id === friend._id)
        );

        if (isMounted) {
          setFriends(uniqueFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, [profile._id]);

  const toggleTagFriend = (friend: any) => {
    setTaggedFriends((prev) => {
      if (prev.some((f) => f._id === friend._id)) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const groupData: RequestCreateGroup = {
        membersIds: taggedFriends.map((friend) => friend._id),
        groupName: location,
      };

      console.log(groupData, "groupdata nè");

      const newGroup = await createGroups(groupData);

      console.log("Creating new group:", newGroup);

      if (newGroup?.result?.newBox?.id) {
        // Điều hướng đến nhóm mới tạo
        router.push(`./chats/${newGroup.newBox.id}`);
      }

      //   if (newGroup) {
      //     const fetchChats = async () => {
      //       try {
      //         const normalChats = await getListChat();
      //         const groupChats = await getListGroupChat();

      //         const combinedChats = [...normalChats, ...groupChats];
      //         setAllChat(combinedChats);
      //         setFilteredChat(combinedChats);
      //       } catch (error) {
      //         console.error("Error loading chats:", error);
      //       }
      //     };
      //     fetchChats();
      //   }
      alert("Group created successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        padding: 4,
      }}
    >
      {/* Header */}
      <View className="flex flex-row pt-10 justify-between items-center pb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors["title-pink"],
          }}
          className="text-[20px] font-msemibold"
        >
          Create Group
        </Text>
        <TouchableOpacity onPress={onClose}>
          <CancelIcon size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Location Input */}
      <View>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-medium"
        >
          Group name
        </Text>
      </View>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Group name..."
        style={{
          borderWidth: 1,
          borderColor: colors.primary[100],
          borderRadius: 8,
          padding: 10,
          marginVertical: 12,
        }}
      />

      <View className="mb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-medium"
        >
          Members
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {friends.map((friend, index) => (
            <TouchableOpacity
              key={friend._id}
              onPress={() => toggleTagFriend(friend)}
              style={{
                backgroundColor: taggedFriends.includes(friend)
                  ? colors.primary[100]
                  : colors.light[600],
                borderRadius: 20,
                marginRight: 8,
                padding: 5,
              }}
              className="flex-row justify-center items-center mt-3"
            >
              <Image
                source={
                  friend?.avatar
                    ? { uri: friend.avatar } // URL ảnh của bạn bè
                    : require("../../../assets/images/default-user.png") // Ảnh mặc định
                }
                className="w-9 h-9 rounded-full"
              />
              <Text
                style={{
                  color: taggedFriends.includes(friend)
                    ? colors.dark[100]
                    : colors.light[500],
                }}
              >
                {friend.firstName} {friend.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Add Media */}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full py-3 mt-4 rounded-md mb-10"
        style={{
          backgroundColor: colors.primary[100],
        }}
      >
        <Text className="text-center text-white font-bold text-[16px]">
          Create group
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateGroupChat;
