import React from "react";
import { DatePicker } from "antd";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import {
    CustomSelectInput,
    InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";

const LeadFilters = ({
    isSelected,
    filterValue,
    handleInput,
    handleSelectChange,
    dateRange,
    setDateRange,
    modifiedDateRange,
    setModifiedDateRange,
    reEnquiryDateRange,
    setReEnquiryDateRange,
    rangePresets,
    dateFormat,
    handleAdvFilters,
    handleResetFilter,
    counsellorDropdown,
    manager,
    leadStatusDropdown,
    leadSubStatusDropdown,
    branchList,
    trackingUrl,
    sourceGroupDropdown,
    leadSourceDropdown,
}) => {
    const { RangePicker } = DatePicker;

    if (!isSelected) return null;

    return (
        <div className="mb-3 mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <form>
                <div className="grid md:grid-cols-5 gap-4">
                    <div className="flex flex-col">
                        <label>Student Name</label>
                        <InputWithIcon
                            name="name"
                            value={filterValue.name}
                            className=" "
                            type="text"
                            placeholder="Please enter full name"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Student Email</label>
                        <InputWithIcon
                            name="email"
                            value={filterValue.email}
                            className=" "
                            type="email"
                            placeholder="Please enter email"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Student Phone</label>
                        <InputWithIcon
                            name="phone"
                            value={filterValue.phone}
                            className=" "
                            type="number"
                            placeholder="Please enter Phone Number"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Created</label>
                        <RangePicker
                            format={dateFormat}
                            size="large"
                            onChange={(v) => setDateRange(v)}
                            presets={rangePresets}
                            value={dateRange && [dateRange[0], dateRange[1]]}
                        />
                    </div>

                    {/* date filter start from here */}
                    <div className="flex flex-col">
                        <label>Modified</label>
                        <RangePicker
                            format={dateFormat}
                            size="large"
                            onChange={(v) => setModifiedDateRange(v)}
                            presets={rangePresets}
                            value={
                                modifiedDateRange && [
                                    modifiedDateRange[0],
                                    modifiedDateRange[1],
                                ]
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Interested</label>
                        <CustomSelectInput
                            name="interest_count"
                            placeholder="Please select VC Status"
                            value={filterValue.interest_count}
                            handler={(value) => handleSelectChange(value, "interest_count")}
                            options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>VC Conducted</label>
                        <CustomSelectInput
                            name="vc_count"
                            placeholder="Please select VC Status"
                            value={filterValue.vc_count}
                            handler={(value) => handleSelectChange(value, "vc_count")}
                            options={[{ label: "Yes", value: true }, { label: "No", value: false }]}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Visit Status</label>
                        <CustomSelectInput
                            name="visit_count"
                            placeholder="Please select Visit Status"
                            value={filterValue.visit_count}
                            handler={(value) => handleSelectChange(value, "visit_count")}
                            options={[
                                { label: "Visited", value: true },
                                { label: "Not Visited", value: false },
                            ]}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Lead Category</label>
                        <CustomSelectInput
                            name="lead_category"
                            placeholder="Please select Lead Category"
                            value={filterValue.lead_category}
                            handler={(value) => handleSelectChange(value, "lead_category")}
                            options={[
                                { label: "Hot", value: "Hot" },
                                { label: "Warm", value: "Warm" },
                                { label: "Cold", value: "Cold" },
                            ]}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Minimum Reach</label>
                        <InputWithIcon
                            name="reached_out_count"
                            min="0"
                            value={filterValue.reached_out_count}
                            className=" "
                            type="number"
                            placeholder="Please enter Minimum Reach"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Minimum Interaction</label>
                        <InputWithIcon
                            name="interaction_count"
                            min="0"
                            value={filterValue.interaction_count}
                            className=" "
                            type="number"
                            placeholder="Please enter Minimum Interaction"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Lead Status</label>
                        <CustomSelectInput
                            name="leads_status"
                            placeholder="Please select Lead Status"
                            value={filterValue.leads_status}
                            handler={(value) => handleSelectChange(value, "leads_status")}
                            options={leadStatusDropdown.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            mode="multiple"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Last Sub Status</label>
                        <CustomSelectInput
                            name="last_sub_status"
                            placeholder="Please select Sub Status"
                            value={filterValue.last_sub_status}
                            handler={(value) =>
                                handleSelectChange(value, "last_sub_status")
                            }
                            options={leadSubStatusDropdown.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            mode="multiple"
                        />
                    </div>


                    <div className="flex flex-col">
                        <label>Counsellor</label>
                        <CustomSelectInput
                            name="assign_to"
                            placeholder="Please select Counsellor"
                            mode="multiple"
                            tokenSeparators={[","]}
                            value={filterValue.assign_to}
                            handler={(value) => handleSelectChange(value, "assign_to")}
                            options={counsellorDropdown.map((item) => ({
                                value: item.username,
                                label: item.email,
                            }))}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Manager</label>
                        <CustomSelectInput
                            name="manager"
                            placeholder="Please select Manager"
                            mode="multiple"
                            tokenSeparators={[","]}
                            value={filterValue.manager}
                            handler={(value) => handleSelectChange(value, "manager")}
                            options={manager.map((item) => ({
                                value: item.username,
                                label: item.email,
                            }))}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Re Enquire Date Range</label>
                        <RangePicker
                            format={dateFormat}
                            size="large"
                            onChange={(v) => setReEnquiryDateRange(v)}
                            presets={rangePresets}
                            value={
                                reEnquiryDateRange && [
                                    reEnquiryDateRange[0],
                                    reEnquiryDateRange[1],
                                ]
                            }
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Assign Branch</label>
                        <CustomSelectInput
                            name="branch"
                            placeholder="Please select Assigned Branch"
                            value={filterValue.branch}
                            handler={(value) =>
                                handleSelectChange(value, "branch")
                            }
                            mode="multiple"
                            options={branchList.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Interested Degree</label>
                        <InputWithIcon
                            name="interested_degree"
                            value={filterValue.interested_degree}
                            className=" "
                            type="text"
                            placeholder="Please enter Interested Degree"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Interested Course</label>
                        <InputWithIcon
                            name="interested_course"
                            value={filterValue.interested_course}
                            className=" "
                            type="text"
                            placeholder="Please enter Interested Course"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Source Group</label>
                        <CustomSelectInput
                            name="source_group"
                            placeholder="Please select Source Group"
                            mode="multiple"
                            tokenSeparators={[","]}
                            value={filterValue.source_group}
                            handler={(value) => handleSelectChange(value, "source_group")}
                            options={sourceGroupDropdown}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Lead Source</label>
                        <CustomSelectInput
                            name="lead_source"
                            placeholder="Please select Lead Source"
                            mode="multiple"
                            tokenSeparators={[","]}
                            value={filterValue.lead_source}
                            handler={(value) => handleSelectChange(value, "lead_source")}
                            options={leadSourceDropdown.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Secondary Source</label>
                        <InputWithIcon
                            name="secondary_source"
                            value={filterValue.secondary_source}
                            className=" "
                            type="text"
                            placeholder="Please Enter Secondary Source"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                        {/* <CustomSelectInput
                name="secondary_source"
                placeholder="Please select Lead Source"
                // mode="multiple"
                tokenSeparators={[","]}
                value={filterValue.secondary_source}
                handler={(value) => handleSelectChange(value, "secondary_source")}
                options={leadSourceDropdown.map((item) => ({
                  value: item.name,
                  label: item.name,
                }))}
              /> */}
                    </div>

                    <div className="flex flex-col">
                        <label>Tracking Url</label>
                        <CustomSelectInput
                            mode="multiple"
                            name="tracking_url"
                            placeholder="Please select Tracking Url"
                            value={filterValue.tracking_url}
                            handler={(value) => handleSelectChange(value, "tracking_url")}
                            options={trackingUrl.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Nearest Location</label>
                        <CustomSelectInput
                            name="nearest_branch"
                            placeholder="Please select Nearest Location"
                            value={filterValue.nearest_branch}
                            handler={(value) =>
                                handleSelectChange(value, "nearest_branch")
                            }
                            mode="multiple"
                            options={branchList.map((item) => ({
                                value: item.name,
                                label: item.name,
                            }))}
                        />
                    </div>


                    <div className="flex flex-col">
                        <label>UTM Source</label>
                        <InputWithIcon
                            name="utm_source"
                            value={filterValue.utm_source}
                            className=" "
                            type="text"
                            placeholder="Please enter full name"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>UTM Campaign</label>
                        <InputWithIcon
                            name="utm_campaign"
                            value={filterValue.utm_campaign}
                            className=" "
                            type="text"
                            placeholder="Please enter UTM Campaign"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>UTM Medium</label>
                        <InputWithIcon
                            name="utm_medium"
                            value={filterValue.utm_medium}
                            className=" "
                            type="text"
                            placeholder="Please enter UTM Medium"
                            handler={(e) => handleInput(e)}
                            allowClear
                        />
                    </div>

                    <div className=" flex gap-1 items-center pt-6 ">
                        <PrimaryButton
                            type={"primary"}
                            title={"Search"}
                            onClick={handleAdvFilters}
                            className={"w-fit p-[18px] px-6 mx-1 text-black"}
                        />
                        <PrimaryButton
                            title={"Reset"}
                            className={"w-fit p-[18px] px-6 mx-2"}
                            onClick={handleResetFilter}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LeadFilters;