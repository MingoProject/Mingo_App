import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import Following from "../../components/shared/friend/Following";
import Block from "../../components/shared/friend/Blocked";
import BestFriend from "../../components/shared/friend/BestFriend";
import MyFriend from "../../components/shared/friend/Friend";
import SearchFriend from "../../components/friend/SearchFriend";
import Follower from "@/components/shared/friend/Follower";
import { AddIcon } from "@/components/icons/Icons";
import Tab from "@/components/share/ui/tab";
import Blocked from "../../components/shared/friend/Blocked";
import SuggestedFriend from "@/components/shared/friend/SuggestedFriend";

const Friend = () => {
  const { colorScheme } = useTheme();
  const iconColor =
    colorScheme === "dark" ? colors.dark[100] : colors.light[100];
  const [isActiveTab, setIsActiveTab] = useState("loimoi");
  const [isSearch, setIsSearch] = useState(false);

  const renderContent = () => {
    switch (isActiveTab) {
      case "following":
        return <Following />;
      case "friend":
        return <MyFriend />;
      case "bff":
        return <BestFriend />;
      case "blocked":
        return <Blocked />;
      case "follower":
        return <Follower />;
      case "suggested":
        return <SuggestedFriend />;
      default:
        return <Following />;
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
          className="w-full p-4 h-full space-y-6"
          style={{
            paddingTop: Platform.OS === "android" ? 14 : 52,
            backgroundColor:
              colorScheme === "dark" ? colors.dark[500] : colors.light[500], // Sử dụng giá trị màu từ file colors.js
            flex: 1,
          }}
        >
          <View className="h-full w-fit">
            <View className="flex flex-row justify-between items-center pb-4">
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    color:
                      colorScheme === "dark"
                        ? colors.dark[100]
                        : colors.light[100],
                  }}
                  className="font-msemibold"
                >
                  Friends
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
                flexDirection: "row",
                gap: 10,
              }}
              showsHorizontalScrollIndicator={false}
              className="pb-2 mt-3"
            >
              <View className="w-auto">
                <Tab
                  content="Following"
                  isActive={isActiveTab === "following"}
                  onClick={() => setIsActiveTab("following")}
                />
              </View>
              <View className="w-auto">
                <Tab
                  content="Friend"
                  isActive={isActiveTab === "friend"}
                  onClick={() => setIsActiveTab("friend")}
                />
              </View>

              <View className="w-auto">
                <Tab
                  content="Best Friend"
                  isActive={isActiveTab === "bff"}
                  onClick={() => setIsActiveTab("bff")}
                />
              </View>
              <View className="w-auto">
                <Tab
                  content="Blocked"
                  isActive={isActiveTab === "blocked"}
                  onClick={() => setIsActiveTab("blocked")}
                />
              </View>
              <View className="w-auto">
                <Tab
                  content="Follower"
                  isActive={isActiveTab === "follower"}
                  onClick={() => setIsActiveTab("follower")}
                />
              </View>
              <View className="w-auto">
                <Tab
                  content="Suggested friends"
                  isActive={isActiveTab === "suggested"}
                  onClick={() => setIsActiveTab("suggested")}
                />
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
