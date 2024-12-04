import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Video from "react-native-video";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors"; // import màu sắc từ file colors.js
import AddPost from "@/components/home-component/AddPost";
import { Link } from "expo-router";
import { getTimestamp } from "@/lib/utils";
import fetchDetailedPosts from "@/hooks/usePosts";
import {
  SearchIcon,
  MessageIcon,
  PictureIcon,
  VideoIcon,
  EmotionIcon,
  LikeIcon,
  CommentIcon,
  ShareIcon,
} from "@/components/icons/Icons";

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
              colorScheme === "dark" ? "bg-dark-200" : "bg-light-600"
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
          <View className="flex flex-row items-center">
            <EmotionIcon size={20} color={iconColor} />
            <Text className="ml-2 text-sm text-primary-100 font-mregular">
              Emotion
            </Text>
          </View>
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
