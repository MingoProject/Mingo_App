import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
// import { ThreeDot } from "../icons/Icons.js";
import { useAuth } from "@/context/AuthContext";
import {
  acceptAddBff,
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
  unrequestBffOrRefuseBffRequest,
} from "@/lib/service/friend.service";
import {
  createNotification,
  deleteNotification,
} from "@/lib/service/notification.service";
import { getPostByPostId } from "@/lib/service/post.service";
import { getMediaByMediaId } from "@/lib/service/media.service";
import { Link } from "expo-router";
import DetailsPost from "../forms/post/DetailsPost";
import DetailImage from "../forms/media/DetailImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCommentByCommentId } from "@/lib/service/comment.service";
import DetailVideo from "../forms/media/DetailVideo";
import { getTimestamp } from "@/lib/utils";

const getNotificationContent = (notification: any) => {
  switch (notification.type) {
    case "friend_request":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a friend request.`;
    case "bff_request":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a BFF request.`;
    case "friend_accept":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} accepted your friend request.`;
    case "bff_accept":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} accepted your BFF request.`;
    case "comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} commented on your post.`;
    case "comment_media":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} commented on your media.`;
    case "like":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your post.`;
    case "like_comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your comment.`;
    case "like_media":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} liked your media.`;
    case "reply_comment":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} replied to your comment.`;
    case "message":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} sent you a message.`;
    case "tags":
      return `${notification?.senderId.firstName} ${notification?.senderId.lastName} tagged you in a post.`;
    default:
      return "You have a new notification.";
  }
};

const Notifications = ({ notifications, setNotifications }: any) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [post, setPost] = useState<any>();
  const [image, setImage] = useState<any>();
  const [video, setVideo] = useState<any>();
  const [openDetailPost, setOpenDetailPost] = useState(false);
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [openDetailVideo, setOpenDetailVideo] = useState(false);
  const { profile } = useAuth();
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);

  const handleRefuseBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      console.log("id", id);
      console.log("userId", userId);
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      await unrequestBffOrRefuseBffRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleRefuseFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      console.log("id", id);
      console.log("userId", userId);
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptFriend = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      console.log("id", id);
      console.log("userId", userId);
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      await acceptAddFriend(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "friend_accept",
        },
        token
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptBff = async (
    id: string,
    userId: string,
    notificationId: string
  ) => {
    try {
      console.log("id", id);
      console.log("userId", userId);
      const token: string | null = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      await acceptAddBff(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await deleteNotification(notificationId, token); // Delete the notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId)
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "bff_accept",
        },
        token
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleClick = async (notification: any) => {
    switch (notification.type) {
      case "like":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId: string | null = await AsyncStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setNumberOfLikes(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_comment":
        try {
          if (notification.postId) {
            try {
              const data = await getPostByPostId(notification.postId);
              const detailsComments = await Promise.all(
                data.comments.map(async (comment: any) => {
                  return await getCommentByCommentId(comment);
                })
              );
              const userId: string | null = await AsyncStorage.getItem(
                "userId"
              );
              if (userId) {
                try {
                  const isUserLiked = data.likes.some(
                    (like: any) => like === userId
                  );
                  setIsLiked(isUserLiked);
                } catch (error) {
                  console.error("Invalid token:", error);
                }
              }
              setPost(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailPost(true);
            } catch (error) {
              console.error("Error fetching post data:", error);
            }
          } else {
            const data = await getMediaByMediaId(notification.mediaId);
            const detailsComments = await Promise.all(
              data.comments.map(async (comment: any) => {
                return await getCommentByCommentId(comment);
              })
            );
            const userId: string | null = await AsyncStorage.getItem("userId");
            if (userId) {
              try {
                const isUserLiked = data.likes.some(
                  (like: any) => like === userId
                );
                setIsLiked(isUserLiked);
              } catch (error) {
                console.error("Invalid token:", error);
              }
            }

            if (data.type === "image") {
              setImage(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "like_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId: string | null = await AsyncStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          if (data.type === "image") {
            setImage(data);
            setCommentsData(detailsComments);
            setNumberOfLikes(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setCommentsData(detailsComments);
            setNumberOfLikes(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId: string | null = await AsyncStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setNumberOfLikes(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "comment_media":
        try {
          const data = await getMediaByMediaId(notification.mediaId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId: string | null = await AsyncStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          if (data.type === "image") {
            setImage(data);
            setCommentsData(detailsComments);
            setNumberOfLikes(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailImage(true);
          } else {
            setVideo(data);
            setCommentsData(detailsComments);
            setNumberOfLikes(data.likes.length);
            setNumberOfComments(data.comments.length);
            setOpenDetailVideo(true);
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "reply_comment":
        try {
          if (notification.postId) {
            try {
              const data = await getPostByPostId(notification.postId);
              const detailsComments = await Promise.all(
                data.comments.map(async (comment: any) => {
                  return await getCommentByCommentId(comment);
                })
              );
              const userId: string | null = await AsyncStorage.getItem(
                "userId"
              );
              if (userId) {
                try {
                  const isUserLiked = data.likes.some(
                    (like: any) => like === userId
                  );
                  setIsLiked(isUserLiked);
                } catch (error) {
                  console.error("Invalid token:", error);
                }
              }
              setPost(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailPost(true);
            } catch (error) {
              console.error("Error fetching post data:", error);
            }
          } else {
            const data = await getMediaByMediaId(notification.mediaId);
            const detailsComments = await Promise.all(
              data.comments.map(async (comment: any) => {
                return await getCommentByCommentId(comment);
              })
            );
            const userId: string | null = await AsyncStorage.getItem("userId");
            if (userId) {
              try {
                const isUserLiked = data.likes.some(
                  (like: any) => like === userId
                );
                setIsLiked(isUserLiked);
              } catch (error) {
                console.error("Invalid token:", error);
              }
            }

            if (data.type === "image") {
              setImage(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailImage(true);
            } else {
              setVideo(data);
              setCommentsData(detailsComments);
              setNumberOfLikes(data.likes.length);
              setNumberOfComments(data.comments.length);
              setOpenDetailVideo(true);
            }
          }
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      case "tags":
        try {
          const data = await getPostByPostId(notification.postId);
          const detailsComments = await Promise.all(
            data.comments.map(async (comment: any) => {
              return await getCommentByCommentId(comment);
            })
          );
          const userId: string | null = await AsyncStorage.getItem("userId");
          if (userId) {
            try {
              const isUserLiked = data.likes.some(
                (like: any) => like === userId
              );
              setIsLiked(isUserLiked);
            } catch (error) {
              console.error("Invalid token:", error);
            }
          }
          setPost(data);
          setCommentsData(detailsComments);
          setNumberOfLikes(data.likes.length);
          setNumberOfComments(data.comments.length);
          setOpenDetailPost(true);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
        break;
      default:
        console.log("Notification type not handled");
        break;
    }
  };

  const filteredNotifications = notifications
    .filter(
      (notification: any) =>
        ![
          "report_post",
          "report_user",
          "report_comment",
          "report_message",
        ].includes(notification.type)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createAt);
      const dateB = new Date(b.createAt);
      return dateB - dateA; // Sắp xếp theo thời gian giảm dần (mới nhất trước)
    });

  return (
    <View className="flex flex-row w-full ">
      <View className="w-full">
        {filteredNotifications.map((notification: any) => (
          <View
            key={notification?._id}
            className="flex flex-row items-start mb-4 p-2 mx-3 rounded-xl"
            style={{
              flex: 1,
              backgroundColor:
                colorScheme === "dark" ? colors.dark[400] : colors.light[800], // Sử dụng giá trị màu từ file colors.js
            }}
          >
            <Link href={`/user/${notification.senderId._id}`} className="mr-4">
              <Image
                source={{
                  uri:
                    notification?.senderId.avatar ||
                    "https://i.pinimg.com/736x/5b/a6/cb/5ba6cb587d47b7bc29822a60cc61a840.jpg",
                }}
                className="w-12 h-12 rounded-full "
              />
            </Link>

            <TouchableOpacity
              className="flex-1"
              onPress={() => handleClick(notification)}
            >
              <Text
                className="text-sm font-mmedium mt-1 "
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors.light[500],
                }}
              >
                {getNotificationContent(notification)}
              </Text>

              <View className="flex flex-row justify-between w-1/2 mt-2">
                {notification?.type === "friend_request" && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        handleAcceptFriend(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: colors.primary[100], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text className="text-white font-msemibold">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleRefuseFriend(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? colors.dark[300]
                            : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text
                        className=" font-msemibold"
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : colors.light[500],
                        }}
                      >
                        Refuse
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                {notification?.type === "bff_request" && (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        handleAcceptBff(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor: colors.primary[100], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text className="text-white font-msemibold">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleRefuseBff(
                          notification.senderId._id,
                          profile._id,
                          notification._id
                        )
                      }
                      className="rounded-lg px-3 py-2"
                      style={{
                        backgroundColor:
                          colorScheme === "dark"
                            ? colors.dark[300]
                            : colors.light[700], // Sử dụng giá trị màu từ file colors.js
                      }}
                    >
                      <Text
                        className=" font-msemibold"
                        style={{
                          color:
                            colorScheme === "dark"
                              ? colors.dark[100]
                              : colors.light[500],
                        }}
                      >
                        Refuse
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className="text-gray-400 font-mregular text-xs mt-1">
                  {getTimestamp(notification?.createAt)}
                </Text>
              </View>
            </TouchableOpacity>
            {openDetailPost && (
              <Modal
                visible={openDetailPost}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setOpenDetailPost(false)}
              >
                <DetailsPost
                  post={post}
                  isModalVisible={openDetailPost}
                  setModalVisible={() => setOpenDetailPost(false)}
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
            )}
            {openDetailImage && (
              <Modal
                visible={openDetailImage}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setOpenDetailImage(false)}
              >
                <DetailImage
                  image={image}
                  isModalVisible={openDetailImage}
                  setModalVisible={setOpenDetailImage}
                  commentsData={commentsData}
                  setCommentsData={setCommentsData}
                />
              </Modal>
            )}
            {openDetailVideo && (
              <Modal
                visible={openDetailVideo}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setOpenDetailVideo(false)}
              >
                <DetailVideo
                  video={video}
                  isModalVisible={openDetailVideo}
                  setModalVisible={setOpenDetailVideo}
                  commentsData={commentsData}
                  setCommentsData={setCommentsData}
                />
              </Modal>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Notifications;
