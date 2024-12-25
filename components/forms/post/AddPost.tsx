import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import MyDropDown from "../../share/MyDropDown";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import {
  VideoIcon,
  PictureIcon,
  EmotionIcon,
  CancelIcon,
} from "@/components/icons/Icons";
import MyTextArea from "../../share/MyTextArea";
import { createMedia } from "@/lib/service/media.service";
import { PostCreateDTO } from "@/dtos/PostDTO";
import { createPost } from "@/lib/service/post.service";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import * as ImagePicker from "expo-image-picker";

const AddPost = ({ onClose }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
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

  // const handleFileChange = async () => {
  //   try {
  //     const permissionResult =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!permissionResult.granted) {
  //       alert("Cần cấp quyền truy cập thư viện ảnh!");
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       setFiles((prevFiles) => [
  //         ...prevFiles,
  //         {
  //           uri: result.assets[0].uri,
  //           type: result.assets[0].type,
  //           name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
  //         },
  //       ]);
  //       setCaptions((prevCaptions) => [...prevCaptions, ""]);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi chọn ảnh:", error);
  //   }
  // };

  const handleFileChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Cần cấp quyền truy cập thư viện ảnh!");
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
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700],
        padding: 16,
      }}
    >
      {/* Header */}
      <View className="flex flex-row pt-12 justify-between items-center pb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors["title-pink"],
          }}
          className="text-[20px] font-msemibold"
        >
          Create Post
        </Text>
        <TouchableOpacity onPress={onClose}>
          <CancelIcon size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Profile and Privacy */}
      <View className="flex flex-row items-center mb-4">
        <Image
          source={{ uri: profile.avatar }} // Avatar from profile
          className="w-14 h-14 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="font-mmedium text-[18px]"
          >
            {profile.firstName} {profile.lastName}
            {/* Replace with user's name */}
          </Text>
          {/* <MyDropDown /> */}
        </View>
      </View>

      {/* Content */}
      <MyTextArea
        value={content}
        onChangeText={setContent}
        placeholder="Share something..."
      />

      {/* Location Input */}
      <View>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-mmedium"
        >
          Add location
        </Text>
      </View>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        className="text-[14px] font-mmedium border-gray-200 pt-3"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginVertical: 12,
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500],
        }}
      />

      <View className="mb-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-mmedium"
        >
          Tag friends
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {friends.map((friend, index) => (
            <TouchableOpacity
              key={friend._id}
              onPress={() => toggleTagFriend(friend)}
              style={{
                backgroundColor: taggedFriends.includes(friend)
                  ? colors.primary[100]
                  : colors.light[800],
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
                    : colors.light[500],
                }}
                className="text-[14px] ml-1 font-mmedium"
              >
                {friend.firstName} {friend.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className=" flex-wrap gap-2 mt-2">
        {files.map((file, index) => (
          <View
            key={index}
            className="w-20 relative flex-row"
            style={{
              borderColor: colors.primary[100],
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            {/* Hiển thị ảnh */}
            <Image
              source={{ uri: file.uri }}
              className="w-full h-20 rounded-lg"
            />
            {/* Input để nhập caption */}
            <TextInput
              value={captions[index]}
              onChangeText={(value) => handleCaptionChange(index, value)}
              placeholder="Caption"
              style={{
                padding: 5,
                marginTop: 8,
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
              className="w-72 font-mregular"
            />
            <TouchableOpacity
              onPress={() => handleDeleteFile(index)}
              className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
            >
              <CancelIcon size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Media */}
      <View className="flex flex-row items-center justify-between mt-4">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-mmedium"
        >
          Add to the post
        </Text>
        <View className="flex flex-row gap-4">
          <TouchableOpacity onPress={handleFileChange}>
            <PictureIcon size={28} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <EmotionIcon size={28} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full py-3 mt-4 rounded-[8px] mb-10"
        style={{
          backgroundColor: colors.primary[100],
        }}
      >
        <Text className="text-center text-white font-msemibold">
          Create post
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPost;
