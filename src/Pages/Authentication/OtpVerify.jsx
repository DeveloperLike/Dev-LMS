import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input, message, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginOtpData } from "../../lib/redux/OptSlice";
import axios from "axios";
import SignInLayout from "../../Components/CustomComponents/SignInLayout";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { baseurl } from "../../lib/Constants";

// const { Countdown } = Statistic;

function OtpVerify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const generateOtpData = useSelector(
    (state) => state.nameloginOtpData.loginOtpData
  );

  const onChange = (text) => {
    // console.log("onChange:", text);
    dispatch(loginOtpData({ ...generateOtpData, otp: text }));
  };

  // console.log(generateOtpData);

  const onInput = (value) => {
    // console.log('onInput:', value);
  };

  const sharedProps = {
    onChange,
    onInput,
  };

  const callOtpVarifyLoginApiService = () => {
    axios({
      method: "post",
      url: `${baseurl}/api/v1/user-management/login-with-otp`,
      data: generateOtpData,
    })
      .then(function (response) {
        console.log(response.data);
        if (response.data.success === "1") {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        } 
        // else {
        //   console.log(response.data.message);
        // }
      })
      .catch(function (error) {
        message.error(error?.response?.data?.message);
      });
  };

  return (
    <>
      <SignInLayout>
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-1 text-3xl font-bold text-black dark:text-white ">
            Verify your OTP
          </h2>
          <p className="font-thin mb-8">
            OTP has been sent to your registered email address
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              callOtpVarifyLoginApiService();
            }}
          >
            <label className="mb-2.5 block text-black dark:text-white">
              Email
            </label>
            <input
              type="email"
              disabled
              value={generateOtpData.email}
              className="w-full rounded-lg border border-stroke  py-3 pl-6 pr-10 text-black outline-none focus:border-orange-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <NavLink
              to="/login-with-otp"
              className="float-right text-orange-500 hover:underline"
            >
              Change email?
            </NavLink>
            <div className="my-6">
              <p className="mb-2 text-black">Please enter your 6 digit code</p>
              <Input.OTP size="large" allowClear {...sharedProps} />
            </div>

            <div className="flex gap-4">
              <div className="mb-5">
                <PrimaryButton
                  type="primary"
                  htmlType={"submit"}
                  className="p-5"
                  title={"Verify OTP"}
                  block={true}
                />
              </div>
            </div>
          </form>
        </div>
      </SignInLayout>
    </>
  );
}

export default OtpVerify;
