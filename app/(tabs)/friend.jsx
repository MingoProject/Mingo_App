// Friend.js
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import MyButton from "../../components/share/MyButton"; // Import component MyButton
import LoiMoi from "../../components/friend/LoiMoi";
import BanBe from "../../components/friend/BanBe";
import { set } from "date-fns";
import SearchFriend from "../../components/friend/SearchFriend";

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
      case "loimoi":
        return <LoiMoi />;
      case "banbe":
        return <BanBe />;
      default:
        <LoiMoi />;
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
        <>
          <View className={`w-full p-4 h-full `}>
            <View className={`h-full w-full pb-2`}>
              <View
                className={` flex flex-row justify-between items-center pb-4`}
              >
                <View>
                  <Text
                    style={{
                      color:
                        colorScheme === "dark"
                          ? colors.dark[100]
                          : colors["title-pink"], // Sử dụng giá trị màu từ file colors.js
                    }}
                    className={`text-[26px] font-msemibold `}
                  >
                    Bạn bè
                  </Text>
                </View>

                <View>
                  <SearchIcon
                    size={28}
                    color={iconColor}
                    onPress={handleIsSearch}
                  />
                </View>
              </View>

              <View className={`flex flex-row justify-between pb-2 `}>
                <View className={`flex flex-row flex-1 gap-4 `}>
                  <View>
                    <MyButton
                      title="Lời mời"
                      onPress={() => setIsActiveTab("loimoi")}
                      paddingLeft={20} // Padding
                      paddingRight={20} // Padding
                      width={100}
                      height={40}
                      borderRadius={30} // Bo góc
                      fontSize={16} // Kích thước font chữ
                      isShadow={true}
                      isActive={isActiveTab === "loimoi"}
                    />
                  </View>
                  <View>
                    <MyButton
                      title="Bạn bè"
                      onPress={() => setIsActiveTab("banbe")}
                      paddingLeft={20} // Padding
                      paddingRight={20} // Padding
                      width={100}
                      height={40}
                      borderRadius={30} // Bo góc
                      fontSize={16} // Kích thước font chữ
                      isShadow={true}
                      isActive={isActiveTab === "banbe"}
                    />
                  </View>
                </View>
                <View>
                  <AddIcon size={28} color={iconColor} />
                </View>
              </View>
              <View>{renderContent()}</View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default Friend;
