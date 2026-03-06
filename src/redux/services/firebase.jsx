import { getToken } from "firebase/messaging";
import { messaging } from "../../Firebase/Firebase";
import { base } from "./api";

const VITE_KEY_PAIR = import.meta.env.VITE_KEY_PAIR

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: VITE_KEY_PAIR
            });

            const detail = {
                fcm_token: token,
                device_type: "web"
            };

            const result = await fetch(`${base}/notifications/register-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(detail)
            });

            const data = await result.json();
            console.log(data);
            // debugger
            console.log("FCM Token:", token);

            // send this token to your backend
        }
    } catch (error) {
        console.error("Notification permission error", error);
    }
};