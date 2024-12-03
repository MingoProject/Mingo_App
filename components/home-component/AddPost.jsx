import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextArea,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import MyButton from "../share/MyButton";
import MyDropDown from "../share/MyDropDown";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import Svg, { Path, Rect } from "react-native-svg";

import MyTextArea from "../share/MyTextArea";
const Cancel = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onPress={onPress}
    >
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
      />
    </Svg>
  );
};

const fakeUsers = [
  {
    _id: "1", // user1
    userName: "Huỳnh",
    sendAt: new Date(),
    userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
  },
];

const PictureIcon = ({ size = 16, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
      <Path
        fill={color}
        d="M512 128a384 384 0 1 0 0 768a384 384 0 0 0 0-768m0-64a448 448 0 1 1 0 896a448 448 0 0 1 0-896"
      />
      <Path
        fill={color}
        d="M640 288q64 0 64 64t-64 64t-64-64t64-64M214.656 790.656l-45.312-45.312l185.664-185.6a96 96 0 0 1 123.712-10.24l138.24 98.688a32 32 0 0 0 39.872-2.176L906.688 422.4l42.624 47.744L699.52 693.696a96 96 0 0 1-119.808 6.592l-138.24-98.752a32 32 0 0 0-41.152 3.456l-185.664 185.6z"
      />
    </Svg>
  );
};

const VideoIcon = ({ size = 24, color }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        width="13.5"
        height="12"
        x="2.75"
        y="6"
        rx="3.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <Path
        d="M16.25 9.74l3.554-1.77a1 1 0 0 1 1.446.895v6.268a1 1 0 0 1-1.447.895l-3.553-1.773z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Svg>
  );
};

const EmotionIcon = ({ size = 48, color = "currentColor" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <Path
        d="M31 18v1m-14-1v1m14 12s-2 4-7 4-7-4-7-4"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const AddPost = ({ onClose }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [value, onChangeText] = React.useState("Useless Multiline Placeholder");

  return (
    <View
      className="w-full h-full p-4 bg-white"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className={`flex flex-row justify-between items-center pb-4 `}>
        <View className="">
          <Text
            style={{
              color:
                colorScheme === "dark"
                  ? colors.dark[100]
                  : colors["title-pink"], // Sử dụng giá trị màu từ file colors.js
            }}
            className={`text-[20px] font-msemibold `}
          >
            Thêm bài viết
          </Text>
        </View>

        <View>
          <Cancel size={28} color={iconColor} onPress={onClose} />
        </View>
      </View>

      <View className="flex-row items-start mb-2">
        <Image
          source={fakeUsers.find((user) => user._id === "1")?.userAvatar}
          className="w-14 h-14 rounded-full"
        />
        <View className={`ml-4 flex-1`}>
          <View className="flex flex-col  gap-1">
            <View>
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
                className="font-mmedium text-[18px] "
              >
                {fakeUsers.find((user) => user._id === "1")?.userName}
              </Text>
            </View>
            <View>
              <MyDropDown />
            </View>
          </View>
        </View>
      </View>

      <SafeAreaView className="flex-1 justify-start items-start w-80">
        <MyTextArea
          value={value}
          onChangeText={onChangeText}
          placeholder="Nhập nội dung ở đây..."
        />
      </SafeAreaView>

      <View className="flex flex-row justify-between items-center gap-2 ">
        <Text className="text-[16px] font-mmedium text-light-500">
          Thêm vào bài viết
        </Text>
        <View className="flex flex-row gap-2 pb-2">
          <View>
            <PictureIcon size={28} color={iconColor} />
          </View>
          <View>
            <VideoIcon size={32} color={iconColor} />
          </View>
          <View>
            <EmotionIcon size={28} color={iconColor} />
          </View>
        </View>
      </View>
      <View className="pt-2">
        <MyButton
          title="Đăng"
          backgroundColor="#FFAABB"
          borderRadius={12}
          color="white"
          fontSize={18}
          fontWeight="bold"
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  textAreaContainer: {
    padding: 5,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textArea: {
    height: 240,
    rows: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  placeholder: {
    text: 26,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
export default AddPost;
