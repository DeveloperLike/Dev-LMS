import React from "react";
import { IoIosCloud } from "react-icons/io";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import logo from "../../assets/Logo.png"
export const IntegrationPartners = () => {
  return (
    <div className="mx-6 bg-white p-5">
      <div className="flex gap-4 items-center">
        <div>
          <IoIosCloud className="text-orange-400 text-2xl" />
        </div>
        <div>
          <p className="text-orange-500">Our Integration Partners</p>
          <p className="mt-2">
            Zooter integrates seamlessly with these enhancing your admission &
            marketing experience. If your software or tool is not on this list,
            no worries, just send us an email at support@zooter.com
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-4 mt-7">
        <div className="border rounded p-4 ">
        <div className="max-h-[100px] overflow-hidden">
          <img src={logo} 
              height={"100%"}
              width={"100%"}
              alt="loading"
           className="m-auto w-full" 
          />
          </div>
          <p className="text-sm">
            Click here to view ExtraaEdge API documentation please contact
            support@Zooter.com
          </p>
        </div>
        <div className="border rounded p-4 ">
          <div className="max-h-[100px] overflow-hidden mb-3">
            <img
              className="object-contain w-[80%] m-auto "
              src="https://www.pngplay.com/wp-content/uploads/6/Facebook-Advertising-Icon-Transparent-PNG.png"
              height={"100%"}
              width={"100%"}
              alt="loading"
            />
          </div>
          <div className="w-full flex justify-center">
            <PrimaryButton
              title={"CLICK TO INTEGRATION"}
              type={"primary"}
              className={""}
            />
          </div>
        </div>

        <div className="border rounded p-4 ">
          <div className="max-h-[100px] overflow-hidden mb-3">
            <img
              className="object-contain w-[80%] m-auto"
              src="https://mediashift.org/wp-content/uploads/2017/04/google-adwords-logo.jpg"
              height={"100%"}
              width={"100%"}
              alt="loading"
            />
          </div>
          <div className="w-full flex justify-center">
            <PrimaryButton
              title={"CLICK TO INTEGRATION"}
              type={"primary"}
              className={""}
            />
          </div>
        </div>{" "}
      </div>
    </div>
  );
};
