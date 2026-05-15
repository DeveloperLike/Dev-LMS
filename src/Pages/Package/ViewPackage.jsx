import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { getPackageDetailslistservice } from "./ApiService";

const ViewPackage = ({ id }) => {
  const [description, setDescription] = useState();
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    code: { value: "", errors: [] },
    amount: { value: null, errors: [] },
    gst: { value: null, errors: [] },
    is_active: { value: true },
    permissions: {},
    description: null,
  });

  // Fetch package data
  useEffect(() => {
    getPackageDetailslistservice(id)
      .then((response) => {
        const jsonResponse = response.data.data;
        console.log(jsonResponse, "jsonResponse");
        const permissions = {};
        jsonResponse.permissions.forEach((section) => {
          permissions[section.code] = {
            access_granted: section.access_granted,
            errors: [],
          };
        });

        setFormData({
          name: { value: jsonResponse.name, errors: [] },
          code: { value: jsonResponse.code, errors: [] },
          amount: { value: jsonResponse.amount },
          gst: { value: jsonResponse.gst },
          is_active: { value: jsonResponse.is_active },
          permissions: permissions,
          description: jsonResponse.description,
        });
        setDescription(jsonResponse.description);
      })
      .catch((error) => {
        console.error("Error fetching package details:", error);
      });
  }, [id]);

  return (
    <>
      <div className="rounded-lg">
        <form className="w-3/3 space-y-4">
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>Package Name</label>
              <InputWithIcon name="name" value={formData.name.value} disabled />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>Package Code</label>
              <InputWithIcon name="code" value={formData.code.value} disabled />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>Package Amount</label>
              <InputWithIcon
                name="amount"
                value={formData.amount.value}
                disabled
              />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>GST</label>
              <InputWithIcon name="gst" value={formData.gst.value} disabled />
            </div>
          </FormItem>

          <FormItem>
            <div className="flex flex-col gap-1">
              <label>Description</label>
              <InputWithIcon name="amount" value={description} disabled />
            </div>
          </FormItem>
        </form>
      </div>
    </>
  );
};

export default ViewPackage;
