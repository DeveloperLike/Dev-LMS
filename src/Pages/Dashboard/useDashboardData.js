import { useEffect, useState } from "react";
import authenticatedAxiosInstance from "../../lib/AxiosInstance";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    authenticatedAxiosInstance({
      method: "get",
      url: "/api/v1/common/dashboard",
    }).then((response) => {
      setData(response.data.data);
      setMeta(response.data);
    });
  }, []);

  return { data, meta };
};
