import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import {
  CancelIcon,
  AddMediaIcon,
  FriendIcon,
  LocationIcon,
} from "@/components/shared/icons/Icons";
import { createMedia } from "@/lib/service/media.service";
import { PostCreateDTO, PostResponseDTO } from "@/dtos/PostDTO";
import { createPost } from "@/lib/service/post.service";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import Button from "@/components/shared/ui/button";
import MyTextarea from "@/components/shared/ui/textarea";
import MyInput from "@/components/shared/ui/MyInput";

interface AddPostprops {
  onClose: () => void;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const AddPost = ({ onClose, setPostsData }: AddPostprops) => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(profile._id);
        const bffsData = await getMyBffs(profile._id);
        const combinedFriends = [...bffsData, ...friendsData];

        const uniqueFriends = combinedFriends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f._id === friend._id)
        );

        if (isMounted) {
          setFriends(uniqueFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, [profile._id]);

  const toggleTagFriend = (friend: any) => {
    setTaggedFriends((prev) => {
      if (prev.some((f) => f._id === friend._id)) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleFileChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access the photo library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Hỗ trợ cả ảnh và video
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            uri: result.assets[0].uri,
            type: result.assets[0].type, // Sẽ là "image" hoặc "video"
            name: result.assets[0].fileName || `media_${Date.now()}`,
          },
        ]);
        setCaptions((prevCaptions) => [...prevCaptions, ""]);
      }
    } catch (error) {
      console.error("Lỗi khi chọn file:", error);
    }
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      let mediaIds: string[] = [];

      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[index];
          const uploadedMedia = await createMedia(file, caption, token);
          console.log(uploadedMedia);
          return uploadedMedia.media._id;
        });

        mediaIds = await Promise.all(uploadPromises);
      }

      const postPayload: PostCreateDTO = {
        content: content || "",
        media: mediaIds,
        location,
        tags: taggedFriends.map((friend) => friend._id),
        privacy: { type: "public" }, // Assuming privacy is public for now
      };

      const res = await createPost(postPayload, token);

      if (taggedFriends && taggedFriends.length > 0) {
        for (const friend of taggedFriends) {
          const notificationParams = {
            senderId: profile._id,
            receiverId: friend._id,
            type: "tags",
            postId: res._id,
          };

          await createNotification(notificationParams, token);
        }
      }
      alert("Post created successfully!");
      setPostsData((prevPosts) => [res, ...prevPosts]);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="w-full p-4 h-full space-y-5"
      style={{
        paddingTop: Platform.OS === "android" ? 14 : 52,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="font-msemibold text-[24px]"
        >
          Create Post
        </Text>
        <Button
          title="Close"
          size="small"
          color="transparent"
          onPress={onClose}
        />
      </View>

      <View className="flex flex-row items-center">
        <Image
          source={{
            uri:
              profile?.avatar ||
              "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
          }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-2 flex-1">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              fontSize: 16,
            }}
            className="font-mmedium"
          >
            {profile.firstName || ""} {profile.lastName || ""}
          </Text>
        </View>
      </View>

      <View>
        <MyTextarea
          value={content}
          onChangeText={setContent}
          placeholder="Share something..."
          fontFamily="Montserrat-Regular"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-2"
      >
        {files.map((file, index) => (
          <View key={index} className="w-[300px] relative flex-col">
            {file.type?.includes("video") || file.uri?.endsWith(".mp4") ? (
              <Video
                source={{ uri: file.uri }}
                style={{ width: 300, height: 300, marginRight: 8 }}
                // resizeMode="cover"
                // controls={true} // Hiển thị nút điều khiển video
                className="rounded-lg  object-cover"
              />
            ) : (
              <Image
                source={{ uri: file.uri }}
                style={{ width: 300, height: 300, marginRight: 8 }}
                className="rounded-md"
              />
            )}

            <View className="mt-2">
              <MyInput
                value={captions[index]}
                onChangeText={(value) => handleCaptionChange(index, value)}
                placeholder="Caption"
                height={56}
                fontSize={14}
                fontFamily="Montserrat-Regular"
              />
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteFile(index)}
              className="absolute top-1 right-1 bg-primary-100 rounded-full p-1"
            >
              <CancelIcon size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleFileChange}
        className="flex flex-row space-x-2"
      >
        <AddMediaIcon size={24} color={iconColor} />
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="text-[16px] font-mregular"
        >
          Add media to the post
        </Text>
      </TouchableOpacity>

      <View className="">
        <View className="flex flex-row space-x-2">
          <FriendIcon size={24} color={iconColor} />
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[100],
            }}
            className="text-[16px] font-mregular"
          >
            Tag friends
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {friends.map((friend, index) => (
            <TouchableOpacity
              key={friend._id}
              onPress={() => toggleTagFriend(friend)}
              style={{
                backgroundColor: taggedFriends.includes(friend)
                  ? colors.primary[100]
                  : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[400],
                borderRadius: 20,
                marginRight: 8,
                padding: 5,
              }}
              className="flex-row justify-center items-center mt-3 px-2"
            >
              <Image
                source={{
                  uri:
                    friend.avatar ||
                    "https://i.pinimg.com/736x/57/36/f0/5736f06013a35c48586c3067bef8c2c1.jpg",
                }} // Avatar from profile
                className="w-9 h-9 rounded-full"
              />
              <Text
                style={{
                  color: taggedFriends.includes(friend)
                    ? colors.dark[100]
                    : colors.light[100],
                }}
                className="text-[14px] ml-1 font-mmedium"
              >
                {friend.firstName} {friend.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex flex-row space-x-2">
        <LocationIcon size={24} color={iconColor} />
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[100],
          }}
          className="text-[16px] font-mregular"
        >
          Add location
        </Text>
      </View>

      <View className="mt-2">
        <MyInput
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          height={56}
          fontSize={14}
          fontFamily="Montserrat-Regular"
        />
      </View>

      <View className="mb-28">
        {loading && (
          <View className="flex-row items-center space-x-2 mb-4">
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[100],
              }}
            >
              Creating post...
            </Text>
            <ActivityIndicator size="small" color={colors.primary[100]} />
          </View>
        )}

        {error ? (
          <Text
            style={{ color: "red", marginBottom: 10 }}
            className="text-sm font-mregular"
          >
            {error}
          </Text>
        ) : null}

        <Button
          title="Create Post"
          onPress={() => handleSubmit}
          fontColor={
            colorScheme === "dark" ? colors.dark[100] : colors.light[200]
          }
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

export default AddPost;
