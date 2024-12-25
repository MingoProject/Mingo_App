import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import MyButton from "../../components/share/MyButton"; // Import component MyButton
import Following from "../../components/friend/Following";
import Block from "../../components/friend/Block";
import BestFriend from "../../components/friend/BestFriend";
import MyFriend from "../../components/friend/MyFriend";
import SearchFriend from "../../components/friend/SearchFriend";
import Follower from "@/components/friend/Follower";
import { PlusIcon } from "@/components/icons/Icons";

const SearchIcon = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="m19.6 21-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
      />
    </Svg>
  );
};

const AddIcon = ({ size = 24, color = "black" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <Path fill={color} d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
    </Svg>
  );
};

const Friend = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isActiveTab, setIsActiveTab] = useState("loimoi");
  const [isSearch, setIsSearch] = useState(false);

  const renderContent = () => {
    switch (isActiveTab) {
      // case "follower":
      //   return <Follower />;
      case "loimoi":
        return <Following />;
      case "banbe":
        return <MyFriend />;
      case "banthan":
        return <BestFriend />;
      case "block":
        return <Block />;
      case "follower":
        return <Follower />;
      default:
        return <Following />; // Default case for rendering content
    }
  };

  const handleIsSearch = () => {
    setIsSearch(true);
  };

  const handleOnClose = () => {
    setIsSearch(false);
  };

  return (
    <>
      {isSearch ? (
        <SearchFriend onClose={handleOnClose} />
      ) : (
        <View
          className="w-full p-4 h-full"
          style={{
            paddingTop: Platform.OS === "android" ? 14 : 12, // Android: 0, iOS: 12
            backgroundColor:
              colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Use color from colors.js
            flex: 1,
          }}
        >
          <View className="h-full w-full pb-2">
            <View className="flex flex-row justify-between items-center pb-4">
              <View>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "600",
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors["title-pink"], // Use color from colors.js
                  }}
                  className="text-[26px] font-msemibold"
                >
                  Friend
                </Text>
              </View>

              <View className="flex-row">
                {/* <SearchIcon
                  size={28}
                  color={iconColor}
                  onPress={handleIsSearch}
                /> */}
                <TouchableOpacity className="ml-2" onPress={handleIsSearch}>
                  <AddIcon size={27} color={iconColor} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: "row", // Align buttons horizontally
                gap: 8, // Add space between buttons
              }}
              showsHorizontalScrollIndicator={false}
              className="pb-2 mt-3"
            >
              <View className="w-32">
                <TouchableOpacity
                  className="mx-auto"
                  onPress={() => setIsActiveTab("loimoi")}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      color:
                        isActiveTab === "loimoi"
                          ? colors.primary[100] // màu chữ khi active
                          : colorScheme === "dark"
                          ? colors.dark[100] // màu chữ khi không active và trong dark mode
                          : colors.light[500], // màu chữ khi không active và trong light mode
                      borderBottomWidth: isActiveTab === "loimoi" ? 2 : 0, // đường viền dưới khi active
                      borderBottomColor:
                        isActiveTab === "loimoi"
                          ? colors.primary[100]
                          : "transparent", // màu đường viền dưới
                    }}
                    className="text-[16px] font-mregular "
                  >
                    Following
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="w-28">
                <TouchableOpacity
                  className="mx-auto"
                  onPress={() => setIsActiveTab("banbe")}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      color:
                        isActiveTab === "banbe"
                          ? colors.primary[100] // màu chữ khi active
                          : colorScheme === "dark"
                          ? colors.dark[100] // màu chữ khi không active và trong dark mode
                          : colors.light[500], // màu chữ khi không active và trong light mode
                      borderBottomWidth: isActiveTab === "banbe" ? 2 : 0, // đường viền dưới khi active
                      borderBottomColor:
                        isActiveTab === "banbe"
                          ? colors.primary[100]
                          : "transparent", // màu đường viền dưới
                    }}
                    className="text-[16px] font-mregular "
                  >
                    Friend
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="w-32">
                <TouchableOpacity
                  className="mx-auto"
                  onPress={() => setIsActiveTab("banthan")}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      color:
                        isActiveTab === "banthan"
                          ? colors.primary[100] // màu chữ khi active
                          : colorScheme === "dark"
                          ? colors.dark[100] // màu chữ khi không active và trong dark mode
                          : colors.light[500], // màu chữ khi không active và trong light mode
                      borderBottomWidth: isActiveTab === "banthan" ? 2 : 0, // đường viền dưới khi active
                      borderBottomColor:
                        isActiveTab === "banthan"
                          ? colors.primary[100]
                          : "transparent", // màu đường viền dưới
                    }}
                    className="text-[16px] font-mregular "
                  >
                    Bestfriend
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="w-28">
                <TouchableOpacity
                  className="mx-auto"
                  onPress={() => setIsActiveTab("follower")}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      color:
                        isActiveTab === "follower"
                          ? colors.primary[100] // màu chữ khi active
                          : colorScheme === "dark"
                          ? colors.dark[100] // màu chữ khi không active và trong dark mode
                          : colors.light[500], // màu chữ khi không active và trong light mode
                      borderBottomWidth: isActiveTab === "follower" ? 2 : 0, // đường viền dưới khi active
                      borderBottomColor:
                        isActiveTab === "follower"
                          ? colors.primary[100]
                          : "transparent", // màu đường viền dưới
                    }}
                    className="text-[16px] font-mregular "
                  >
                    Follower
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="w-28">
                <TouchableOpacity
                  className="mx-auto"
                  onPress={() => setIsActiveTab("block")}
                >
                  <Text
                    style={{
                      fontSize: 16,

                      color:
                        isActiveTab === "block"
                          ? colors.primary[100] // màu chữ khi active
                          : colorScheme === "dark"
                          ? colors.dark[100] // màu chữ khi không active và trong dark mode
                          : colors.light[500], // màu chữ khi không active và trong light mode
                      borderBottomWidth: isActiveTab === "block" ? 2 : 0, // đường viền dưới khi active
                      borderBottomColor:
                        isActiveTab === "block"
                          ? colors.primary[100]
                          : "transparent", // màu đường viền dưới
                    }}
                    className="text-[16px] font-mregular "
                  >
                    Block
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View>{renderContent()}</View>
          </View>
        </View>
      )}
    </>
  );
};

export default Friend;
