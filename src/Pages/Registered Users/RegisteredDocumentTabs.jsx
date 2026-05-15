import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { getUserMappedDocumentService } from "./ApiService";
import { SubmittedDocuments } from "./SubmittedDocuments";
import { useParams } from "react-router-dom";

export const RegisteredDocumentTabs = ({userData,}) => {
  const [tabsData, setTabsData] = useState([]);
  const [tabItems, setTabItems] = useState([]);
  const {id} = useParams();

  const getDocumentsCategoryApi = () => {
        getUserMappedDocumentService(userData).then((response) => {
            setTabsData(response.data.data);
          console.log(response.data.data);
        });
  };

  useEffect(() => {
    getDocumentsCategoryApi();
  }, []);

  useEffect(() => {
    const newTabItems = tabsData.map((category) => ({
      key: String(category.id),
      label: <span className="text-slate-400" >{category.document_category}</span>,
      children: <><SubmittedDocuments userName={id} categoryId={category.document_category_id}  /></>,
    //   children: <><SubmittedDocuments categoryId={categoryId} userName={userName } /></>,
    }));
    setTabItems(newTabItems);
  }, [tabsData]);

  return (
    <>
      {tabItems === null || tabItems.length < 0 || tabItems === undefined ? (
        <LoadSkeleton />
      ) : (
        <Tabs
          className="mt-0"
          defaultActiveKey={tabItems.length > 0 ? tabItems[0].key : ""}
          items={tabItems}
        />
      )}
    </>
  );
};
