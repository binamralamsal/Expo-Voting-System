import Axios from "axios";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export const axios = Axios.create({});

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const responseData = error.response?.data;
    const message = responseData?.message || error.message;
    console.log(responseData);

    showNotification({
      title: message,
      message: responseData.error,
      color: "red",
      icon: <IconX size={16} />,
    });

    return Promise.reject(error);
  }
);
