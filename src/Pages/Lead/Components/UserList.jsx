import { Card } from "antd";
import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const UserList = ({ userData }) => {
  return (
    userData && (
      <Card className="border-none max-w-[max-content] p-4 ">
<div className=" " >
       <Card className=" hover:bg-slate-50 cursor-pointer">
         <h2 className="font-medium flex gap-2 items-center my-1">
          <FaUser size={20} />
          User: {userData.full_name}
        </h2>
        </Card>
        <Card className=" mt-4 hover:bg-slate-50 cursor-pointer">
        <h2 className="font-medium flex gap-2 items-center my-1">
          <MdEmail size={20} />
          Email: {userData.email}
        </h2>
        </Card>
        </div>
      </Card>
    )
  );
};
