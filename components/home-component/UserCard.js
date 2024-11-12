import React from "react";
import { View, Text, FlatList } from "react-native";
import Card from "../friend/Card";

const UserCard = ({ item }) => {
  return <Card item={item} actionButton="Chấp nhận" isLoiMoi={true} />;
};

export default UserCard;
