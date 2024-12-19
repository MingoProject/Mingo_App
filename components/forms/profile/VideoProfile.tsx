import { getMyVideos } from "@/lib/service/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { View, Image, TouchableOpacity, Modal } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { getMediaByMediaId } from "@/lib/service/media.service";
import DetailVideo from "../media/DetailVideo";

const VideoProfile = ({ userId }: any) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchVideosdata = async () => {
    try {
      // const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const data = await getMyVideos(userId);
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchVideosdata();
  }, []);

  const handleClick = async (video: any) => {
    try {
      const data = await getMediaByMediaId(video._id);
      setSelectedVideo(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error loading video details:", error);
    }
  };

  return (
    <View className="flex flex-wrap mt-2">
      <View className="flex flex-row flex-wrap">
        {videos.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              handleClick(item);
            }}
            key={index}
            className="flex flex-col items-center mb-4 mx-4"
            style={{ width: "33%" }}
          >
            <VideoPlayer videoUrl={item.url} />
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
          <DetailVideo
            isModalVisible={openModal}
            setModalVisible={setOpenModal}
            video={selectedVideo}
          />
        )}
      </Modal>
    </View>
  );
};

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});

  return (
    <View>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={{ width: 150, height: 90, borderRadius: 10 }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
};

export default VideoProfile;
