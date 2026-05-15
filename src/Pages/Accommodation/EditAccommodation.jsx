import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { Form, message } from "antd";
import {
  detailsAccommodationService,
  editAccommodationService,
  getUniversityDropdownListService,
} from "./ApiService";


const EditAccommodation = ({ getListApi, onEditClose, selectedData }) => {
  const [loading, setLoading] = useState(false); 
  const [univercitylist, setUnivercityList] = useState();
  const [formData, setFormData] = useState({
    title: { value: "", errors: [] },
    city: { value: "", errors: [] },
    university: { value: "", errors: [] },
    accommodation_preference: { value: null, errors: [] },
    location_type: {value: null, errors: []},
    proximity: {value: "", errors: []},
    location: {value: "", errors: []}
  });

  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
      errors: [],
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

  // add Accommodation data here
  const payload = {
    title: formData?.title?.value, 
    city: formData?.city?.value,
    university: formData?.university?.value,
    accommodation_preference: formData?.accommodation_preference?.value,
    location_type: formData?.location_type?.value,
    location: formData?.location?.value,
    proximity: formData?.proximity.value
  };


  const callCreateBranchApiService = () => {
    if (loading) return;
    setLoading(true); 
    // console.log(payload, "payload");
    editAccommodationService(selectedData,payload)
      .then((response) => {
        if (response.data.success === "1") {
          onEditClose(false);
          getListApi();
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



    const accommodationDetailsData = () => {
    detailsAccommodationService(selectedData).then((response) => {
        const jsonResponse = response.data.data;
        setFormData({
          title: { value: jsonResponse.title },
          city: { value: jsonResponse.city },
          accommodation_preference: {
            value: jsonResponse.accommodation_preference,
          },
          university: { value:jsonResponse.university},
          location_type: {value: jsonResponse.location_type},
          location: {value: jsonResponse.location},
          proximity: {value:jsonResponse.proximity}
        });
      });
  }
  useEffect(() => {
    accommodationDetailsData();
  }, [selectedData]);


  useEffect(()=>{
getUniversityDropdownListService().then((response)=>{
  setUnivercityList(response.data.data)
})
  },[]);


  return (
    <>
      <Form
        layout="vertical"
        onFinish={callCreateBranchApiService}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <label className="block">
            Title<sup className="text-red-500">*</sup>
          </label>
          <InputWithIcon
            name="title"
            required={true}
            maxLength={35}
            value={formData?.title?.value}
            errors={formData?.title?.errors}
            placeholder="Please enter title"
            handler={handleInputChange("title")} 
          />
        </FormItem>
        <FormItem>
          <label className="block">
          Proximity<sup className="text-red-500">*</sup>
          </label>
          <InputWithIcon
            name="proximity"
            type={"number"}
            required={true}
            maxLength={35}
            value={formData?.proximity?.value}
            errors={formData?.proximity?.errors}
            placeholder="Please enter proximity"
            handler={handleInputChange("proximity")} 
          />
        </FormItem>

        <FormItem>
          <label className="block">
          Location<sup className="text-red-500">*</sup>
          </label>
          <InputWithIcon
            name="location"
            required={true}
            maxLength={35}
            value={formData?.location?.value}
            errors={formData?.location?.errors}
            placeholder="Please enter location"
            handler={handleInputChange("location")} 
          />
        </FormItem>

        <FormItem>
          <label className="block">
          University<sup className="text-red-500">*</sup>
          </label>
          <CustomSelectInput
            name="university"
            className="w-full"
            required={true}
            maxLength={35}
            value={formData?.university?.value || null} 
            errors={formData?.university?.errors}
            placeholder="Please enter university"
            handler={handleInputChange("university")} 
            options={univercitylist?.map((item) => ({
              value: item.id,
              label: item.university_name,
            }))}
          />
        </FormItem>

        <FormItem>
          <label className="block">
            City<sup className="text-red-500">*</sup>
          </label>
          <InputWithIcon
            name="city"
            required={true}
            maxLength={35}
            value={formData?.city?.value}
            errors={formData?.city?.errors}
            placeholder="Please enter city"
            handler={handleInputChange("city")} 
          />
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Accommodation Preference<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="accommodation_preference"
              placeholder="Select accommodation preference"
              className="w-full"
              value={formData?.accommodation_preference?.value || null}
              errors={formData?.accommodation_preference?.errors}
              handler={handleInputChange("accommodation_preference")} 
              options={[
                { value: "Private", label: "Private" },
                { value: "Shared", label: "Shared" },
              ]}
            />
          </div>
        </FormItem>


        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
            Location Type<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="location_type"
              placeholder="Select location type"
              className="w-full"
              value={formData?.location_type?.value || null}
              errors={formData?.location_type?.errors}
              handler={handleInputChange("location_type")} 
              options={[
                { value: "On-Campus", label: "On-Campus" },
                { value: "Off-Campus", label: "Off-Campus" },
              ]}
            />
          </div>
        </FormItem>

        {/* Submit Button */}
        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5"
          title="Save"
          block={false}
          disabled={loading}
        />
        {/* Submit Button */}
      </Form>
    </>
  );
};

export default EditAccommodation;