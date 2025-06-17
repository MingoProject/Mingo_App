import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import { createGroups } from "@/lib/service/message.service";
import { router } from "expo-router";
import { RequestCreateGroup } from "@/dtos/MessageDTO";
import Button from "@/components/shared/ui/button";
import MyInput from "@/components/shared/ui/MyInput";

const CreateGroupChat = ({
  onClose,
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
      className="w-full p-4 h-full space-y-6"
      style={{
        paddingTop: Platform.OS === "android" ? 14 : 52,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="font-msemibold text-[24px]"
        >
          Create Group
        </Text>
        <Button
          title="Close"
          size="small"
          color="transparent"
          onPress={onClose}
        />
      </View>

      <View className="relative">
        <View
          className="absolute left-3 -top-2 flex flex-row items-center px-1 z-10"
          style={{
            backgroundColor:
              colorScheme === "dark" ? colors.dark[500] : colors.light[500],
          }}
        >
          <Text
            className="font-mregular text-[12px]"
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
          >
            Group name <Text style={{ color: "red" }}>*</Text>
          </Text>
        </View>
        <MyInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter group name"
          height={56}
          fontSize={14}
          fontFamily="Montserrat-Regular"
        />
      </View>

      <View className="mb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="text-[16px] font-medium font-msemibold"
        >
          Add members
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {friends.map((friend, index) => (
            <TouchableOpacity
              key={friend._id}
              onPress={() => toggleTagFriend(friend)}
              style={{
                backgroundColor: taggedFriends.includes(friend)
                  ? colors.primary[100]
                  : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[400],
                borderRadius: 100,
                marginRight: 8,
                padding: 7,
              }}
              className="flex-row justify-center items-center mt-3 "
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
                    ? "#FFFFFF"
                    : colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[100],
                }}
                className="font-mmedium ml-2"
              >
                {friend.firstName} {friend.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="">
        <Button
          title="Create Group"
          onPress={() => handleSubmit}
          fontColor={
            colorScheme === "dark" ? colors.dark[100] : colors.light[200]
          }
        />
      </View>
    </ScrollView>
  );
};

export default CreateGroupChat;
