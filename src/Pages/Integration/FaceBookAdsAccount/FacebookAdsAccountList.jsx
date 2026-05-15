import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Grid, message } from "antd";
import { useSelector } from "react-redux";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { PAGESIZE } from "../../../lib/Constants";
import {
    postFacebookAdsAccountListService,
  postLinkFacebookAccountListService,
  postLinkFacebookPageListService,
} from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";

const FacebookAdsAccountList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAdAccountData, setSelectedAdAccountData] = useState([]);
  const [facebookData, setFacebookData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [linkAccessToken, setLinkAccessToken] = useState("");

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

  let columns = [
    {
      title: "Account Id",
      fixed: "left",
      dataIndex: "account_id",
      key: "account_id",
      minWidth: "150px",
      render: (text, record) => (
        <p className="font-medium hover:text-orange-500">{text}</p>
      ),
    },
  ];

  const getLeadApi = () => {
    postFacebookAdsAccountListService({
      email: facebookEmail,
      access_token: facebookAccessToken,
    }).then((response) => {
      setFacebookData(response.data.ad_accounts_data);
      setLinkAccessToken(response.data.access_token)
      setData(response.data);
    });
  };

  // Effect to update selectedAdAccountData when selectedRowKeys or setFacebookData changes
  useEffect(() => {
    if (facebookData && selectedRowKeys.length > 0) {
      const currentPageIds = selectedRowKeys
        .map((key) => {
          const row = facebookData.find((item) => item.account_id === key);
          return row ? row.account_id : null;
        })
        .filter(Boolean);
      setSelectedAdAccountData(currentPageIds);
    } else {
      setSelectedAdAccountData([]);
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
    const payload = {
      email:facebookEmail,  
      access_token: linkAccessToken,
      ad_account_data: selectedAdAccountData,
    };

    postLinkFacebookAccountListService(payload).then((response) => {
      if (response.data.success === "1") {
        message.success(response?.data?.message);
        navigate("/facebook-ad-account");
      } else {
        message.error(response?.data?.message);
      }
    });
  };

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded">
            FaceBook Ad Account List
          </h1>
        </div>
        {/* Add a button to trigger sending the selected page data */}
        {selectedAdAccountData.length > 0 && (
          <PrimaryButton
            title={<>Link Facebook page ({selectedAdAccountData.length})</>}
            onClick={handleSubmitSelectedPages}
            type={"primary"}
          />
        )}
      </div>

      <TableWithPagination
        tableData={facebookData}
        rowHoverable={false}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        islead={leadModulePermission.lead_management === "edit" && "lead"}
        rowKey="account_id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default FacebookAdsAccountList;
