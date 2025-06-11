import React, { useState } from "react";
import MyButton from "../share/MyButton";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import { findUserByPhoneNumber } from "@/lib/service/user.service";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ArrowIcon, ArrowRightIcon } from "../icons/Icons";
import Input from "../share/ui/input";
import Button from "../share/ui/button";

const SearchFriend = ({ onClose }: any) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const { profile } = useAuth();

  const handleSearch = async () => {
    const user = await findUserByPhoneNumber(phoneNumber);
    if (user) {
      if (user._id === profile._id) {
        router.push(`/profile`);
      } else {
        router.push(`/user/${user._id}`);
      }
    } else {
      setNoResults(true);
    }

    setIsClickSearch(true);
  };

  const handleInputChange = (text: any) => {
    setPhoneNumber(text);
    setNoResults(false);
  };

  return (
    <View
      className={`w-full h-full flex flex-col p-4`}
      style={{
        paddingTop: Platform.OS === "android" ? 14 : 52,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className={`w-full`}>
        <View className={`w-full flex flex-row items-center gap-4`}>
          <TouchableOpacity onPress={onClose}>
            <ArrowIcon size={24} color={iconColor} />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark"
                    ? colors.dark[100]
                    : colors.primary[100],
              }}
              className={`text-[20px] font-mmedium`}
            >
              Search friend
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full pt-5">
        <View className="w-full flex-row items-center space-x-2">
          <View className="flex-1">
            <Input
              placeholder="Entry phone number"
              readOnly={false}
              onChange={handleInputChange}
              value={phoneNumber}
            />
          </View>
          <View className="w-12">
            <Button
              title={<ArrowRightIcon size={24} color={"white"} />}
              onPress={handleSearch}
              borderRadius={999}
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
              className="font-mmedium"
            >
              No user found with phone number{" "}
              <Text className={`font-mbold `}>{phoneNumber}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchFriend;
