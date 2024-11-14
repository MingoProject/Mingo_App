import React from "react";
import Svg, { Path } from "react-native-svg";
import { View, Text, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import { ThreeDot } from "../icons/Icons.js";

const calculateTimeDifference = (date) => {
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

const NotificationCard = ({ item }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  return (
    <View className="flex flex-row w-full ">
      <View className="w-full">
        <View className="flex flex-row w-full pt-2 ">
          <Text
            style={{
              color: colorScheme === "dark" ? colors.dark[100] : "#FFAABB",
            }}
            className="text-[14] font-msemibold "
          >
            {calculateTimeDifference(item.notificationDay)}
          </Text>
        </View>
        <View>
          {item.notifications.map((notification) => (
            <View
              key={`${notification.id}-${notification.createAt}`} // Ensure uniqueness
              className="flex flex-row w-full items-center justify-between py-2"
            >
              <View className="w-fit self-center pr-2">
                <Image
                  source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
                  style={{ width: 70, height: 70, borderRadius: 35 }}
                />
              </View>
              <View className="flex-1">
                <View className="flex flex-row w-full justify-between items-center ">
                  <View className="flex-1 ">
                    <Text
                      style={{
                        color:
                          colorScheme === "dark" ? colors.dark[100] : "#92898A",
                      }}
                      className="text-[16px] font-mmedium "
                      numberOfLines={2} // Limit to 2 lines
                      ellipsizeMode="tail" // Show ellipsis at the end
                    >
                      <Text
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : "#FFAABB",
                        }}
                      >
                        {notification.userName}
                      </Text>{" "}
                      vừa thích bài viết của bạn: {notification.content}
                    </Text>
                  </View>
                  <View className="self-start w-fit pl-1">
                    <ThreeDot size={20} color={iconColor} />
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      color: colorScheme === "dark" ? "#D9D9D9" : "#D9D9D9",
                    }}
                    className="text-xs pt-1"
                  >
                    {calculateTimeDifference(notification.createAt)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;
