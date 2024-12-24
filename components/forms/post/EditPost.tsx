import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
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
import { editPost } from "@/lib/service/post.service";
import { createNotification } from "@/lib/service/notification.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import * as ImagePicker from "expo-image-picker";
import MyDropDown from "@/components/share/MyDropDown";

const EditPost = ({ post, onClose, setPostsData }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [content, setContent] = useState(post.content || "");
  const [location, setLocation] = useState(post.location || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [captions, setCaptions] = useState<string[]>(post.media.caption || []);
  const [taggedFriends, setTaggedFriends] = useState<any[]>(post.tags || []);
  const { profile } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [tagFriendsVisible, setTagFriendsVisible] = useState(false);

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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
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

  const handleDeleteExistingMedia = (index: number) => {
    setCaptions((prev) => prev.filter((_, i) => i !== index));
    setPostsData((prev) =>
      prev.map((p) => {
        if (p._id === post._id) {
          const updatedMedia = [...p.media];
          updatedMedia.splice(index, 1);
          return { ...p, media: updatedMedia };
        }
        return p;
      })
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const token: string | null = await AsyncStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      // let mediaIds: string[] = post.media.map((media) => media._id);

      let mediaIds: string[] = post.media
        .filter((_, index) => !captions[index]?.deleted) // Loại bỏ media đã xóa
        .map((media) => media._id);
      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[index];
          const uploadedMedia = await createMedia(file, caption, token);
          return uploadedMedia.media._id;
        });

        const newMediaIds = await Promise.all(uploadPromises);
        mediaIds = [...mediaIds, ...newMediaIds];
      }

      const postPayload = {
        content: content || "",
        media: mediaIds,
        location,
        tags: taggedFriends.map((friend) => friend._id),
        privacy: {
          type: post.privacy.type,
        },
      };

      const updatedPost = await editPost(postPayload, post._id, token);
      setPostsData((prevPosts: any[]) =>
        prevPosts.map((post) => {
          if (post._id === updatedPost._id) {
            return {
              ...post,
              media: updatedPost.media || post.media,
              content: updatedPost.content || post.content,
              likes: updatedPost.likes || post.likes,
              author: updatedPost.author || post.author,
              tags: updatedPost.tags || post.tags,
              location: updatedPost.location || post.location,
              privacy: updatedPost.privacy || post.privacy,
            };
          }
          return post;
        })
      );

      alert("Post updated successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error updating post");
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
      className=""
    >
      {/* Header */}
      <View className="flex flex-row justify-between items-center pb-4 mt-10">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors["title-pink"],
          }}
          className="text-[20px] font-msemibold"
        >
          Edit Post
        </Text>
        <TouchableOpacity onPress={onClose}>
          <CancelIcon size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

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
          <MyDropDown />
        </View>
      </View>

      {/* Content */}
      <MyTextArea
        value={content}
        onChangeText={setContent}
        placeholder="What are you thinking?"
      />

      {/* Location */}
      <View>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-medium"
        >
          Add location
        </Text>
      </View>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        style={{
          borderWidth: 1,
          borderColor: colors.primary[100],
          borderRadius: 8,
          padding: 10,
          marginVertical: 12,
          color: colorScheme === "dark" ? colors.dark[100] : colors.light[500],
        }}
      />

      <View className="mb-4 flex-row">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-medium"
        >
          Tag friends
        </Text>
        {tagFriendsVisible && (
          <View className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-opacity-50 flex justify-center items-center">
            <View
              className="bg-white p-4 rounded-lg w-80"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? colors.dark[300] : colors.light[700],
              }}
            >
              <Text className="text-lg font-medium mb-2">
                Select friends to tag
              </Text>

              <ScrollView className="h-60">
                {friends.map((friend: any) => (
                  <TouchableOpacity
                    key={friend._id}
                    onPress={() => toggleTagFriend(friend)}
                    className="flex flex-row items-center py-2"
                  >
                    <Image
                      source={{
                        uri:
                          friend.avatar ||
                          "https://i.pinimg.com/736x/6b/3e/a0/6b3ea0d4d36f00a044b54f8f051858ae.jpg",
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 22.5,
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                      className="flex-1"
                    >
                      {friend.firstName} {friend.lastName}
                    </Text>
                    {taggedFriends.some((f) => f._id === friend._id) && (
                      <Text
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : colors.light[500],
                        }}
                        className="text-green-500"
                      >
                        ✔️
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setTagFriendsVisible(false)}
                className="mt-4"
              >
                <Text className="text-primary-100">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TouchableOpacity
          className="ml-auto"
          onPress={() => setTagFriendsVisible(true)}
        >
          <Text className="text-primary-100">Add friends</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal className="flex flex-row gap-4">
        {taggedFriends.map((friend: any) => (
          <TouchableOpacity
            key={friend._id}
            onPress={() => toggleTagFriend(friend)}
            className="bg-gray-300 p-2 rounded-full flex-row"
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[400] : colors.light[800],
              flex: 1,
            }}
          >
            <Image
              source={{
                uri:
                  friend.avatar ||
                  "https://i.pinimg.com/736x/6b/3e/a0/6b3ea0d4d36f00a044b54f8f051858ae.jpg",
              }}
              style={{
                width: 25,
                height: 25,
                borderRadius: 22.5,
                marginRight: 10,
              }}
            />
            <Text
              className="text-sm"
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
              }}
            >
              {friend.firstName} {friend.lastName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="flex flex-row items-center justify-between mt-4 mb-2">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          }}
          className="text-[16px] font-medium"
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

      {post.media && post.media.length > 0 && (
        <View className="mb-4">
          {post.media.map((mediaItem, index) => (
            <View
              key={mediaItem._id}
              className="flex flex-row items-center mb-2"
            >
              <Image
                source={{ uri: mediaItem.url }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
              />
              <TextInput
                value={mediaItem.caption || ""} // Hiển thị caption từ mediaItem
                onChangeText={(text) => handleCaptionChange(index, text)} // Cập nhật caption khi thay đổi
                placeholder="Add caption"
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary[100],
                  borderRadius: 8,
                  padding: 10,
                  marginLeft: 8,
                  flex: 1,
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              />
              <TouchableOpacity
                onPress={() => handleDeleteExistingMedia(index)}
              >
                <Text className="text-primary-100 ml-2">Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {files.map((file, index) => (
        <View key={index} className="flex flex-row items-center mb-2">
          <Image
            source={{ uri: file.uri }}
            style={{ width: 100, height: 100, marginRight: 8 }}
            className="rounded-lg"
          />
          <TextInput
            value={file.caption}
            onChangeText={(text) => handleCaptionChange(index, text)}
            placeholder="Add a caption"
            style={{
              borderWidth: 1,
              borderColor: colors.primary[100],
              borderRadius: 8,
              padding: 10,
              marginLeft: 8,
              flex: 1,
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
          />
          <TouchableOpacity onPress={() => handleDeleteFile(index)}>
            <Text className="text-primary-100 ml-2">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="mt-3"
      >
        <View
          className=" p-3 rounded-full"
          style={{
            backgroundColor: colors.primary[100],
          }}
        >
          <Text className="text-white text-center">
            {loading ? "Updating..." : "Update Post"}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditPost;
