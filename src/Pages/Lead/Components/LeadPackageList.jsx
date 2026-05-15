import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { getLeadPackageListService } from "../ApiService";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import { message } from "antd";

function LeadPackageList({
  packageData,
  packageList,
  id,
  setNextPage,
  setIsSelectedPackage,
  ...props
}) {
  const [currentpackage, setCurrentpackage] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState(
    packageList?.map((pkg) => ({
      id: pkg.id,
      amount: pkg.amount || 0,
      total_amount: pkg.total_amount || 0,
      name: pkg.name,
      gst: pkg.gst || 0,
      gst_amount: pkg.gst_amount || 0,
    })) || []
  );
  // const [errorMessage, setErrorMessage] = useState("");
  // const dispatch = useDispatch();

  const leadGetApi = () => {
    getLeadPackageListService().then((response) => {
      setCurrentpackage(response.data.data);
    });
  };

  const selectFunction = (id, amount, name, gst, gst_amount, total_amount) => {
    setSelectedPackages((prevSelectedPackages) => {
      const isAlreadySelected = prevSelectedPackages.some(
        (pkg) => pkg.id === id
      );

      if (isAlreadySelected) {
        return prevSelectedPackages.filter((pkg) => pkg.id !== id);
      } else {
        return [
          ...prevSelectedPackages,
          { id, amount, name, gst, gst_amount, total_amount },
        ];
      }
    });
  };

  const totalAmount = selectedPackages
    .reduce((total, pkg) => total + parseFloat(pkg.total_amount), 0)
    .toFixed(2);

  const handleNext = () => {
    if (selectedPackages.length === 0) {
      message.error("Please select a package to proceed");
      return;
    }

    // setErrorMessage("");
    setIsSelectedPackage(selectedPackages);
    setNextPage("pakageviewpage");
    // getDetailsDataApi();
  };
  console.log(selectedPackages, "selected packages");

  useEffect(() => {
    leadGetApi();
  }, []);

  return (
    <div className="mb-[100px]">
      <div className="grid grid-col-flow gap-2">
        {currentpackage &&
          currentpackage.map((item) => (
            <div
              key={item.id}
              className={`border rounded-md p-2 hover:bg-slate-50 dark:hover:text-black cursor-pointer ${selectedPackages.some((pkg) => pkg.id === item.id) &&
                "border border-orange-500"
                }`}
            >
              <div
                className="flex justify-between items-center"
                onClick={() =>
                  selectFunction(
                    item.id,
                    parseFloat(item.amount),
                    item.name,
                    item.gst,
                    item.gst_amount,
                    parseFloat(item.total_amount)
                  )
                }
              >
                <div className="w-full flex justify-between items-center">
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
                  </div>

                  <div
                    className={`text-orange-500 inline-flex rounded-full bg-opacity-10 py-0 px-3 text-sm font-medium ${selectedPackages.some((pkg) => pkg.id === item.id) &&
                      "text-orange-500 inline-flex bg-opacity-10 rounded-full py-1 px-0 text-sm font-medium"
                      }`}
                  // onClick={() =>
                  //   selectFunction(item.id, parseFloat(item.amount))
                  // }
                  >
                    {selectedPackages.some((pkg) => pkg.id === item.id) ? (
                      // <RxCross2 size={20} />
                      "Remove"
                    ) : (

                      "Add"
                      // <IoMdAdd size={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* {errorMessage && (
        <div className="text-red-500 font-medium mb-2">{errorMessage}</div>
      )} */}

      <div className="absolute bottom-0 p-4 bg-white dark:bg-black dark:text-white text-black w-full left-0">
        <div className="flex justify-between items-center">
          <strong>Total Amount: ₹ {totalAmount}</strong>
          {currentpackage !== null && (
            <PrimaryButton
              onClick={handleNext}
              type="primary"
              htmlType="submit"
              className="p-5"
              title={"Next"}
              block={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { LeadPackageList };
