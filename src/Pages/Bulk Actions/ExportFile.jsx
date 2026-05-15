import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { Form, DatePicker, message } from "antd";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { getCityDropdownService } from "../City/ApiService";
import FormItem from "antd/es/form/FormItem";
import { useDispatch } from "react-redux";
import { getExportCounsellorDropdownService, postExportService } from "./ApiService";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import moment from "moment/moment";
import dayjs from "dayjs";

const ExportFile = ({ getExportApi, setOpenExport }) => {
  const [formData, setFormData] = useState({
    city: { value: "", errors: [] },
    counsellors: { value: "", errors: [] },
  });
  const [dateRange, setDateRange] = useState([null, null]); // Initialize dateRange as null
  const [cities, setCities] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";

  const handleCity = (e) => {
    setFormData({
      ...formData,
      city: { value: e, errors: [] },
    });
  };

  const handleCounsellor = (e) => {
    setFormData({
      ...formData,
      counsellors: { value: e, errors: [] },
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

  const payload = {
    start_date: dateRange[0] ? dateRange[0].format(dateFormat) : "", 
    end_date: dateRange[1] ? dateRange[1].format(dateFormat) : "",   
    city: formData.city.value || "", 
    counsellors: formData.counsellors.value || "", 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (loading) return;

    postExportService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpenExport(false);
          getExportApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCityDropdownService().then((response) => {
      setCities(response.data.data);
    });
    getExportCounsellorDropdownService().then((response) => {
      setCounsellor(response.data.data);
    });
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormItem>
          <div className="flex flex-col gap-1">
            <label> From Date & To Date </label>
            <RangePicker
              format={dateFormat}
              value={dateRange[0] && dateRange[1] ? dateRange : null} 
              onChange={(v) => setDateRange(v)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>City</label>
            <CustomSelectInput
              name="city"
              className=""
              value={formData.city.value}
              errors={formData.city.errors}
              type="text"
              placeholder="Please select city"
              handler={(e) => handleCity(e)}
              options={cities.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Counsellor</label>
            <CustomSelectInput
              name="counsellors"
              className=""
              value={formData.counsellors.value}
              errors={formData.counsellors.errors}
              type="text"
              placeholder="Please select counsellor"
              handler={(e) => handleCounsellor(e)}
              options={
                counsellor &&
                counsellor.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))
              }
            />
          </div>
        </FormItem>

        <PrimaryButton
          title={"Export"}
          className={"mt-4"}
          htmlType="submit"
          disabled={loading}
        />
      </form>
    </>
  );
};

export default ExportFile;
