import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps {
  title: string;
  color?: string;
  onPress?: () => void;
  size?: "small" | "large";
  fontColor?: string;
  border?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  onPress,
  size = "large",
  fontColor,
  border = "",
}) => {
  const { colorScheme } = useTheme();

  const backgroundColor = color ?? colors.primary[100];

  const textColor =
    fontColor ??
    (colorScheme === "dark" ? colors.dark[100] : colors.light[100]);

  const containerStyle = [
    styles.base,
    size === "small" ? styles.small : styles.large,
    {
      backgroundColor,
      borderWidth: border ? 1 : 0,
      borderColor: border ? border : undefined,
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: 138,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  large: {
    width: "100%",
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
  },
});

export default Button;
