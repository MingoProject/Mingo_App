import { getMyVideos, getMyImages } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Modal } from "react-native";
import DetailImage from "../media/DetailImage";

const ImageProfile = ({ userId }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const fetchImagesdata = async () => {
    try {
      // const userId = await AsyncStorage.getItem("userId");
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
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(item); // Lưu hình ảnh được chọn
              setModalVisible(true); // Hiển thị modal
            }}
            key={index}
            className="flex flex-col items-center mb-4"
            style={{ width: "33%" }}
          >
            <Image
              source={{ uri: item.url }}
              className="h-[100px] w-[100px] rounded-md"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedImage(null);
        }}
      >
        {selectedImage && (
          <DetailImage
            setModalVisible={setModalVisible}
            image={selectedImage}
          />
        )}
      </Modal>
    </View>
  );
};

export default ImageProfile;
