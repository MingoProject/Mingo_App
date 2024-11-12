import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MyInput from "../../components/share/MyInput";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyButton from "../../components/share/MyButton";
import { useRouter } from "expo-router";

const PlusIcon = ({ color = "#dc0404", width = 8, height = 8 }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <Path
      fill={color}
      d="M11 21v-6.6l-4.65 4.675l-1.425-1.425L9.6 13H3v-2h6.6L4.925 6.35L6.35 4.925L11 9.6V3h2v6.6l4.65-4.675l1.425 1.425L14.4 11H21v2h-6.6l4.675 4.65l-1.425 1.425L13 14.4V21z"
    />
  </Svg>
);

const CheckBoxIcon = ({ checked, color = "#FFAABB", size = 24 }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    {checked ? (
      <Path
        fill={color}
        d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5zm-9 12l-4-4l1.41-1.42L10 14.17l6.59-6.59L18 9"
      />
    ) : (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 32 32"
      >
        <Path
          fill={color}
          d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M6 26V6h20v20Z"
        />
      </Svg>
    )}
  </Svg>
);

const SignIn = () => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [isRemember, setIsRemember] = useState(false); // Trạng thái cho hộp kiểm

  return (
    <View className="w-full h-full p-4 bg-white flex flex-col justify-between">
      {/* Các thành phần khác */}
      <View className="w-full flex-grow flex flex-col">
        <View className="w-full items-center justify-end pb-10 mt-28">
          <Text className="font-msemibold text-[36px] text-light-500">
            Đăng Nhập
          </Text>
        </View>

        <View className="w-full">
          <View className="flex flex-col gap-6">
            <View className="relative">
              <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
                <Text className="font-mregular text-[12px]">Username</Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>
              <MyInput
                placeholder="Username"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }}
              />
            </View>

            <View className="relative">
              <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
                <Text className="font-mregular text-[12px]">Password</Text>
                <View className="ml-1 pb-1">
                  <PlusIcon />
                </View>
              </View>
              <MyInput
                placeholder="Password"
                borderRadius={8}
                height={56}
                fontSize={14}
                style={{ zIndex: 1 }}
              />
            </View>

            <View>
              <MyButton
                title="Đăng nhập"
                borderRadius={12}
                backgroundColor="#FFAABB"
                fontSize={16}
                color="white"
                fontFamily="Montserrat-Bold"
                onPress={() => router.push("home")}
              />
            </View>

            <View className="px-2 flex flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => setIsRemember(!isRemember)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <CheckBoxIcon checked={isRemember} />
                <Text className="ml-2 text-light-500">Ghi nhớ mật khẩu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPressIn={() => {
                  setIsPressed(true);
                  router.push("forgot-password");
                }}
                onPressOut={() => setIsPressed(false)}
              >
                <Text
                  style={{
                    textDecorationLine: isPressed ? "underline" : "none",
                    color: isPressed ? "#007AFF" : "#92898A",
                  }}
                >
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Phần này sẽ luôn nằm cách đáy 16px */}
      <View className="w-full mb-10">
        <View className="flex flex-row items-center justify-center">
          <Text className="font-mbold text-light-500 text-[16px]">Hoặc</Text>
        </View>
        <View className="mt-4 w-full flex flex-row items-center justify-center">
          <Text className="font-mregular text-[16px] text-light-500">
            Bạn chưa có tài khoản?{" "}
            <Text
              onPress={() => router.push("signup")}
              className="font-mbold text-light-500 text-[16px]"
            >
              Đăng Ký
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
