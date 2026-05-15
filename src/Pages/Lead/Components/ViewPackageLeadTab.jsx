import React, { useEffect } from "react";
import { OutLineButton } from "../../../Components/CustomComponents/ButtonUi";
import { Card } from "antd";
import { GoPackage } from "react-icons/go";

export const ViewPackageLeadTab = ({
  showModal,
  packageList,
  leadPackageListGetApi,
}) => {
  useEffect(() => {
    leadPackageListGetApi();
  }, []);
  return (
    <>
      <div>
        <div className="float-right mt-4">
          <OutLineButton
            title="Edit Package"
            onclick={showModal}
            className="py-5"
          />
        </div>
        <div className={`grid md:grid-cols-3 gap-3 pt-4`}>
          {packageList &&
            packageList.map((item) => (
              <Card
                key={item.id}
                className={`hover:bg-slate-50 dark:hover:text-black cursor-pointer  `}
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
                    <h2 className="font-normal">
                      Sales Date: {item.created_at}
                    </h2>
                  </div>

                  <div>
                    <GoPackage size={25} />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};
