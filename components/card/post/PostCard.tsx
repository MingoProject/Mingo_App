import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import { getTimestamp } from "@/lib/utils";
import DetailsPost from "@/components/forms/post/DetailsPost";
import PostAction from "@/components/forms/post/PostAction";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { FriendIcon, LocationIcon, ThreeDot } from "@/components/icons/Icons";
import { useAuth } from "@/context/AuthContext";
import PostMenu from "@/components/forms/post/PostMenu";
import TagModal from "@/components/forms/post/TagsModal";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostCard = ({ item, setPostsData }: any) => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { profile } = useAuth();
  const menuRef = useRef<TouchableOpacity | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const isAuthor = profile?._id === item.author._id;
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [numberOfLikes, setNumberOfLikes] = useState(item.likes.length);
  const [numberOfComments, setNumberOfComments] = useState(
    item.comments.length
  );
  const [isLiked, setIsLiked] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      const detailsComments = await Promise.all(
        item.comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );

      if (isMounted) {
        setCommentsData(detailsComments);
      }
    };

    getComments();

    return () => {
      isMounted = false;
    };
  }, [item.comments]);

  useEffect(() => {
    let isMounted = true;
    const checkLike = async () => {
      const userId: string | null = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          const isUserLiked = item.likes.some((like: any) => like === userId);
          if (isMounted) {
            setIsLiked(isUserLiked);
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
    checkLike();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTagsModalToggle = () => {
    setIsTagsModalOpen(!isTagsModalOpen);
  };
  const navigateToUserProfile = (item: any) => {
    if (item === profile._id) {
      router.push(`/profile`);
    } else {
      router.push(`/user/${item}`);
    }
  };

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Error fetching posts. Please try again later.</Text>
  //     </View>
  //   );
  // }

  return (
    <View className="p-4 bg-transparent">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity
          onPress={() => navigateToUserProfile(item.author._id)}
        >
          <Image
            source={{
              uri:
                item.author.avatar ||
                "https://i.pinimg.com/236x/88/bd/6b/88bd6bd828ec509f4bda0d9f9450824d.jpg",
            }}
            className="w-14 h-14 rounded-full"
          />
        </TouchableOpacity>

        <View className="ml-4">
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
            className="mb-2"
          >
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
                fontSize: 16,
                fontWeight: "600",
              }}
              className="font-msemibold"
            >
              {item.author?.firstName || ""} {item.author?.lastName || ""}{" "}
            </Text>
            {item.location && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                className="flex"
              >
                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                >
                  {" "}
                  {"- "}
                </Text>
                <LocationIcon size={14} color={iconColor} />
                {/* <Icon name="mi:location" size={18} color={iconColor} /> */}
                <Text
                  style={{
                    fontSize: 16,
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                  }}
                  className="font-mregular ml-1"
                >
                  {item.location}
                </Text>
              </View>
            )}
          </View>
          {item.tags?.length > 0 && (
            <Text
              style={{
                color:
                  colorScheme === "dark" ? colors.dark[100] : colors.light[500],
                fontSize: 16,
              }}
              className="font-mmedium w-40"
              numberOfLines={1} // Hiển thị tối đa 1 dòng
              ellipsizeMode="tail"
            >
              <FriendIcon size={18} color={iconColor} />

              {item.tags?.length > 0 && (
                <TouchableOpacity
                  onPress={handleTagsModalToggle}
                  // className="mt-[10px]"
                >
                  <Text
                    style={{
                      color: colors.primary[100],
                      fontSize: 16,
                    }}
                    className="font-mregular"
                    numberOfLines={1} // Hiển thị tối đa 1 dòng
                    ellipsizeMode="tail"
                  >
                    {` with ${item.tags.length} others`}
                  </Text>
                </TouchableOpacity>
              )}
            </Text>
          )}

          <Text className="text-[#D9D9D9] font-mregular text-sm">
            {getTimestamp(item.createAt)}
          </Text>
        </View>
        <TagModal
          tags={item.tags}
          isOpen={isTagsModalOpen}
          onClose={handleTagsModalToggle}
        />

        <TouchableOpacity
          ref={menuRef}
          className="ml-auto mb-2"
          onPress={() => {
            menuRef.current?.measure((fx, fy, width, height, px, py) => {
              setMenuPosition({ x: px, y: py + height }); // Lấy vị trí dưới dấu `...`
            });
            setMenuVisible(true);
          }}
        >
          <ThreeDot size={20} color={iconColor} />
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <DetailsPost
            setModalVisible={setModalVisible}
            post={item}
            setPostsData={setPostsData}
            numberOfLikes={numberOfLikes}
            setNumberOfLikes={setNumberOfLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
          />
        </Modal>
        {isMenuVisible && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={isMenuVisible}
            onRequestClose={() => setMenuVisible(false)}
          >
            <View
              style={{
                position: "absolute",
                top: menuPosition.y,
                right: menuPosition.x - 250,
                backgroundColor: "white",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <PostMenu
                isAuthor={isAuthor}
                item={item}
                setMenuVisible={setMenuVisible}
                setPostsData={setPostsData}
              />
            </View>
          </Modal>
        )}
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
                <VideoPlayer videoUrl={media.url} />
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
        numberOfLikes={numberOfLikes}
        setNumberOfLikes={setNumberOfLikes}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        numberOfComments={numberOfComments}
      />

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

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: 350, height: 200, borderRadius: 10 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
};

export default PostCard;
