import { useTheme } from "@/context/ThemeContext";
import { colors } from "@/styles/colors";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const UserCard = ({ item }: any) => {
  const { colorScheme } = useTheme();

  return (
    <View
      className="mx-2"
      style={[
        styles.card,
        {
          backgroundColor:
            colorScheme === "dark" ? colors.dark[400] : colors.light[700],
        },
      ]}
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text
        style={[
          styles.name,
          {
            color:
              colorScheme === "dark" ? colors.dark[100] : colors.light[500],
          },
        ]}
      >
        {item.firstName} {item.lastName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    // shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default UserCard;
