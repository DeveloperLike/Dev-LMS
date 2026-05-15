import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useSelector } from "react-redux";
import {
  postFacebookPageListService,
  postLinkFacebookPageListService,
} from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";

const FaceBookPageList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedPageIds, setSelectedPageIds] = useState([]);
  const [facebookData, setFacebookData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const facebookAccessToken = useSelector(
    (state) => state.facebookAccessToken.facebookTokenUpdate
  );
  const facebookEmail = useSelector(
    (state) => state.facebookEmail.currentfacebookEmail
  );

  const getLeadApi = () => {
    postFacebookPageListService({
      email: facebookEmail,
      access_token: facebookAccessToken,
    }).then((response) => {
      setFacebookData(response.data.pages);
      setData(response.data);
    });
  };

  // Effect to update selectedPageIds when selectedRowKeys or setFacebookData changes
  useEffect(() => {
    if (facebookData && selectedRowKeys.length > 0) {
      const currentPageIds = selectedRowKeys
        .map((key) => {
          const row = facebookData.find((item) => item.page_id === key);
          return row ? row.page_id : null;
        })
        .filter(Boolean);
      setSelectedPageIds(currentPageIds);
    } else {
      setSelectedPageIds([]);
    }
  }, [selectedRowKeys, facebookData]);

  useEffect(getLeadApi, [
    page,
    searchState,
    leadModulePermission.lead_management,
    facebookAccessToken,
  ]);

  // ink-facebook-pages APi Calling
  const handleSubmitSelectedPages = () => {
    setIsLoading(true); 
    const payload = {
      access_token: facebookAccessToken,
      email: facebookEmail,
    };

    postLinkFacebookPageListService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          message.success(response?.data?.message);
          navigate("/facebook-page");
        } else {
          message.error(response?.data?.message);
        }
      })
      .catch((error) => {
        message.error("An error occurred while linking pages.");
        console.error("Link Facebook Pages Error:", error);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  return (
    <>
      <div className="mt-[20%] flex flex-col justify-center items-center">
        <p className="mb-3">continue facebook links</p>
        <PrimaryButton
          title={isLoading ? "In Progress" : "Continue"} 
          onClick={handleSubmitSelectedPages}
          type={"primary"}
          disabled={isLoading} 
        />
      </div>
    </>
  );
};

export default FaceBookPageList;