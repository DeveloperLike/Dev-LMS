import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomModeSelectInput,
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { Form, message } from "antd";
import {
  addTicketListService,
  getAdminDropdown,
  getTicketCategoriesService,
} from "./ApiService";
import { getRolesService } from "../User/ApiService";
import UploadImage from "./Component/UploadImage";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

const AddTicket = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ticketCategories, setTicketCategories] = useState([]);
  // const [role, setRole] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [img, setImg] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: null,
    attachment: img,
    assigned_to_user: null,
    ticket_category: null,
  });
  const [formErrors, setFormErrors] = useState({
    title: null,
    description: null,
    priority: null,
    attachment: null,
    assigned_to_user: null,
    ticket_category: null,
  });
  const navigate = useNavigate();

  // Handle input changes and update state
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Select value update
  const handleSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImg(selectedFile);
    }
  };

  // Fetch ticket Categories
  const fetchTicketCategories = async () => {
    getTicketCategoriesService().then((response) => {
      if (response.data && response.data.success === "1") {
        setTicketCategories(response.data.data);
      }
    });
  };

  // Fetch Roles
  // const fetchRoles = async () => {
  //   getRolesService().then((response) => {
  //     if (response.data && response.data.success === "1") {
  //       setRole(response.data.data);
  //     }
  //   });
  // };

  const fetchCounsellorsData = () => {
    getAdminDropdown().then((response) => {
      setAdmin(response.data.data);
    });
  };

  const callCreateTicketApiService = async () => {
    if (loading) return;
    setLoading(true);

    const formDataToSend = new FormData();

    // Append all form fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("ticket_category", formData.ticket_category);
    formData?.assigned_to_user?.forEach((username) => {
      formDataToSend.append("assigned_to_user", username);
    });
    // Append the file separately
    if (img) {
      formDataToSend.append("attachment", img);
    }

    try {
      const response = await addTicketListService(formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === "1") {
        setFormData({
          title: "",
          description: "",
          priority: null,
          attachment: img,
          assigned_to_user: null,
          ticket_category: null,
        });
        setImg(null);
        setFileInputKey(Date.now()); // Change key to reset input field
        message.success(response.data.message);
        navigate("/tickets");
      }
    } catch (error) {
      if (error?.response) {
        message.error(error?.response?.data?.message);
        setFormErrors(error?.response?.data?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      attachment: img,
    }));
  }, [img]);

  useEffect(() => {
    fetchTicketCategories();
    // fetchRoles();
    fetchCounsellorsData();
  }, []);

  return (
    <div>
      <div className="flex justify-between w-full px-7 ">
        <div className="w-fit mb-3">
          <h1 className="text-xl text-black font-semibold ">Add Tickets</h1>
          <p className="text-sm font-thin ">Manage your Tickets</p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/tickets")}
            className="underline block"
          >
            Back
          </button>
        </div>
      </div>

      <div className="w-full mt-[2%]">
        <div className="w-[90%] md:max-w-[50%] m-auto bg-white p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              callCreateTicketApiService();
            }}
            className="w-full flex flex-col gap-3"
          >
            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Title<sup className="text-red-500">*</sup>
                </label>
                <InputWithIcon
                  name="title"
                  required={true}
                  maxLength={50}
                  value={formData.title}
                  type="text"
                  placeholder="Please enter Title"
                  handler={(e) => handleInput(e)}
                />
                {formErrors?.title && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.title}
                  </div>
                )}
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Description<sup className="text-red-500">*</sup>
                </label>
                {/* <InputWithIcon
                  name="description"
                  required={true}
                  maxLength={2000}
                  value={formData.description}
                  type="text"
                  placeholder="Please enter description"
                  handler={(e) => handleInput(e)}
                /> */}

                <CustomTextArea
                  name="description"
                  required={true}
                  maxLength={2000}
                  value={formData.description}
                  placeholder="Please enter description"
                  handler={(e) => handleInput(e)}
                />

                {formErrors?.description && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.description}
                  </div>
                )}
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Assigned to User<sup className="text-red-500">*</sup>
                </label>
                <CustomSelectInput
                  name="assigned_to_user"
                  placeholder="Please select Assigned to User"
                  mode="multiple"
                  tokenSeparators={[","]}
                  value={formData.assigned_to_user}
                  showSearch
                  required={true}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  handler={(e) => handleSelect(e, "assigned_to_user")}
                  options={
                    admin &&
                    admin.map((item) => ({
                      value: item.username,
                      label: item.email,
                    }))
                  }
                />
                {formErrors?.assigned_to_user && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.assigned_to_user}
                  </div>
                )}
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Priority<sup className="text-red-500">*</sup>
                </label>
                <CustomSelectInput
                  placeholder="Please select Priority"
                  name="priority"
                  value={formData.priority}
                  showSearch
                  required={true}
                  handler={(e) => handleSelect(e, "priority")}
                  options={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
                {formErrors?.priority && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.priority}
                  </div>
                )}
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Ticket Category<sup className="text-red-500">*</sup>
                </label>
                <CustomSelectInput
                  name="ticket_category"
                  value={formData.ticket_category}
                  showSearch
                  required={true}
                  handler={(e) => handleSelect(e, "ticket_category")}
                  options={
                    ticketCategories &&
                    ticketCategories.map((item) => ({
                      value: item.id,
                      label: item.title,
                    }))
                  }
                  placeholder="Please select Ticket Category"
                />
                {formErrors?.ticket_category && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.ticket_category}
                  </div>
                )}
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>Attechment</label>
                <input
                  key={fileInputKey}
                  type="file"
                  // accept=".jpg, .jpeg, .png, .pdf .mp4"
                  className="block "
                  onChange={handleInputFile}
                />
                {formErrors?.attachment && (
                  <div className="text-red-500 text-sm">
                    {formErrors?.attachment}
                  </div>
                )}
              </div>
              <p className="text-red-500 text-md">
                {formData?.attachment?.errors}
              </p>
            </FormItem>

            <PrimaryButton
              type="primary"
              htmlType="submit"
              className="p-4 mx-auto max-w-[max-content]"
              title="Submit"
              block={false}
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;

const CustomTextArea = ({
  name,
  value,
  placeholder,
  required,
  maxLength,
  handler,
}) => {
  return (
    <TextArea
      className="border p-2 rounded-md w-full resize-none focus:outline-orange-400 focus:outline-[1px] "
      name={name}
      value={value}
      onChange={handler}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      rows={4}
    />
  );
};
