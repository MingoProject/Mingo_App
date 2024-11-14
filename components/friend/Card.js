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

const Card = ({ item, actionButton, isLoiMoi }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const backgroundButton = colorScheme === "dark" ? "#ffffff" : "#000000";
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
                <ThreeDot size={20} color={iconColor} />
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
              backgroundColor={colors.primary[100]}
            />
          </View>
          <View>
            <MyButton
              title="Xóa"
              width={125}
              height={35}
              paddingLeft={10}
              paddingRight={10}
              backgroundColor={
                colorScheme === "dark" ? colors.dark[200] : colors.light[600]
              }
              titleStyle={{
                color:
                  colorScheme === "dark"
                    ? colors.light[300] // Màu chữ khi dark mode và không active
                    : colors.dark[700], // Màu chữ khi light mode và không active
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Card;
