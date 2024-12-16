import { getMyVideos, getMyImages } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Modal } from "react-native";
import DetailImage from "../media/DetailImage";
import { getMediaByMediaId } from "@/lib/service/media.service";

const ImageProfile = ({ userId }: any) => {
  const [images, setImages] = useState<any[]>([]);
  // const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchImagesdata = async () => {
    try {
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

  const handleClick = async (image: any) => {
    try {
      const data = await getMediaByMediaId(image._id);
      setSelectedImage(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error loading image details:", error);
    }
  };

  return (
    <View className="flex flex-wrap mt-2">
      <View className="flex flex-row flex-wrap">
        {images.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              handleClick(item); // Hiển thị modal
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
        visible={openModal}
        onRequestClose={
          () => setOpenModal(false)
          // setSelectedImage(null);
        }
      >
        {openModal && (
          <DetailImage
            isModalVisible={openModal}
            setModalVisible={setOpenModal}
            image={selectedImage}
          />
        )}
      </Modal>
    </View>
  );
};

export default ImageProfile;
