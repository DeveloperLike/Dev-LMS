import React, { useEffect, useState } from "react";
import { getProfileService } from "./ApiService";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { UpdatePassword } from "./UpdatePassword";

export const Profile = ({ mode }) => {
  const [data, setData] = useState();

  const getProfileApi = async () => {
    try {
      const response = await getProfileService();
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileApi();
  }, []);

  if (!data) {
    return (
      <div className="p-6">
        <LoadSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <div className="rounded-2xl overflow-hidden shadow-md">

        <div className="h-22 relative bg-gray-100 dark:bg-gradient-to-r dark:from-[#0f172a] dark:to-[#1e293b] rounded-t-2xl
                        border-b border-gray-200 dark:border-white/10 shadow-inner">

          <div className="absolute left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 bottom-[-32px]">
            <div className="w-25 h-25 rounded-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-black border-4 border-white dark:border-[#0f172a] shadow-lg">
              {data?.full_name?.charAt(0)}
            </div>
          </div>

        </div>

        <div className="bg-white dark:bg-[#0f172a] pt-12 pb-6 px-6 flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {data?.full_name}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {data?.email}
            </p>

            <span className="mt-2 inline-block text-xs bg-yellow-400/20 text-yellow-600 px-3 py-1 rounded-full">
              {data?.user_group}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="
          rounded-2xl p-5
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-white/10
          shadow-md hover:shadow-lg transition
        ">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Personal Information
          </h3>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span className="text-gray-500">Full Name</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {data?.full_name}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {data?.phone || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Reporting Manager</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {data?.reporting_manager || "-"}
              </span>
            </div>

          </div>
        </div>

        <div className="
          rounded-2xl p-5
          bg-white dark:bg-[#0f172a]
          border border-gray-200 dark:border-white/10
          shadow-md hover:shadow-lg transition
        ">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {data?.email}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">User Group</span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {data?.user_group}
              </span>
            </div>

          </div>
        </div>

      </div>

      <div className="
        rounded-2xl p-6
        bg-white dark:bg-[#0f172a]
        border border-gray-200 dark:border-white/10
        shadow-md
      ">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>

        <UpdatePassword mode={mode} />
      </div>

    </div>
  );
};