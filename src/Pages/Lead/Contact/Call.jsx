import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import authenticatedAxiosInstance from "../../../lib/AxiosInstance";
import { message } from "antd";

const Call = ({ setOpenAudioCall, phone, id }) => {

  const [alternate, setAlternate] = useState(null);
  const [father, setFather] = useState(null);
  const [mother, setMother] = useState(null);

  useEffect(() => {
    authenticatedAxiosInstance
      .get(`/api/v1/student/lead-student-profile/${id}`)
      .then((res) => {
        const data = res?.data?.data;

        setAlternate(data?.alternate_mobile);
        setFather(data?.father_mobile);
        setMother(data?.mother_mobile);
      });
  }, [id]);

  // IVR Call
  const handleIvrCall = async (callPhone) => {

    if (!callPhone) {
      message.error("Phone number required");
      return;
    }

    try {

      const response = await authenticatedAxiosInstance.post(
        `/api/v1/lead-management/call-activity/${id}`
      );

      if (response.data.success === "1") {
        setOpenAudioCall(false);
        message.success(response?.data?.message);
      }

    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  // Manual Call
  const handleManualCall = () => {
    authenticatedAxiosInstance({
      method: "post",
      url: `api/v1/lead-management/manual-call-activity/${id}`,
    })
      .then((response) => {
        if (response.data.success === "1") {
          setOpenAudioCall(false);
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  };

  return (
    <div className="flex flex-col gap-4">

      {/* PRIMARY  */}
      <PrimaryButton
        title={`Primary (${phone || "Not Found"})`}
        onClick={() => handleIvrCall(phone)}
        disabled={!phone}
        size="large"
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* ALTERNATE  */}
      <PrimaryButton
        title={`Alternate (${alternate || "Not Found"})`}
        onClick={() => handleIvrCall(alternate)}
        disabled={!alternate}
        size="large"
        className="disabled:opacity-95 disabled:cursor-not-allowed"
      />

      {/* FATHER  */}
      <PrimaryButton
        title={`Father (${father || "Not Found"})`}
        onClick={() => handleIvrCall(father)}
        disabled={!father}
        size="large"
        className="disabled:opacity-95 disabled:cursor-not-allowed"
      />

      {/* MOTHER  */}
      <PrimaryButton
        title={`Mother (${mother || "Not Found"})`}
        onClick={() => handleIvrCall(mother)}
        disabled={!mother}
        size="large"
        className="disabled:opacity-95 disabled:cursor-not-allowed"
      />

      {/*  Manual Call */}
      {/* 
      <a href={`tel:${phone}`}>
        <PrimaryButton title={"Manual Call"} onClick={handleManualCall} />
      </a>
      */}

    </div>
  );
};

export default Call;