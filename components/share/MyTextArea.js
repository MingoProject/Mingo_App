import React from "react";
import { TextInput, View } from "react-native";

const MyTextArea = ({ value, onChangeText, placeholder }) => {
  return (
    <View className="mb-4 h-80 w-full">
      <TextInput
        className="rounded-lg p-2 h-full w-full font-mmedium"
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF" // Màu sắc cho placeholder (tùy chọn)
        style={{ textAlign: "left" }} // Căn trái cho placeholder
        textAlignVertical="top" // Để căn chỉnh văn bản từ trên
      />
    </View>
  );
};

export default MyTextArea;
