import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons từ @expo/vector-icons

export const EndCallCard = ({ duration }: { duration: string }) => {
  return (
    <View
      style={{
        padding: 8,
        borderRadius: 12,
        flexDirection: "column", // Căn chỉnh theo hàng ngang
        alignItems: "center",
      }}
    >
      {/* Biểu tượng điện thoại kết thúc */}
      {/* <Ionicons
        name="call-outline" // Chọn biểu tượng "call" từ Ionicons
        size={24}
        color="red" // Màu sắc cho biểu tượng
        style={{ marginRight: 10 }} // Khoảng cách giữa biểu tượng và văn bản
      /> */}
      {/* Text hiển thị thời gian cuộc gọi */}
      <Text
        style={{
          fontWeight: "bold",
          padding: 4,
          fontSize: 16,
          color: "#333", // Màu chữ tối cho dễ đọc
        }}
      >
        Cuộc gọi kết thúc
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          color: "#333", // Màu chữ tối cho dễ đọc
        }}
      >
        Thời gian: {duration}
      </Text>
    </View>
  );
};
