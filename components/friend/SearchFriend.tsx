import React, { useState } from "react";
import MyButton from "../share/MyButton";
import Svg, { Path } from "react-native-svg";
import { View, Text, FlatList, Image, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyInput from "../share/MyInput";
import { findUserByPhoneNumber } from "@/lib/service/user.service";
import { useRouter } from "expo-router";
const BackIcon = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
      />
    </Svg>
  );
};

const RightArrow = ({ size = 24, color = "white", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 15 15"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
      />
    </Svg>
  );
};

const SearchFriend = ({ onClose }: any) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    const user = await findUserByPhoneNumber(phoneNumber);
    if (user) {
      router.push(`/user/${user._id}`);
    } else {
      setNoResults(true);
    }

    setIsClickSearch(true);
  };

  const handleInputChange = (text) => {
    setPhoneNumber(text);
    setNoResults(false);
  };

  return (
    <View
      className={`w-full h-full flex flex-col p-4 bg-white`}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className={`w-full`}>
        <View className={`w-full flex flex-row items-center gap-4`}>
          <View>
            <BackIcon size={24} color={iconColor} onPress={onClose} />
          </View>
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark"
                    ? colors.dark[100]
                    : colors["title-pink"],
              }}
              className={`text-[20px] font-mmedium`}
            >
              Tìm bạn
            </Text>
          </View>
        </View>
      </View>
      <View className={`w-full pt-5`}>
        <View className={`w-full flex flex-row items-center justify-between`}>
          <View className={`flex-1 pr-4`}>
            <TextInput
              placeholder={"Nhập số điện thoại"}
              className={`ml-3 flex-1 h-[40px]  font-mregular px-4 rounded-full text-sm `}
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700],
              }}
              value={phoneNumber}
              onChangeText={handleInputChange} // Cập nhật giá trị khi người dùng nhập
            />
          </View>
          <View>
            <MyButton
              borderRadius={50}
              title={
                <RightArrow size={24} color={"white"} onPress={undefined} />
              }
              width={40}
              height={40}
              backgroundColor="#FFAABB"
              borderColor="#92898A"
              onPress={handleSearch} // Thực hiện tìm kiếm khi nhấn nút
              padding={undefined}
              paddingTop={undefined}
              paddingBottom={undefined}
              paddingLeft={undefined}
              paddingRight={undefined}
              fontWeight={undefined}
              fontFamily={undefined}
              isActive={undefined}
            />
          </View>
        </View>
      </View>

      {isClickSearch && noResults && (
        <View className={`mt-4 w-full `}>
          <View className="flex items-center justify-center pt-10">
            <Image
              source={
                colorScheme === "dark"
                  ? require("../../assets/images/Screenshot 2024-09-25 225618.png")
                  : require("../../assets/images/CannotFound.png")
              }
              style={{ width: 233, height: 235 }} // Tránh lỗi style
            />
          </View>

          <View
            className={`mt-4 w-full flex flex-row items-center justify-center `}
          >
            <Text
              style={{
                color: colorScheme === "dark" ? colors.dark[100] : "#92898A",
              }}
            >
              Không tìm thấy người dùng có số điện thoại{" "}
              <Text className={`font-msemibold `}>{phoneNumber}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchFriend;
