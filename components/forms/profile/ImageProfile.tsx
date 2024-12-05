import { getMyVideos, getMyImages } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";

const ImageProfile = () => {
  const [images, setImages] = useState<any[]>([]);

  const fetchImagesdata = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = await getMyImages(userId);
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchImagesdata();
  }, []);

  return (
    <View className="flex flex-wrap mt-2">
      <View className="flex flex-row flex-wrap">
        {images.map((item, index) => (
          <View
            key={index}
            className="flex flex-col items-center mb-4"
            style={{ width: "33%" }}
          >
            <Image
              source={{ uri: item.url }}
              className="h-[100px] w-[100px] rounded-md" // Đặt width bằng 100%
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ImageProfile;
