import AsyncStorage from "@react-native-async-storage/async-storage";
import PusherClient from "pusher-js";

// let pusherInstance: PusherClient | null = null;

// export const getPusherClient = () => {
//   if (!pusherInstance) {
//     pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
//       cluster: process.env.PUSHER_APP_CLUSTER!,
//       authEndpoint: process.env.NEXT_PUBLIC_BASE_URL + "/pusher/auth",
//     });

//     console.log("Pusher connected");
//   }

//   return pusherInstance;
// };

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};

PusherClient.logToConsole = true;

console.log("Cluster: ", process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER);
console.log("Auth endpoint: ", process.env.EXPO_PUBLIC_BASE_URL);

console.log("API KEY: ", process.env.EXPO_PUBLIC_NEXT_PUBLIC_PUSHER_APP_KEY!);
export const pusherClient = new PusherClient(
  process.env.EXPO_PUBLIC_NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER!,
    authEndpoint: process.env.EXPO_PUBLIC_BASE_URL + "/pusher/auth",
  }
);
