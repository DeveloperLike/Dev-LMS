import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { InputWithIcon } from '../../Components/CustomComponents/InputWithIcon';
import axios from 'axios';
import {
  OutLineButton,
  PrimaryButton,
} from '../../Components/CustomComponents/ButtonUi';
import SignInLayout from '../../Components/CustomComponents/SignInLayout';
import { useDispatch } from 'react-redux';
import { loginOtpData } from '../../lib/redux/OptSlice';
import { baseurl } from '../../lib/Constants';

function OtpLogin() {
  const [useremail, setUserEmail] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: {
      value: '',
      errors: [],
    },
  });
  const handleInput = (e) => {
  const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: { value, errors: [] },
    });

    //  set email value
    if (name === 'email') {
      setUserEmail((prevState) => ({
        ...prevState,
        email: value,
      }));
    }
  };

  const handleError = (response) => {
    var arrays = Object.keys(response);
    var d = {};
    arrays.map((item) => {
      // console.log(item, response[item]);
      d[item] = {
        ...formData[item],
        errors: response[item],
      };
      setFormData({
        ...formData,
        ...d,
      });
      // console.log(formData);
    });
  };

  const formdatas = new FormData();
  formdatas.append('email', formData.email.value);
  const callLoginApiService = () => {
    axios({
      method: 'post',
      url: `${baseurl}/api/v1/common/generate-otp/login`,
      data: formdatas,
    })
      .then(function (response) {
        // Handle success
        console.log(response.data);
        setUserEmail((prevState) => ({
          ...prevState,
          order_id: response.data,
        }));
        if (response.data.success === '1') {
          const newData = {
            email: formData.email.value,
            order_id: response.data.data.order_id,
          };
          dispatch(loginOtpData(newData));
          navigate('/verify-with-otp');
        }
      })
      .catch(function (response) {
        // Handle error
        handleError(response.response.data.data);
      });
  };


  return (
    <SignInLayout>
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h2 className=" text-2xl font-bold text-black dark:text-white sm:text-title-xl2"> Login with OTP</h2>
        <p className="font-thin mb-6"> Please enter your registered email address</p>

        <form onSubmit={(e) => { e.preventDefault(); callLoginApiService();}}>
          <label className="mb-2.5 block font-medium text-black dark:text-white"> Email</label>
          <div className="w-[100%] flex flex-row gap-5">
            <div className="w-[100%] relative h-max ">
              <InputWithIcon
                key={1}
                name="email"
                className=""
                errors={formData.email.errors}
                type="email"
                placeholder="Enter your email"
                handler={handleInput}
              />
            </div>
            <PrimaryButton
              htmlType="submit"
              type={'primary'}
              className="p-5"
              title={<span> Generate OTP</span>}
            />
          </div>

          <div className="mt-8">
            <NavLink to="/">
              <OutLineButton
                className="p-5"
                title={'Login with Password'}
                onClick={''}
                block={true}
              />
            </NavLink>
          </div>
        </form>
      </div>
    </SignInLayout>
  );
}

export default OtpLogin;
