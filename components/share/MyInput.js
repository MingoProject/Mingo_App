import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Sử dụng hook để lấy colorScheme

const MyInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  width = "100%",
  height = 40,
  borderRadius = 20,
  borderWidth = 1,
  borderColor,
  backgroundColor = "white",
  color = "black",
  padding = 10,
  fontSize = 14,
  fontWeight,
  onSubmit,
  fontFamily,
}) => {
  const { colorScheme } = useTheme(); // Lấy colorScheme từ context

  const styles = StyleSheet.create({
    inputContainer: {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      borderWidth: borderWidth,
      borderColor: borderColor || (colorScheme === "dark" ? "#444" : "#ccc"), // Màu viền mặc định
      padding: padding,
    },
    input: {
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontFamily: fontFamily,
      flex: 1, // Để TextInput mở rộng hết chiều cao của container
    },
  });

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} // Màu placeholder
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

export default MyInput;
