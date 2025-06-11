import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps {
  title: any;
  color?: string;
  onPress?: () => void;
  size?: "small" | "large";
  fontColor?: string;
  outline?: boolean;
  border?: boolean;
  className?: string;
  borderRadius?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  onPress,
  size = "large",
  fontColor,
  outline,
  border = false,
  className,
  borderRadius = 12,
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = outline
    ? "transparent"
    : (color ?? colors.primary[100]);
  const textColor =
    fontColor ?? (isDark ? colors.dark[100] : colors.light[100]);
  const borderColor = isDark ? "#FFFFFF" : "#000000";

  const containerStyle = [
    styles.base,
    size === "small" ? styles.small : styles.large,
    {
      borderRadius,
      backgroundColor,
      borderWidth: border ? 1 : 0,
      borderColor: border ? borderColor : "transparent",
    },
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.8}
      className={className}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    // borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: 140,
    paddingVertical: 10,
    paddingHorizontal: 24,
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
