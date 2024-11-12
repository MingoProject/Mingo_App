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
import MyButton from "../share/MyButton";

const ThreeDot = ({ size = 24, colorScheme }) => {
  const iconColor = colorScheme === "dark" ? "#D9D9D9" : "black"; // Use colorScheme here

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} // Use the size prop here
      height={size} // Use the size prop here
      viewBox="0 0 24 24"
      style={{ fill: iconColor }} // Use theme-based colors
    >
      <Path d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
    </Svg>
  );
};

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

const Card = ({ item, actionButton, isLoiMoi }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const backgroundButton = colorScheme === "dark" ? "#ffffff" : "#92898A";
  backgroundButton;
  return (
    <View className={`flex flex-row gap-2 w-full  `}>
      <View className={`w-fit self-center`}>
        <Image
          source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
          style={{ width: 70, height: 70, borderRadius: 50 }}
        />
      </View>
      <View className={`flex flex-col gap-2 flex-1 `}>
        <View className={`flex flex-row w-full items-center justify-between`}>
          <View className={`flex flex-row w-full justify-between items-center`}>
            <View>
              <Text
                style={{
                  color: colorScheme === "dark" ? colors.dark[100] : "#92898A", // Sử dụng giá trị màu từ file colors.js
                }}
                className={`text-lg`}
              >
                {item.userName}
              </Text>
            </View>

            <View>
              {isLoiMoi ? (
                <Text
                  style={{
                    color:
                      colorScheme === "dark" ? colors.dark[100] : "#D9D9D9", // Use color value from colors.js
                  }}
                  className={`text-xs`}
                >
                  {calculateTimeDifference(item.sendAt)}
                </Text>
              ) : (
                <ThreeDot size={28} color={iconColor} />
              )}
            </View>
          </View>
        </View>

        <View className={`flex flex-row w-full justify-between pb-4`}>
          <View>
            <MyButton
              title={actionButton}
              width={125}
              height={35}
              isActive={"banbe"}
              paddingLeft={10}
              paddingRight={10}
            />
          </View>
          <View>
            <MyButton
              title="Xóa"
              width={125}
              height={35}
              paddingLeft={10}
              paddingRight={10}
              backgroundColor="#D9D9D9"
              color="#92898A"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Card;
