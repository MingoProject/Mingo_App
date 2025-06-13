import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { colors } from "../../../styles/colors";
import {
  LocationIcon,
  AddMediaIcon,
  FriendIcon,
} from "@/components/shared/icons/Icons";
import { createMedia } from "@/lib/service/media.service";
import { editPost } from "@/lib/service/post.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/service/user.service";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { PostResponseDTO } from "@/dtos/PostDTO";
import Button from "@/components/shared/ui/button";
import MyTextarea from "@/components/shared/ui/textarea";
import MyInput from "@/components/shared/ui/MyInput";

interface AddPostprops {
  post: PostResponseDTO;
  onClose: () => void;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}
const EditPost = ({ post, onClose, setPostsData }: AddPostprops) => {
  // const { colorScheme } = useTheme();
  // const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  // const [content, setContent] = useState(post.content || "");
  // const [location, setLocation] = useState(post.location || "");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  // const [files, setFiles] = useState<any[]>([]);
  // const [captions, setCaptions] = useState<string[]>(
  //   post.media.map((m) => m.caption || "")
  // );
  // const [taggedFriends, setTaggedFriends] = useState<any[]>(post.tags || []);
  // const { profile } = useAuth();
  // const [friends, setFriends] = useState<any[]>([]);

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchFriends = async () => {
  //     try {
  //       const friendsData = await getMyFriends(profile._id);
  //       const bffsData = await getMyBffs(profile._id);
  //       const combinedFriends = [...bffsData, ...friendsData];

  //       const uniqueFriends = combinedFriends.filter(
  //         (friend, index, self) =>
  //           index === self.findIndex((f) => f._id === friend._id)
  //       );

  //       if (isMounted) {
  //         setFriends(uniqueFriends);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchFriends();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [profile._id]);

  // const toggleTagFriend = (friend: any) => {
  //   setTaggedFriends((prev) => {
  //     if (prev.some((f) => f._id === friend._id)) {
  //       return prev.filter((f) => f._id !== friend._id);
  //     } else {
  //       return [...prev, friend];
  //     }
  //   });
  // };

  // const handleFileChange = async () => {
  //   try {
  //     const permissionResult =
  //       await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!permissionResult.granted) {
  //       alert("Permission to access the photo library is required!");
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       setFiles((prevFiles) => [
  //         ...prevFiles,
  //         {
  //           uri: result.assets[0].uri,
  //           type: result.assets[0].type, // Sẽ là "image" hoặc "video"
  //           name: result.assets[0].fileName || `media_${Date.now()}`,
  //         },
  //       ]);
  //       setCaptions((prevCaptions) => [...prevCaptions, ""]);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi chọn file:", error);
  //   }
  // };

  // const handleCaptionChange = (index: number, value: string) => {
  //   setCaptions((prev) => {
  //     const updated = [...prev];
  //     updated[index] = value;
  //     return updated;
  //   });
  // };

  // const handleDeleteFile = (index: number) => {
  //   setFiles((prev) => prev.filter((_, i) => i !== index));
  //   setCaptions((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleDeleteExistingMedia = (index: number) => {
  //   setCaptions((prev) => prev.filter((_, i) => i !== index));
  //   setPostsData((prev) =>
  //     prev.map((p) => {
  //       if (p._id === post._id) {
  //         const updatedMedia = [...p.media];
  //         updatedMedia.splice(index, 1);
  //         return { ...p, media: updatedMedia };
  //       }
  //       return p;
  //     })
  //   );
  // };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setError("");

  //   const token: string | null = await AsyncStorage.getItem("token");
  //   if (!token) {
  //     console.error("User is not authenticated");
  //     return;
  //   }

  //   try {
  //     let mediaIds: string[] = post.media
  //       .filter((_, index) => !captions[index]?.deleted) // Loại bỏ media đã xóa
  //       .map((media) => media._id);
  //     if (files.length > 0) {
  //       const uploadPromises = files.map(async (file, index) => {
  //         const caption = captions[index];
  //         const uploadedMedia = await createMedia(file, caption, token);
  //         return uploadedMedia.media._id;
  //       });

  //       const newMediaIds = await Promise.all(uploadPromises);
  //       mediaIds = [...mediaIds, ...newMediaIds];
  //     }

  //     const postPayload = {
  //       content: content || "",
  //       media: mediaIds,
  //       location,
  //       tags: taggedFriends.map((friend) => friend._id),
  //       privacy: {
  //         type: post.privacy.type,
  //       },
  //     };

  //     const updatedPost = await editPost(postPayload, post._id, token);
  //     setPostsData((prevPosts: any[]) =>
  //       prevPosts.map((post) => {
  //         if (post._id === updatedPost._id) {
  //           return {
  //             ...post,
  //             media: updatedPost.media || post.media,
  //             content: updatedPost.content || post.content,
  //             likes: updatedPost.likes || post.likes,
  //             author: updatedPost.author || post.author,
  //             tags: updatedPost.tags || post.tags,
  //             location: updatedPost.location || post.location,
  //             privacy: updatedPost.privacy || post.privacy,
  //           };
  //         }
  //         return post;
  //       })
  //     );

  //     alert("Post updated successfully!");
  //     onClose();
  //   } catch (err: any) {
  //     console.error(err);
  //     setError(err.message || "Error updating post");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [content, setContent] = useState(post.content || "");
  const [location, setLocation] = useState(post.location || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [existingMedia, setExistingMedia] = useState(post.media || []);
  const [captions, setCaptions] = useState<string[]>([
    ...(post.media || []).map((m) => m.caption || ""),
  ]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>(post.tags || []);
  const { profile } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);

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
        if (isMounted) setFriends(uniqueFriends);
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
    setTaggedFriends((prev) =>
      prev.some((f) => f._id === friend._id)
        ? prev.filter((f) => f._id !== friend._id)
        : [...prev, friend]
    );
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
        setFiles((prev) => [
          ...prev,
          {
            uri: result.assets[0].uri,
            type: result.assets[0].type,
            name: result.assets[0].fileName || `media_${Date.now()}`,
          },
        ]);
        setCaptions((prev) => [...prev, ""]);
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
    setCaptions((prev) =>
      prev.filter((_, i) => i !== index + existingMedia.length)
    );
  };

  const handleDeleteExistingMedia = (index: number) => {
    setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    setCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const token = await AsyncStorage.getItem("token");
    if (!token) return console.error("User is not authenticated");

    try {
      let mediaIds = existingMedia.map((m, idx) => ({
        id: m._id,
        caption: captions[idx],
      }));

      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[existingMedia.length + index];
          const uploadedMedia = await createMedia(file, caption, token);
          return { id: uploadedMedia.media._id, caption };
        });
        const newMedia = await Promise.all(uploadPromises);
        mediaIds = [...mediaIds, ...newMedia];
      }

      const postPayload = {
        content: content || "",
        media: mediaIds.map((m) => m.id),
        location,
        tags: taggedFriends.map((f) => f._id),
        privacy: { type: post.privacy.type },
      };

      const updatedPost = await editPost(postPayload, post._id, token);
      setPostsData((prev) =>
        prev.map((p) =>
          p._id === updatedPost._id ? { ...p, ...updatedPost } : p
        )
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
          Edit Post
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

      {existingMedia.length > 0 && (
        <View className="mb-4">
          {existingMedia.map((mediaItem, index) => (
            <View
              key={mediaItem._id}
              className="flex flex-row items-center mb-2"
            >
              {mediaItem.type === "image" ? (
                <Image
                  source={{ uri: mediaItem.url }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
              ) : (
                <Video
                  source={{ uri: mediaItem.url }}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
              )}
              <TextInput
                value={captions[index]}
                onChangeText={(text) => handleCaptionChange(index, text)}
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
                      : colors.light[100],
                }}
                className="font-mmedium"
              />
              <TouchableOpacity
                onPress={() => handleDeleteExistingMedia(index)}
              >
                <Text className="text-primary-100 ml-2 font-mmedium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {files.map((file, index) => (
        <View key={index} className="flex flex-row items-center mb-2">
          {file.type?.includes("video") || file.uri?.endsWith(".mp4") ? (
            <Video
              source={{ uri: file.uri }}
              style={{ width: 100, height: 100, marginRight: 8 }}
              // resizeMode="cover"
              // controls={true} // Hiển thị nút điều khiển video
              className="rounded-lg size-20 object-cover"
            />
          ) : (
            <Image
              source={{ uri: file.uri }}
              style={{ width: 100, height: 100, marginRight: 8 }}
              className="rounded-lg"
            />
          )}
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
          {friends.map((friend, index) => {
            const isTagged = taggedFriends.some((f) => f._id === friend._id);

            return (
              <TouchableOpacity
                key={friend._id}
                onPress={() => toggleTagFriend(friend)}
                style={{
                  backgroundColor: isTagged
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
                  }}
                  className="w-9 h-9 rounded-full"
                />
                <Text
                  style={{
                    color: isTagged ? colors.dark[100] : colors.light[100],
                  }}
                  className="text-[14px] ml-1 font-mmedium"
                >
                  {friend.firstName} {friend.lastName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
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
              Editing post...
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

export default EditPost;
