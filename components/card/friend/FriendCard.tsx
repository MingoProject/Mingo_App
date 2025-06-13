import React from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  acceptAddBff,
  acceptAddFriend,
  unBFF,
  unblock,
  unfollowOrRefuseFriendRequest,
  unfriend,
} from "@/lib/service/friend.service";
import { useAuth } from "@/context/AuthContext";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "@/lib/service/notification.service";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import Button from "@/components/shared/ui/button";

const FriendCard = ({ item, actionButton, setData }: any) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const backgroundButton = colorScheme === "dark" ? "#ffffff" : "#000000";
  backgroundButton;
  const { profile } = useAuth();
  const renderActionButtons = () => {
    switch (actionButton) {
      case "friend":
        return (
          <>
            <Button size="small" title="Chat" fontColor={colors.light[200]} />
            <Button
              title="Unfriend"
              size="small"
              color={
                colorScheme === "dark" ? colors.dark[400] : colors.light[400]
              }
              onPress={() => handleAction("unfriend")}
            />
          </>
        );
      case "bestfriend":
        return (
          <>
            <Button size="small" title="Chat" fontColor={colors.light[200]} />
            <Button
              title="Unbff"
              size="small"
              color={
                colorScheme === "dark" ? colors.dark[400] : colors.light[400]
              }
              onPress={() => handleAction("unbestfriend")}
            />
          </>
        );
      case "following":
        return (
          <>
            <Button size="small" title="Chat" fontColor={colors.light[200]} />
            <Button
              title="Unfollow"
              size="small"
              color={
                colorScheme === "dark" ? colors.dark[400] : colors.light[400]
              }
              onPress={() => handleAction("unfollow")}
            />
          </>
        );
      case "follower":
        return (
          <>
            <Button
              size="small"
              title="Accept"
              onPress={() => handleAction("accept")}
              fontColor={colors.light[200]}
            />
            <Button
              title="Refuse"
              size="small"
              color={
                colorScheme === "dark" ? colors.dark[400] : colors.light[400]
              }
              onPress={() => handleAction("refuse")}
            />
          </>
        );
      case "block":
        return (
          <Button
            fontColor={colors.light[200]}
            title="Unblock"
            size="large"
            onPress={() => handleAction("unblock")}
          />
        );
      case "suggested":
        return (
          <Button
            fontColor={colors.light[200]}
            title="Add friend"
            size="large"
            onPress={() => handleAction("add friend")}
          />
        );
      default:
        return null;
    }
  };

  const handleAction = async (action: any) => {
    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    const params = {
      sender: profile._id,
      receiver: item._id,
    };
    switch (action) {
      case "friend":
        // Handle "Add Friend" action
        Alert.alert(
          "Add Friend",
          `You have added ${item.firstName} as a friend.`
        );
        break;
      case "unfriend":
        await unfriend(params, token);
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      case "bestfriend":
        // Handle "Add Best Friend" action
        Alert.alert(
          "Add Best Friend",
          `You have added ${item.firstName} as a best friend.`
        );
        break;
      case "unbestfriend":
        await unBFF(params, token);
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      case "following":
        // Handle "Follow" action
        Alert.alert("Follow", `You are now following ${item.firstName}.`);
        break;
      case "unfollow":
        await unfollowOrRefuseFriendRequest(
          {
            sender: profile._id,
            receiver: item._id,
          },
          token
        );
        try {
          const notification = await getNotification(
            profile._id,
            item._id,
            "friend_request"
          );
          await deleteNotification(notification._id, token);
        } catch (error) {
          console.error("Error fetching notification:", error);
        }
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      case "accept":
        await acceptAddFriend(
          {
            sender: item._id,
            receiver: profile._id,
          },
          token
        );
        try {
          const notification = await getNotification(
            item._id,
            profile._id,
            "friend_request"
          );
          await deleteNotification(notification._id, token);
        } catch (error) {
          console.error("Error fetching notification:", error);
        }

        await createNotification(
          {
            senderId: profile._id,
            receiverId: item._id,
            type: "friend_accept",
          },
          token
        );
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      case "refuse":
        await unfollowOrRefuseFriendRequest(
          {
            sender: item._id,
            receiver: profile._id,
          },
          token
        );
        try {
          const notification = await getNotification(
            item._id,
            profile._id,
            "friend_request"
          );
          await deleteNotification(notification._id, token);
        } catch (error) {
          console.error("Error fetching notification:", error);
        }
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      case "block":
        // Handle "Block" action
        Alert.alert("Block", `You have blocked ${item.firstName}.`);
        break;
      case "unblock":
        await unblock(params, token);
        setData((prevData: any) =>
          prevData.filter((friend: any) => friend._id !== item._id)
        );
        break;
      default:
        break;
    }
  };

  const navigateToUserProfile = (item: any) => {
    router.push(`/user/${item}`);
  };

  return (
    <View className={`flex flex-row gap-2 w-full space-x-3 `}>
      <View className={`w-fit`}>
        <TouchableOpacity onPress={() => navigateToUserProfile(item._id)}>
          <Image
            source={{
              uri:
                item?.avatar ||
                "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
            }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </TouchableOpacity>
      </View>
      <View className={`flex flex-col flex-1 space-y-3`}>
        <View className={`flex flex-row w-full justify-between space-y-2`}>
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100], // Sử dụng giá trị màu từ file colors.js
              }}
              className={`text-[16px] font-mmedium`}
            >
              {`${item.firstName} ${item.lastName}`}
              {actionButton === "follower" && (
                <Text className="text-[16px] font-mregular">
                  {" "}
                  sent you friend request
                </Text>
              )}
            </Text>
            {item.mutualFriends.length > 0 && (
              <View className="flex flex-row items-center gap-2 mt-1">
                <View className="flex flex-row -space-x-2">
                  {item.mutualFriends
                    .slice(0, 3)
                    .map((img: any, index: any) => (
                      <Image
                        key={index}
                        source={{
                          uri:
                            img.avatar ??
                            "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
                        }}
                        className="w-[20px] h-[20px] rounded-full border border-white"
                      />
                    ))}
                </View>
                <Text
                  className="text-[14px] font-normal"
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                  }}
                >
                  {item.mutualFriends.length} mutual friends
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className={`flex flex-row w-full justify-between pb-4 pr-2`}>
          {renderActionButtons()}
        </View>
      </View>
    </View>
  );
};

export default FriendCard;
