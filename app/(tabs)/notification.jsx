import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors"; // import màu sắc từ file colors.js
import MyButton from "../../components/share/MyButton";
import NotificationCard from "../../components/notifications/NotificationCard";
import { Notifications } from "../../components/share/data";

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

const Notification = () => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";
  const [isSearch, setIsSearch] = useState(false);

  const handleIsSearch = () => {
    setIsSearch(true);
  };

  const handleOnClose = () => {
    setIsSearch(false);
  };

  const renderHeader = () => (
    <View
      className={`flex flex-row justify-between items-center pb-2`}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View>
        <Text
          style={{
            color:
              colorScheme === "dark" ? colors.dark[100] : colors["title-pink"], // Sử dụng giá trị màu từ file colors.js
          }}
          className={`text-[26px] font-msemibold `}
        >
          Thông báo
        </Text>
      </View>

      <View>
        <SearchIcon size={28} color={iconColor} onPress={handleIsSearch} />
      </View>
    </View>
  );

  return (
    <View
      className={`w-full p-4 pb-0 h-full `}
      style={{
        backgroundColor:
          colorScheme === "dark" ? colors.dark[300] : colors.light[700], // Sử dụng giá trị màu từ file colors.js
        flex: 1,
      }}
    >
      <View className={` h-full w-full`}>
        {/* <View className={`flex flex-row justify-between items-center`}>
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
              Thông báo
            </Text>
          </View>

          <View>
            <SearchIcon size={28} color={iconColor} onPress={handleIsSearch} />
          </View>
        </View> */}
        <FlatList
          data={Notifications} // Use the fake data here
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader} // Sử dụng component tiêu đề
          renderItem={({ item }) => <NotificationCard item={item} />}
        />
      </View>
    </View>
  );
};

export default Notification;
