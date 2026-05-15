import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { InputPassword, InputWithIcon } from '../../Components/CustomComponents/InputWithIcon';
import { OutLineButton, PrimaryButton } from '../../Components/CustomComponents/ButtonUi';
import SignInLayout from '../../Components/CustomComponents/SignInLayout';
import axiosInstance from '../../lib/AxiosInstance';
import { redirecttologinpage } from './RedirectTologin';
import { Spin } from 'antd';


const SignIn = () => {

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: {
      value: '',
      errors: [],
    },
    password: {
      value: '',
      errors: [],
    },
  });

  useEffect(() => {
    redirecttologinpage(navigate);
  }, [navigate]);

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  const handleError = (response) => {
    const errorFields = Object.keys(response);
    const updatedErrors = {};
    errorFields.forEach((item) => {
      updatedErrors[item] = {
        ...formData[item],
        errors: response[item],
      };
    });
    setFormData({
      ...formData,
      ...updatedErrors,
    });
  };

  const callLoginApiService = () => {
    setLoading(true);

    const formdatas = new FormData();
    formdatas.append('email', formData.email.value);
    formdatas.append('password', formData.password.value);

    axiosInstance
      .post('/api/v1/user-management/login-with-password', formdatas)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      })
      .catch((error) => {
        if (error.response) {
          handleError(error.response.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <SignInLayout>
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h2 className="mb-8 text-2xl font-bold sm:text-title-xl2 text-black dark:text-yellow-500 dark:border-yellow-500">
          Sign In</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            callLoginApiService();
          }}
        >
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
            <div className="relative">
              <InputWithIcon
                key="email"
                name="email"
                className="border dark:border-white"
                errors={formData.email.errors}
                type="email"
                placeholder="Enter your email"
                handler={handleInput}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>
            <div className="relative">
              <InputPassword
                key="password"
                name="password"
                className="border dark:border-white"
                errors={formData.password.errors}
                type="password"
                placeholder="Enter your password"
                handler={handleInput}
              />
            </div>
          </div>
          <div className="mb-3">
            <PrimaryButton
              type="primary"
              htmlType="submit"
              className="p-5 flex items-center justify-center gap-3"
              block
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spin size="small" className="text-yellow-400" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </PrimaryButton>
          </div>
          <div className="text-center">
            <NavLink
              to="/login-with-otp"
              onClick={() => setOtpLoading(true)}
            >
              <OutLineButton
                className="p-5 flex items-center justify-center gap-2"
                block
                disabled={otpLoading}
                title={
                  otpLoading ? (
                    <div className="flex items-center gap-2">
                      <Spin size="small" className="text-yellow-400" />
                      Redirecting...
                    </div>
                  ) : (
                    "Login with OTP"
                  )
                }
              />
            </NavLink>
          </div>
        </form>
      </div>
    </SignInLayout>
  );
};

export default SignIn;
