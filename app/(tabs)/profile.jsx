import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import {
  PictureIcon,
  VideoIcon,
  EmotionIcon,
  LikeIcon,
  CommentIcon,
  ShareIcon,
  SettingsIcon,
} from "../../components/icons/Icons";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import Setting from "../../components/forms/profile/Setting";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { colorScheme, toggleColorScheme } = useTheme();
  const [setting, setSetting] = useState(false);
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const fakeUser = {
    userId: "652c02b2fc13ae1c41000002",
    username: "john_doe",
    fullname: "John Doe",
    numberphone: "0123456789",
    email: "john.doe@example.com",
    birthday: new Date("1990-01-01"),
    gender: "male",
    password: "securepassword",
    avatar: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
    background: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
    address: "123 Main Street, New York, NY",
    job: "Software Engineer",
    hobbies: ["coding", "reading", "travelling"],
    bio: "ರ ‿ ರ.  A passionate developer who loves to build things.",
    nickName: "Johnny",
    friends: [
      {
        name: "Jane Smith",
        avatar: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
      {
        name: "Alice Johnson",
        avatar: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
      {
        name: "Bob Brown",
        avatar: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"),
      },
    ],
    bestFriends: [
      { name: "Jane Smith", avatar: "https://example.com/avatar/jane.jpg" },
      { name: "Bob Brown", avatar: "https://example.com/avatar/bob.jpg" },
    ],
    following: [
      { name: "Chris Evans", avatar: "https://example.com/avatar/chris.jpg" },
      { name: "Emily Davis", avatar: "https://example.com/avatar/emily.jpg" },
    ],
    block: [
      { name: "Tom Hanks", avatar: "https://example.com/avatar/tom.jpg" },
    ],
    isAdmin: false,
  };
  const fakeUsers = [
    {
      _id: "652c02b2fc13ae1c41000002",
      userName: "Huỳnh",
      userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
    },
    {
      _id: "652c02b2fc13ae1c41000011",
      userName: "Nguyễn",
      userAvatar: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"),
    },
  ];

  const fakeMediaData = [
    {
      _id: "652c02b2fc13ae1c41000001", // ID giả
      url: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"), // URL của hình ảnh
      type: "image", // Loại là hình ảnh
      caption: "Đây là ảnh bún đậu", // Chú thích cho hình ảnh
      createdAt: new Date("2024-08-01T10:00:00Z"), // Thời gian tạo
      author: "652c02b2fc13ae1c41000002", // ID của người dùng
      postId: "652c02b2fc13ae1c41000003", // ID bài viết
      likes: ["652c02b2fc13ae1c41000004", "652c02b2fc13ae1c41000005"], // Người dùng đã thích
      comments: ["652c02b2fc13ae1c41000006", "652c02b2fc13ae1c41000007"], // Danh sách bình luận
      shares: ["652c02b2fc13ae1c41000008"], // Danh sách người dùng chia sẻ
    },
    {
      _id: "652c02b2fc13ae1c41000009", // ID giả
      url: require("../../assets/images/950d0d7b19b956a5052b7d2c362c9871.jpg"), // URL của video
      type: "video", // Loại là video
      caption: "Video nấu bún đậu", // Chú thích cho video
      createdAt: new Date("2024-08-01T12:00:00Z"), // Thời gian tạo
      author: "652c02b2fc13ae1c41000002", // ID của người dùng
      postId: "652c02b2fc13ae1c41000003", // ID bài viết
      likes: ["652c02b2fc13ae1c41000004"], // Người dùng đã thích
      comments: ["652c02b2fc13ae1c41000006"], // Danh sách bình luận
      shares: ["652c02b2fc13ae1c41000005"], // Danh sách người dùng chia sẻ
    },
    {
      _id: "652c02b2fc13ae1c41000010", // ID giả
      url: require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"), // URL của hình ảnh
      type: "image", // Loại là hình ảnh
      caption: "Bún đậu tự làm ở nhà", // Chú thích khác
      createdAt: new Date("2024-08-02T08:30:00Z"), // Thời gian tạo
      author: "652c02b2fc13ae1c41000011", // ID của người dùng khác
      postId: "652c02b2fc13ae1c41000012", // ID bài viết khác
      likes: ["652c02b2fc13ae1c41000013"], // Người dùng đã thích
      comments: ["652c02b2fc13ae1c41000014", "652c02b2fc13ae1c41000015"], // Danh sách bình luận
      shares: ["652c02b2fc13ae1c41000016"], // Danh sách người dùng chia sẻ
    },
  ];

  const fakePostData = [
    {
      _id: "652c02b2fc13ae1c41000003", // ID của bài viết
      content: "Hôm nay ăn bún đậuu", // Nội dung bài viết
      media: ["652c02b2fc13ae1c41000001", "652c02b2fc13ae1c41000009"], // ID của media liên quan
      url: "https://example.com/bun-dau", // URL liên kết
      createdAt: new Date("2024-08-01T10:00:00Z"), // Thời gian tạo
      author: "652c02b2fc13ae1c41000002", // ID của người đăng bài
      shares: ["652c02b2fc13ae1c41000008"], // Người dùng chia sẻ
      likes: [
        "652c02b2fc13ae1c41000004",
        "652c02b2fc13ae1c41000005",
        "652c02b2fc13ae1c41000006",
      ], // Danh sách người dùng đã thích
      comments: [
        { text: "Ngon quá!", user: "652c02b2fc13ae1c41000006" }, // Bình luận từ An
        { text: "Nhìn hấp dẫn quá", user: "652c02b2fc13ae1c41000005" }, // Bình luận từ Minh
        { text: "Muốn ăn thử!", user: "652c02b2fc13ae1c41000004" }, // Bình luận từ Lan
      ],
      location: "Hà Nội, Việt Nam", // Vị trí
      privacy: {
        type: "friends", // Quyền riêng tư
        allowedUsers: ["652c02b2fc13ae1c41000005", "652c02b2fc13ae1c41000006"], // Danh sách người xem được phép
      },
    },
    {
      _id: "652c02b2fc13ae1c41000012", // ID của bài viết
      content: "Thử làm bún đậu tại nhà", // Nội dung bài viết khác
      media: ["652c02b2fc13ae1c41000010"], // ID của media liên quan
      url: "https://example.com/bun-dau-nha", // URL liên kết
      createdAt: new Date("2024-08-02T09:00:00Z"), // Thời gian tạo
      author: "652c02b2fc13ae1c41000011", // ID của người đăng bài khác
      shares: ["652c02b2fc13ae1c41000016"], // Người dùng chia sẻ
      likes: ["652c02b2fc13ae1c41000013"], // Danh sách người dùng đã thích
      comments: [
        { text: "Tự làm à? Tuyệt quá!", user: "652c02b2fc13ae1c41000014" }, // Bình luận từ Tùng
        { text: "Phải thử thôi", user: "652c02b2fc13ae1c41000015" }, // Bình luận từ Hồng
      ],
      location: "Sài Gòn, Việt Nam", // Vị trí khác
      privacy: {
        type: "public", // Quyền riêng tư
        allowedUsers: [], // Mọi người đều có thể xem
      },
    },
  ];

  const picturesData = [
    "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg", // Mickey Mouse image
    "https://i.pinimg.com/originals/ff/ec/81/ffec81a1a3ee6a557433bcc626e1dfc6.jpg", // Minnie Mouse image
    "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg", // Donald Duck image
    "https://i.pinimg.com/originals/70/3f/f8/703ff89cf6cad803da55cf5cc9ff42fd.jpg", // Goofy image
    "https://i.pinimg.com/originals/8d/87/4b/8d874bdf21d904fece1f06a83bfb8160.jpg", // Pluto image
    "https://i.pinimg.com/originals/22/ac/ca/22accaa81d76b8e6aace6c5562e00f8e.jpg", // Daisy Duck image
    "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg", // Simba image
    "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg", // Ariel image
    "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg", // Elsa image
    "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg", // Woody image
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <View
            style={{
              backgroundColor:
                colorScheme === "dark" ? colors.dark[300] : colors.light[700],
            }}
          >
            {/* Phần Header */}
            <>
              <TouchableOpacity
                className={`h-auto w-full rounded-lg px-2 py-4 ${
                  colorScheme === "dark" ? "bg-dark-300" : "bg-light-700"
                }`}
              >
                <View className="flex flex-row items-center px-4 py-1">
                  <View className="h-[40px] w-[40px] overflow-hidden rounded-full">
                    <Image
                      source={require("../../assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg")}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  </View>
                  <TextInput
                    placeholder="Share something..."
                    placeholderTextColor="#D9D9D9"
                    className={`ml-3 flex-1 h-[40px] text-[#D9D9D9] font-mregular px-4 rounded-full text-sm ${
                      colorScheme === "dark" ? "bg-dark-200" : "bg-light-600"
                    }`}
                    editable={false}
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
              </TouchableOpacity>

              <View
                style={{
                  height: 1,
                  backgroundColor: "#D9D9D9",
                  width: "100%",
                  marginVertical: 5,
                }}
              />
            </>

            {/* Nội dung của từng bài post */}
            {fakePostData.map((item) => (
              <View key={item._id} className="p-4 bg-transparent mb-4">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={
                      fakeUsers.find((user) => user._id === item.author)
                        ?.userAvatar
                    }
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-4">
                    <Text
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                      className="font-msemibold text-[17px]"
                    >
                      {
                        fakeUsers.find((user) => user._id === item.author)
                          ?.userName
                      }
                    </Text>
                    <Text className="text-[#D9D9D9] font-mregular mt-1 text-sm">
                      {item.createdAt.toDateString()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[500],
                    flex: 1,
                  }}
                  className="mb-4 font-mregular mt-3 text-[15px]"
                >
                  {item.content}
                </Text>

                {item.media && (
                  <View>
                    {item.media.map((mediaId) => {
                      const media = fakeMediaData.find(
                        (m) => m._id === mediaId
                      );
                      if (!media) return null;
                      return (
                        <View key={mediaId} className="mr-2">
                          {media.type === "image" ? (
                            <Image
                              source={media.url}
                              className="w-96 h-96 rounded-lg"
                            />
                          ) : (
                            <View className="w-40 h-40 bg-gray-200 rounded-lg justify-center items-center">
                              <Text>Video</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

                <View className="flex-row mt-2 justify-around">
                  <TouchableOpacity className="flex-row items-center mr-4">
                    <LikeIcon size={25} color={iconColor} />
                    <Text
                      className="ml-1 text-gray-700"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                    >
                      {item.likes.length} Likes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center mr-4">
                    <CommentIcon size={25} color={iconColor} />
                    <Text
                      className="ml-1 text-gray-700"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                    >
                      {item.comments.length} Comments
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="flex-row items-center">
                    <ShareIcon size={25} color={iconColor} />
                    <Text
                      className="ml-1 text-gray-700"
                      style={{
                        color:
                          colorScheme === "dark"
                            ? colors.dark[100]
                            : colors.light[500],
                      }}
                    >
                      {item.shares.length} Shares
                    </Text>
                  </TouchableOpacity>
                </View>

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
            ))}
          </View>
        );

      case "photos":
        return (
          <View className="flex flex-wrap mt-2">
            <View className="flex flex-row flex-wrap">
              {picturesData.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center mb-4"
                  style={{ width: "33%" }}
                >
                  <Image
                    source={{ uri: item }}
                    className="h-[100px] w-[100px] rounded-md" // Đặt width bằng 100%
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        );
      case "videos":
        return (
          <View className="flex flex-wrap mt-2">
            <View className="flex flex-row flex-wrap">
              {picturesData.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center mb-4"
                  style={{ width: "33%" }}
                >
                  <Image
                    source={{ uri: item }}
                    className="h-[100px] w-[100px] rounded-md" // Đặt width bằng 100%
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="p-3"
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className="flex flex-row">
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500], // Sử dụng màu text phù hợp
          }}
          className="text-[20px] font-msemibold"
        >
          {fakeUser.fullname}
        </Text>
        <TouchableOpacity onPress={() => setSetting(true)} className="ml-auto">
          <SettingsIcon size={27} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View className="mt-4">
        <Image
          source={fakeUser.avatar}
          className="w-full h-[152px] rounded-lg"
        />
      </View>
      <View className="flex flex-row mt-2">
        <View className="h-[105px] w-[105px] overflow-hidden rounded-full">
          <Image
            source={fakeUser.avatar}
            style={{ width: 105, height: 105, borderRadius: 20 }}
          />
        </View>
        <View className="p-3 w-[266px]">
          <Text
            style={{
              color:
                colorScheme === "dark" ? colors.dark[100] : colors.light[500],
            }}
            className="font-mregular text-[14px] "
          >
            {fakeUser.bio}
          </Text>
        </View>
      </View>
      <View className="flex  flex-row justify-start  mx-[10%] mt-10">
        <TouchableOpacity onPress={() => setActiveTab("posts")}>
          <Text
            style={{
              fontSize: 14,

              color:
                activeTab === "posts"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active và trong dark mode
                  : colors.light[500], // màu chữ khi không active và trong light mode
              borderBottomWidth: activeTab === "posts" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "posts" ? colors.primary[100] : "transparent", // màu đường viền dưới
            }}
            className="text-[14px] font-mregular "
          >
            Bài viết
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("photos")}>
          <Text
            style={{
              fontSize: 14,
              color:
                activeTab === "photos"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active và trong dark mode
                  : colors.light[500], // màu chữ khi không active và trong light mode
              borderBottomWidth: activeTab === "photos" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "photos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
            }}
            className="text-[14px] font-mregular ml-5"
          >
            Ảnh
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("videos")}>
          <Text
            style={{
              fontSize: 14,
              color:
                activeTab === "videos"
                  ? colors.primary[100] // màu chữ khi active
                  : colorScheme === "dark"
                  ? colors.dark[100] // màu chữ khi không active trong dark mode
                  : colors.light[500], // màu chữ khi không active trong light mode
              borderBottomWidth: activeTab === "videos" ? 2 : 0, // đường viền dưới khi active
              borderBottomColor:
                activeTab === "videos" ? colors.primary[100] : "transparent", // màu đường viền dưới khi active
            }}
            className="text-[14px] font-mregular ml-5"
          >
            Video
          </Text>
        </TouchableOpacity>
      </View>

      <View className=" py-3 h-auto">
        <View
          style={{
            height: 1,
            backgroundColor: "#D9D9D9",
            width: "100%",
            marginVertical: 5,
          }}
        />
        {renderContent()}
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={setting}
        onRequestClose={() => setSetting(false)}
      >
        <Setting setSetting={setSetting} />
      </Modal>
    </ScrollView>
  );
};

export default Profile;
