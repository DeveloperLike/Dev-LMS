import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { PersonalInfomation } from "./Components/Personal";
import { useParams } from "react-router-dom";
// import { Matriculation } from "./Components/Matriculation";
// import { Diploma } from "./Components/Diploma";
// import { PostGraduation } from "./Components/PostGraduation";
// import { Score } from "./Components/Score";
// import { Preference } from "./Components/Preference";
import { IoMdCheckbox } from "react-icons/io";
// import { getApprovalStatusService } from "./ApiService";
import { RxCross2 } from "react-icons/rx";
import { LeadMatriculation } from "./Components/matriculation/Matriculation";
import { LeadIntermediate } from "./Components/Intermidiate/Intermidiate";
import { LeadDiploma } from "./Components/Diploma/Diploma";
import { LeadGraduation } from "./Components/Graduation/Graduation";
import { LeadPostGraduation } from "./Components/PostGraduation/PostGraduation";
import LeadEmployment from "./Components/Employment/Employment";
export const LeadStudentDetails = ({ modulePermission, mode }) => {
  const [isApproval, setIsApproval] = useState();

  const { id } = useParams();

  const getIsApprovedApi = () => {
    // getApprovalStatusService(id).then((response) => {
    //   if (response && response.data && response.data.data) {
    //     setIsApproval(response.data.data);
    //   }
    // });
  };

  useEffect(() => {
    getIsApprovedApi();
  }, []);

  const tabs = [
    {
      key: "personal",
      label: <span className="text-slate-400">Personal</span>,
      icon:
        isApproval?.profile === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.profile === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      children: <PersonalInfomation userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />,
    },
    {
      key: "matriculation",
      label: (
        <span className="text-slate-400">
          10<sup>th</sup>/Matriculation
        </span>
      ),
      icon:
        isApproval?.matriculation === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.matriculation === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      children: (
        <>
          <LeadMatriculation userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />
        </>
      ),
    },
    {
      key: "intermediate",
      icon:
        isApproval?.intermediate === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.intermediate === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      label: (
        <span className="text-slate-400" >
          12<sup>th</sup>/Intermediate
        </span>
      ),
      children: <LeadIntermediate userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />,
    },
    {
      key: "diploma",
      icon:
        isApproval?.diploma === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.diploma === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      label: <span className="text-slate-400">Diploma</span>,
      children: <LeadDiploma userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />,
    },
    {
      key: "graduation",
      icon:
        isApproval?.graduation === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.graduation === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      label: <span className="text-slate-400" >Graduation</span>,
      children: <LeadGraduation userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />,
    },
    {
      key: "postGraduation",
      icon:
        isApproval?.post_graduation === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.post_graduation === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500  rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      label: <span className="text-slate-400"  >PostGraduation</span>,
      children: <LeadPostGraduation userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} mode={mode} />,
    },
    {
      key: "employment",
      icon:
        isApproval?.employment === "Approved" ? (
          <IoMdCheckbox className="inline-block" color="green" size={18} />
        ) : isApproval?.employment === "Rejected" ? (
          <RxCross2
            className="inline-block bg-red-500 rounded"
            color="white"
            size={15}
            mode={mode}
          />
        ) : null,
      label: <span className="text-slate-400" >Employment</span>,
      children: <LeadEmployment
        userName={id}
        mode={mode}
      />,
    },
    // {
    //   key: "score",
    //   icon:
    //     isApproval?.score === "Approved" ? (
    //       <IoMdCheckbox className="inline-block" color="green" size={18} />
    //     ) : isApproval?.score === "Rejected" ? (
    //       <RxCross2
    //         className="inline-block bg-red-500 rounded"
    //         color="white"
    //         size={15}
    //       />
    //     ) : null,
    //   label: <span className="text-slate-400" >Score</span>,
    //   children: <Score userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} />,
    // },
    // {
    //   key: "preference",
    //   icon:
    //     isApproval?.preference === "Approved" ? (
    //       <IoMdCheckbox className="inline-block" color="green" size={18} />
    //     ) : isApproval?.preference === "Rejected" ? (
    //       <RxCross2
    //         className="inline-block bg-red-500 rounded"
    //         color="white"
    //         size={15}
    //       />
    //     ) : null,
    //   label: <span className="text-slate-400">Preference</span>,
    //   children: <Preference userName={id} getIsApprovedApi={getIsApprovedApi} modulePermission={modulePermission} />,
    // },
  ];

  return (
    <>
      <Tabs
        defaultActiveKey={tabs.length > 0 ? tabs[0].key : ""}
        items={tabs}

      />
    </>
  );
};
