import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { PictureIcon, VideoIcon, EmotionIcon } from "@/components/icons/Icons";

const OpenAddPost = ({ handleAddPost }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  return (
    <>
      <View
        className={`h-auto w-full rounded-lg px-2 py-4 ${
          colorScheme === "dark" ? "bg-dark-300" : "bg-light-700"
        }`}
      >
        <View className="flex flex-row items-center px-4 py-1">
          <View className="h-[40px] w-[40px] overflow-hidden rounded-full">
            <Image
              source={require("@/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
          <TextInput
            placeholder="Share something..."
            placeholderTextColor="#D9D9D9"
            className={`ml-3 flex-1 h-[40px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
              colorScheme === "dark" ? "bg-dark-400" : "bg-light-800"
            }`}
            onPress={handleAddPost}
          />
        </View>

        <View className="mt-3 flex flex-row justify-around">
          <View className="flex flex-row items-center">
            <PictureIcon size={20} color={iconColor} />
            <Text className="ml-2 text-sm text-primary-100 font-mregular">
              Image
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <VideoIcon size={22} color={iconColor} />
            <Text className="ml-2 text-sm text-primary-100 font-mregular">
              Video
            </Text>
          </View>
          {/* <View className="flex flex-row items-center">
            <EmotionIcon size={20} color={iconColor} />
            <Text className="ml-2 text-sm text-primary-100 font-mregular">
              Emotion
            </Text>
          </View> */}
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#D9D9D9",
          width: "100%",
          marginVertical: 5,
        }}
      />
    </>
  );
};

export default OpenAddPost;
