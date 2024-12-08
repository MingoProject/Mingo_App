import React, { useState } from "react";
import { View, Text, FlatList, Image, Modal } from "react-native";
import Video from "react-native-video";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import DetailsPost from "@/components/forms/post/DetailsPost";
import PostAction from "@/components/forms/post/PostAction";

const PostCard = ({ item }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View className="p-4 bg-transparent mb-4">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: item.author.avatar }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-4">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="font-msemibold text-[17px] "
          >
            {item.author.firstName} {item.author.lastName}
          </Text>
          <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
            {getTimestamp(item.createAt)}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          flex: 1,
        }}
        className="mb-4 font-mregular mt-3 text-[15px]"
      >
        {item.content}
      </Text>

      {item.media && (
        <FlatList
          data={item.media}
          horizontal
          keyExtractor={(media) => media._id}
          renderItem={({ item: media }) => (
            <View className="mr-2">
              {media.type === "image" ? (
                <Image
                  source={{ uri: media.url }}
                  className="w-96 h-96 rounded-lg"
                />
              ) : media.type === "video" ? (
                <View className="w-96 h-96 bg-gray-200 rounded-lg">
                  {/* <Video
                              source={{ uri: media.url }} // Đường dẫn URL video
                              style={{ width: "100%", height: "100%" }}
                              controls={true} // Hiển thị các controls như play, pause, volume,...
                              resizeMode="contain" // Điều chỉnh video sao cho phù hợp với container
                            /> */}
                </View>
              ) : (
                <Text>Unsupported Media</Text>
              )}
            </View>
          )}
        />
      )}
      <PostAction
        post={item}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <DetailsPost setModalVisible={setModalVisible} post={item} />
      </Modal>
      <View
        style={{
          height: 1,
          backgroundColor: "#D9D9D9",
          width: "100%",
          marginVertical: 5,
        }}
        className="mt-5"
      />
    </View>
  );
};

export default PostCard;
