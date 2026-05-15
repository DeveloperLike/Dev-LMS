import React, { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "./firebase";
import { message } from "antd";

function NotificationTesting() {
  const [notification, setNotification] = useState(null);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    requestForToken().then((token) => {
      if (token) {
        setFcmToken(token);
        // console.log("FCM Token:", token);
      }
    });

    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      message.success(
        `Foreground Notification: ${payload.notification.title} - ${payload.notification.body}`
      );
    });

    return () => {
      unsubscribe.catch((err) => message.error("Error unsubscribing:", err));
    };
  }, []);

  return (
    <div>
      notification testing
      <br />
      <br />

      <div>
        
      </div>
    </div>
  );
}

export default NotificationTesting;
