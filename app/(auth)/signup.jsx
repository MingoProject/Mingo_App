import { View, Text } from "react-native";
import React from "react";
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

const SignUp = () => {
  const router = useRouter();
  return (
    <View className="w-full h-full p-4 bg-white flex flex-col">
      <View className="w-full items-center justify-end pb-10 mt-8">
        <Text className="font-msemibold text-[36px] text-light-500">
          Đăng Ký
        </Text>
      </View>

      <View className=" w-full">
        <View className="flex flex-col gap-6">
          <View className="relative">
            {/* Nhãn (Label) */}
            <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
              <Text className="font-mregular text-[12px]">Họ và tên</Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              placeholder="Họ và tên"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative">
            {/* Nhãn (Label) */}
            <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
              <Text className="font-mregular text-[12px]">Giới tính</Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              placeholder="Giới tính"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative">
            {/* Nhãn (Label) */}
            <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
              <Text className="font-mregular text-[12px]">Số điện thoại</Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              placeholder="Số điện thoại"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative">
            {/* Nhãn (Label) */}
            <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
              <Text className="font-mregular text-[12px]">Địa chỉ</Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              placeholder="Địa chỉ"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View className="relative">
            {/* Nhãn (Label) */}
            <View className="absolute left-3 -top-2 bg-white flex flex-row items-center px-1 z-10">
              <Text className="font-mregular text-[12px]">Email</Text>
              <View className="ml-1 pb-1">
                <PlusIcon />
              </View>
            </View>

            {/* Input */}
            <MyInput
              placeholder="Email@gmail.com"
              borderRadius={8}
              height={56}
              fontSize={14}
              style={{ zIndex: 1 }} // Đảm bảo input có z-index thấp hơn nhãn
            />
          </View>
          <View>
            <MyButton
              title="Đăng Ký"
              borderRadius={12}
              backgroundColor="#FFAABB"
              fontSize={16}
              color="white"
              fontFamily="Montserrat-Bold"
            />
          </View>
        </View>
      </View>

      <View className="w-full mt-8">
        <View className="flex flex-row items-center justify-center">
          <Text className="font-mbold text-light-500 text-[16px]">Hoặc</Text>
        </View>
        <View className="mt-4 w-full flex flex-row items-center justify-center">
          <Text className="font-mregular text-[16px] text-light-500 ">
            Bạn đã có tài khoản?{" "}
            <Text
              onPress={() => router.push("signin")}
              className="font-mbold text-light-500 text-[16px] "
            >
              Đăng Nhập
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
