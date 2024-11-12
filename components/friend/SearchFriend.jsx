import React, { useState } from "react";
import MyButton from "../share/MyButton";
import Svg, { Path } from "react-native-svg";
import { View, Text, FlatList, Image } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { colors } from "../../styles/colors";
import MyInput from "../share/MyInput";

const BackIcon = ({ size = 24, color = "black", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
      />
    </Svg>
  );
};

const RightArrow = ({ size = 24, color = "white", onPress }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 15 15"
      onPress={onPress}
    >
      <Path
        fill={color}
        d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414"
      />
    </Svg>
  );
};

const SearchFriend = ({ onClose }) => {
  const { colorScheme } = useTheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#92898A";

  // Dữ liệu giả
  const friendsData = [
    { name: "Nguyễn Văn A", phone: "0123456789" },
    { name: "Trần Thị B", phone: "0987654321" },
    { name: "Lê Văn C", phone: "0912345678" },
    { name: "Nguyễn Thị D", phone: "0123456790" },
    { name: "Trần Văn E", phone: "0987654312" },
  ];

  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [noResults, setNoResults] = useState(false); // Thêm state để kiểm tra không có kết quả

  const handleSearch = () => {
    const results = friendsData.filter((friend) =>
      friend.phone.includes(phoneNumber)
    );
    setSearchResults(results);
    setSuggestions([]); // Xóa gợi ý khi tìm kiếm
    setIsClickSearch(true);
    setNoResults(results.length === 0); // Kiểm tra xem có kết quả hay không
  };

  const handleInputChange = (text) => {
    setPhoneNumber(text);
    if (text) {
      const filteredSuggestions = friendsData.filter((friend) =>
        friend.phone.includes(text)
      );
      setSuggestions(filteredSuggestions); // Cập nhật gợi ý
    } else {
      setSuggestions([]); // Nếu input trống, xóa gợi ý
    }
    setNoResults(false); // Đặt lại trạng thái không có kết quả
  };

  return (
    <View className={`w-full h-full flex flex-col p-4 bg-white`}>
      <View className={`w-full`}>
        <View className={`w-full flex flex-row items-center gap-4`}>
          <View>
            <BackIcon size={24} color={iconColor} onPress={onClose} />
          </View>
          <View>
            <Text
              style={{
                color:
                  colorScheme === "dark"
                    ? colors.dark[100]
                    : colors["title-pink"],
              }}
              className={`text-[20px] font-mmedium`}
            >
              Tìm bạn
            </Text>
          </View>
        </View>
      </View>
      <View className={`w-full pt-5`}>
        <View className={`w-full flex flex-row items-center justify-between`}>
          <View className={`flex-1 pr-4`}>
            <MyInput
              placeholder={"Nhập số điện thoại"}
              value={phoneNumber}
              onChangeText={handleInputChange} // Cập nhật giá trị khi người dùng nhập
            />
          </View>
          <View>
            <MyButton
              borderRadius={50}
              title={<RightArrow size={24} color={"white"} />}
              width={40}
              height={40}
              backgroundColor="#FFAABB"
              borderColor="#92898A"
              onPress={handleSearch} // Thực hiện tìm kiếm khi nhấn nút
            />
          </View>
        </View>
      </View>
      {suggestions.length > 0 && (
        <View className={`mt-4 bg-gray-200 rounded-lg p-2`}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.phone}
            renderItem={({ item }) => (
              <Text
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors["title-pink"],
                }}
                className={`py-2 px-4 hover:bg-gray-300`} // Thêm hover effect nếu cần
                onPress={() => {
                  setPhoneNumber(item.phone); // Đặt số điện thoại khi nhấn vào gợi ý
                  setSuggestions([]); // Xóa gợi ý
                  setNoResults(false); // Đặt lại trạng thái không có kết quả
                }}
              >
                {item.name} - {item.phone}
              </Text>
            )}
          />
        </View>
      )}
      {isClickSearch && noResults ? ( // Chỉ hiển thị nếu đã tìm kiếm và không có kết quả
        <View className={`mt-4 w-full `}>
          <View>
            <Image
              source={require("../../assets/images/CannotFound.png")}
              style={{
                width: 350,
                height: 342,
                backgroundColor: "transparent",
              }} // Đặt backgroundColor thành transparent
              resizeMode="contain" // Hoặc "cover", tùy thuộc vào cách bạn muốn hình ảnh hiển thị
            />
          </View>
          <View
            className={`mt-4 w-full flex flex-row items-center justify-center `}
          >
            <Text>
              Không tìm thấy người dùng có số điện thoại{" "}
              <Text className={`font-msemibold `}>{phoneNumber}</Text>
            </Text>
          </View>
        </View>
      ) : (
        searchResults.length > 0 && (
          <View className={`mt-4 w-full `}>
            {searchResults.map((friend, index) => (
              <Text
                key={index}
                style={{
                  color:
                    colorScheme === "dark"
                      ? colors.dark[100]
                      : colors["title-pink"],
                }}
              >
                {friend.name} - {friend.phone}
              </Text>
            ))}
          </View>
        )
      )}
    </View>
  );
};

export default SearchFriend;
