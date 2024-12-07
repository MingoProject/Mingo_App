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

PusherClient.logToConsole = true;

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    cluster: "ap1",
    authEndpoint: process.env.NEXT_PUBLIC_BASE_URL + "/pusher/auth",
  }
);
