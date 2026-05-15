import React, { useEffect } from "react";
import { Card, message } from "antd";
import { GoPackage } from "react-icons/go";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { addleadPackageService } from "../ApiService";

const ViewLeadPackage = ({
  gridCol = "grid-cols-3",
  setNextPage,
  isSelectedPackage,
  leadPackageListGetApi,
  getDetailsDataApi,
  id,
  userData,
}) => {
  const navigatetopackageList = () => {
    setNextPage("pakagelistPackagepage");
  };

  // console.log(isSelectedPackage, "isSelectedPackage");
  // Calculate total amount
  const totalAmount = isSelectedPackage.reduce(
    (total, item) => total + item.total_amount,
    0
  );
  // payload
  const currentpackageobj = {
    package_list: isSelectedPackage.map((item) => ({
      id: item.id,
      status:
        isSelectedPackage.find((packageItem) => packageItem.id === id)
          ?.status || "pending",
    })),
  };

  const handleSubmit = async () => {
    try {
      const response = await addleadPackageService(currentpackageobj, id);
      if (response.status === 200) {
        // console.log(response.data);
        getDetailsDataApi && getDetailsDataApi();
        setNextPage("pakageTransactionpage");
        leadPackageListGetApi();
        message.success(response?.data?.message);
      } else {
        message.error("Failed to add lead package");
      }
    } catch (error) {
      message.error(error?.response?.data?.message);
      console.error("Error while submitting the form:", error?.response);
    }
  };



  useEffect(() => {
    getDetailsDataApi && getDetailsDataApi();
  }, [])

  return (
    <div className="mb-[100px]">
      <div className={`grid grid-flow-row ${gridCol} gap-2`}>
        {isSelectedPackage.map((item) => (
          <Card
            key={item.id}
            className={`hover:bg-slate-50 dark:hover:text-black cursor-pointer mb-5`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-medium mb-1">{item.name}</h2>
                <h2 className="font-normal">
                  Amount: ₹{parseFloat(item.amount).toFixed(2)}
                </h2>
                <h2 className="font-normal">
                  GST: ₹{parseFloat(item.gst_amount).toFixed(2)} @{" "}
                  {parseFloat(item.gst)}%
                </h2>
                <h2 className="font-normal">
                  Total: ₹{parseFloat(item.total_amount).toFixed(2)}
                </h2>
                <h2 className="font-normal">
                  Sales Person: {item.sales_person}
                </h2>
              </div>

              <div>
                <GoPackage size={25} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="absolute bottom-0 p-4 bg-white dark:bg-black dark:text-white text-black w-full left-0">
        <div className="flex justify-between items-center">
          <strong>Total Amount: ₹ {totalAmount}</strong>
          <div className="flex gap-2">
            <PrimaryButton
              onClick={navigatetopackageList}
              type="primary"
              htmlType="submit"
              className="p-5"
              title={"Back"}
              block={false}
            />
            <PrimaryButton
              onClick={handleSubmit}
              type="primary"
              htmlType="submit"
              className="p-5"
              title={"Submit"}
              block={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeadPackage;
