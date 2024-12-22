import React from "react";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View, Button } from "react-native";

const VideoPlayer = ({ videoSource }: { videoSource: string }) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
  });

  return (
    <View className="flex-1 w-full h-full flex items-center justify-center rounded-2xl">
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture
        contentFit="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});

export default VideoPlayer;
