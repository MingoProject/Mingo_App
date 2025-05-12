import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { PictureIcon, VideoIcon, EmotionIcon } from "@/components/icons/Icons";
import Input from "@/components/share/ui/input";
import { colors } from "@/styles/colors";
import { UserBasicInfo } from "@/dtos/UserDTO";

interface OpenAddPostProps {
  handleAddPost: () => void;
  profileBasic: UserBasicInfo;
}

const OpenAddPost: React.FC<OpenAddPostProps> = ({
  handleAddPost,
  profileBasic,
}) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  return (
    <>
      <View
        style={{
          backgroundColor:
            colorScheme === "dark" ? colors.dark[200] : colors.light[200],
        }}
        className={`h-auto w-full rounded-lg px-3 py-5 mb-2 `}
      >
        <View className="flex flex-row items-center">
          <View className="w-64">
            <Input
              avatarSrc={profileBasic.avatar}
              placeholder="Share something..."
              readOnly={true}
              onClick={handleAddPost}
            />
          </View>
        </View>

        <View className="mt-3 flex flex-row justify-between">
          <Text className="font-mregular text-4">Add to your post</Text>
          <View className="flex flex-row items-center space-x-2">
            <View>
              <PictureIcon size={20} color={iconColor} />
            </View>
            <View>
              <VideoIcon size={22} color={iconColor} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default OpenAddPost;
