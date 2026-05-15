import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import { Select, Radio, message } from "antd";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import TextArea from "antd/es/input/TextArea";
import {
  editsmsTemplateListserService,
  getRepportingManagerService,
  getSmsTemplatedDetailService,
  getWhatsappTemplateVariableListService,
} from "../ApiService";
import { getUserDropdownService } from "../../User/ApiService";

const EditSms = ({ id, setEditOpen, getSmsApi }) => {
  const [loading, setLoading] = useState(false); 
  const [userName, setUserName] = useState([]);
  const [variablesList, setVariablesList] = useState([]);
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    dlt_template_id: { value: "", errors: [] },
    body: { value: "", errors: [] },
    // is_visible: { value: true, errors: [] },
    status: { value: "draft", errors: [] },
    visible_to: { value: [], errors: [] },
    assign_to: { value: "", errors: [] },
  });

  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: { value: value, errors: [] },
    });
  };

  const handleSelectInput = (value, name) => {
    setFormData({
      ...formData,
      [name]: { value: value, errors: [] },
    });
  };

  const handleVariable = (e) => {
    const x = {
      value: formData.body.value + " " + e,
      errors: [],
    };
    setFormData((prevData) => ({
      ...formData,
      body: x,
    }));
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

  let payload = {
    name: formData.name.value,
    // is_visible: formData.is_visible.value,
    dlt_template_id: formData.dlt_template_id.value,
    body: formData.body.value,
    visible_to: formData.visible_to.value,
    status: formData.status.value,
    assign_to: formData.assign_to.value,
  };

  useEffect(() => {
    getSmsTemplatedDetailService(id).then((response) => {
      const smsData = response.data.data;
      setFormData({
        name: { value: smsData.name, errors: [] },
        dlt_template_id: { value: smsData.dlt_template_id, errors: [] },
        body: { value: smsData.body, errors: [] },
        // is_visible: { value: smsData.is_visible, errors: [] },
        status: { value: smsData.status, errors: [] },
        visible_to: { value: smsData.visible_to, errors: [] },
        assign_to: { value: smsData.assign_to, errors: [] },
      });
    });
  }, [id]);

  const smsPutApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    editsmsTemplateListserService(payload, id)
      .then((response) => {
        console.log(response.data.success);
        if (response.data.success === "1") {
          setEditOpen(false);
          getSmsApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  useEffect(()=>{
    getWhatsappTemplateVariableListService().then((response) => {
      if (response?.data?.success === "1") {
        setVariablesList(
          response.data.data.map((item) => ({
            value: item.code, 
            label: item.name, 
          }))
        );
      }
    });
  },[])

  useEffect(() => {
    const fetchVisibleTo = async () => {
      try {
        const response = await getUserDropdownService();
        if (response.data && response.data.success === "1") {
          setUserName(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reporting manager:", error);
      }
    };
    fetchVisibleTo();
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          smsPutApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              type="text"
              placeholder="Please enter name"
              required={true}
              onChange={(e) => handleInput(e)}
              value={formData.name.value}
              errors={formData.name.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Dlt Template Id<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="dlt_template_id"
              type="text"
              placeholder="Please enter Dlt Template Id"
              required={true}
              onChange={(e) => handleInput(e)}
              value={formData.dlt_template_id.value}
              errors={formData.dlt_template_id.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Variable</label>
            <CustomSelectInput
              placeholder="Please select Variable"
              name="variable"
              handler={(e) => handleVariable(e)}
              options={variablesList}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Body<sup className="text-red-500">*</sup>
            </label>
            <TextArea
              name="body"
              placeholder="Please enter text"
              required={true}
              value={formData.body.value}
              errors={formData.body.errors}
              onChange={(e) => handleInput(e)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        </FormItem>

        {/* <FormItem>
          <label className="block text-md">
            Is Visible<sup className="text-red-500">*</sup>
          </label>
          <Radio.Group
            name="is_visible"
            value={formData.is_visible.value}
            onChange={(value) => handleInput(value)}
          >
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </FormItem> */}

        <FormItem>
          <label className="block">
            Status<sup className="text-red-500">*</sup>
          </label>
          <CustomSelectInput
            name={"status"}
            className="w-full min-w-[300px]"
            placeholder={"Select status"}
            value={formData.status.value}
            errors={formData.status.errors}
            handler={(value) => handleSelectInput(value, "status")}
            options={[
              {
                value: "draft",
                label: "Draft",
              },
              {
                value: "publish",
                label: "Publish",
              },
            ]}
          />
        </FormItem>

        {/* {formData.is_visible.value === true && ( */}
          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="block">
               Visible to <sup className="text-red-500">*</sup>
              </label>
              <CustomSelectInput
                size="large"
                name="assign_to"
                placeholder="Select Visible to"
                value={formData.assign_to.value}
                errors={formData.assign_to.errors}
                handler={(value) => handleSelectInput(value, "assign_to")}
                options={[
                  {
                    value: "selected_users",
                    label: "Selected Users",
                  },
                  {
                    value: "all",
                    label: "All Users",
                  },
                ]}
              />
            </div>
          </FormItem>
        {/* )} */}

        {formData.assign_to.value === "selected_users" &&
          // formData.is_visible.value === true &&
           (
            <FormItem>
              <div className="flex flex-col gap-1">
                <label className="block">
                  Users<sup className="text-red-500">*</sup>
                </label>
                <Select
                  size="large"
                  name="visible_to"
                  placeholder="Select type"
                  mode="multiple"
                  tokenSeparators={[","]}
                  value={formData.visible_to.value}
                  onChange={(value) => handleSelectInput(value, "visible_to")}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={userName.map((item, index) => ({
                    key: index,
                    value: item.username,
                    label: item.email,
                  }))}
                />
                {formData.visible_to.errors && (
                  <span className="text-red-500 text-sm">
                    {formData.visible_to.errors[0]}
                  </span>
                )}
              </div>
            </FormItem>
          )}

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 mt-5"
          title="Submit"
          block={false}
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default EditSms;
