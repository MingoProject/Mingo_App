import React from "react";
import Svg, { Path } from "react-native-svg";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import MyButton from "../share/MyButton";
import { ThreeDot } from "../icons/Icons.js";
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

const calculateTimeDifference = (date: any) => {
  const now = new Date();
  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);
  const daysAgo = differenceInDays(now, date);

  if (daysAgo > 0) {
    return `${daysAgo} ngày trước`;
  } else if (hoursAgo > 0) {
    return `${hoursAgo} giờ trước`;
  } else {
    return `${minutesAgo} phút trước`;
  }
};

const Card = ({ item, actionButton, isLoiMoi, setData }: any) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const backgroundButton = colorScheme === "dark" ? "#ffffff" : "#000000";
  backgroundButton;
  const { profile } = useAuth();
  const renderActionButtons = () => {
    switch (actionButton) {
      case "friend":
        return (
          <>
            <MyButton
              title="Chat"
              width={125}
              height={35}
              isActive={"banbe"}
              paddingLeft={10}
              paddingRight={10}
              backgroundColor={colors.primary[100]}
              onPress={undefined}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontSize={13}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
            />
            <MyButton
              title="Unfriend"
              width={125}
              height={35}
              paddingLeft={10}
              paddingRight={10}
              backgroundColor={
                colorScheme === "dark" ? colors.dark[400] : colors.light[800]
              }
              onPress={() => handleAction("unfriend")}
              padding={undefined}
              fontSize={13}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
              isActive={undefined}
            />
          </>
        );
      case "bestfriend":
        return (
          <>
            <MyButton
              title="Chat"
              width={125}
              height={35}
              isActive={"banbe"}
              paddingLeft={10}
              paddingRight={10}
              fontSize={13}
              backgroundColor={colors.primary[100]}
              onPress={undefined}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
            />
            <MyButton
              title="Unbestfriend"
              width={125}
              height={35}
              paddingLeft={10}
              paddingRight={10}
              fontSize={13}
              backgroundColor={
                colorScheme === "dark" ? colors.dark[400] : colors.light[800]
              }
              onPress={() => handleAction("unbestfriend")}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
              isActive={undefined}
            />
          </>
        );
      case "following":
        return (
          <>
            <MyButton
              title="Chat"
              width={125}
              height={35}
              isActive={"banbe"}
              paddingLeft={10}
              paddingRight={10}
              fontSize={13}
              backgroundColor={colors.primary[100]}
              onPress={undefined}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
            />
            <MyButton
              title="Unfollow"
              width={125}
              height={35}
              paddingLeft={10}
              paddingRight={10}
              fontSize={13}
              backgroundColor={
                colorScheme === "dark" ? colors.dark[400] : colors.light[800]
              }
              onPress={() => handleAction("unfollow")}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
              isActive={undefined}
            />
          </>
        );
      case "follower":
        return (
          <>
            <MyButton
              title="Accept"
              width={125}
              height={35}
              isActive={"banbe"}
              paddingLeft={10}
              paddingRight={10}
              fontSize={13}
              backgroundColor={colors.primary[100]}
              onPress={() => handleAction("accept")}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
            />
            <MyButton
              title="Refuse"
              width={125}
              height={35}
              paddingLeft={10}
              fontSize={13}
              paddingRight={10}
              backgroundColor={
                colorScheme === "dark" ? colors.dark[400] : colors.light[800]
              }
              onPress={() => handleAction("refuse")}
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              borderColor={undefined}
              fontWeight={undefined}
              fontFamily="Montserrat-Medium"
              isActive={undefined}
            />
          </>
        );
      case "block":
        return (
          <MyButton
            title="Unblock"
            width={125}
            height={35}
            fontSize={13}
            paddingLeft={10}
            paddingRight={10}
            backgroundColor={
              colorScheme === "dark" ? colors.dark[400] : colors.light[800]
            }
            onPress={() => handleAction("unblock")}
            padding={undefined}
            paddingTop={undefined}
            paddingBottom={undefined}
            borderColor={undefined}
            fontWeight={undefined}
            fontFamily="Montserrat-Medium"
            isActive={undefined}
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
    <View className={`flex flex-row gap-2 w-full  `}>
      <View className={`w-fit self-center`}>
        <TouchableOpacity onPress={() => navigateToUserProfile(item._id)}>
          <Image
            source={
              item.avatar
                ? { uri: item.avatar }
                : require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")
            }
            style={{ width: 70, height: 70, borderRadius: 50 }}
          />
        </TouchableOpacity>
      </View>
      <View className={`flex flex-col gap-2 flex-1 `}>
        <View className={`flex flex-row w-full items-center justify-between`}>
          <View className={`flex flex-row w-full justify-between items-center`}>
            <View>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#92898A", // Sử dụng giá trị màu từ file colors.js
                }}
                className={`text-base font-mmedium`}
              >
                {`${item.firstName} ${item.lastName}`}
              </Text>
            </View>

            <View>
              {/* {isLoiMoi ? (
                <Text
                  style={{
                    color:
                      colorScheme === "dark" ? colors.dark[100] : "#D9D9D9", // Use color value from colors.js
                  }}
                  className={`text-xs`}
                >
                  {calculateTimeDifference(item.sendAt || new Date())}
                </Text>
              ) : (
                <ThreeDot size={20} color={iconColor} />
              )} */}
            </View>
          </View>
        </View>

        <View className={`flex flex-row w-full justify-between pb-4 pr-8`}>
          {renderActionButtons()}
        </View>
      </View>
    </View>
  );
};

export default Card;
