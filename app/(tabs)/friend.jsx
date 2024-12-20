import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  ScrollView,
  TouchableOpacity,
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
      case "follower":
        return <Follower />;
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
          className="w-full p-4 h-full pt-12"
          style={{
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
              className="pb-2"
            >
              <MyButton
                title="Follower"
                onPress={() => setIsActiveTab("follower")}
                paddingLeft={20}
                paddingRight={20}
                width={130}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "follower"}
                backgroundColor={
                  isActiveTab === "follower"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[200]
                    : colors.light[600]
                }
                titleStyle={{
                  color:
                    isActiveTab === "follower"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />
              <MyButton
                title="Followings"
                onPress={() => setIsActiveTab("loimoi")}
                paddingLeft={20}
                paddingRight={20}
                width={130}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "loimoi"}
                backgroundColor={
                  isActiveTab === "loimoi"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[800]
                }
                titleStyle={{
                  color:
                    isActiveTab === "loimoi"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />
              <MyButton
                title="Friends"
                onPress={() => setIsActiveTab("banbe")}
                paddingLeft={20}
                paddingRight={20}
                width={100}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "banbe"}
                backgroundColor={
                  isActiveTab === "banbe"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[800]
                }
                titleStyle={{
                  color:
                    isActiveTab === "banbe"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />
              <MyButton
                title="Best Friends"
                onPress={() => setIsActiveTab("banthan")}
                paddingLeft={20}
                paddingRight={20}
                width={135}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "banthan"}
                backgroundColor={
                  isActiveTab === "banthan"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[800]
                }
                titleStyle={{
                  color:
                    isActiveTab === "banthan"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />

              <MyButton
                title="Followers"
                onPress={() => setIsActiveTab("follower")}
                paddingLeft={20}
                paddingRight={20}
                width={130}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "follower"}
                backgroundColor={
                  isActiveTab === "follower"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[800]
                }
                titleStyle={{
                  color:
                    isActiveTab === "follower"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />

              <MyButton
                title="Block"
                onPress={() => setIsActiveTab("block")}
                paddingLeft={20}
                paddingRight={20}
                width={100}
                height={40}
                borderRadius={30}
                fontSize={16}
                isShadow={true}
                isActive={isActiveTab === "block"}
                backgroundColor={
                  isActiveTab === "block"
                    ? colors.primary[100]
                    : colorScheme === "dark"
                    ? colors.dark[400]
                    : colors.light[800]
                }
                titleStyle={{
                  color:
                    isActiveTab === "block"
                      ? colors.light[100]
                      : colorScheme === "dark"
                      ? colors.light[300]
                      : colors.dark[700],
                }}
              />
            </ScrollView>

            <View>{renderContent()}</View>
          </View>
        </View>
      )}
    </>
  );
};

export default Friend;
