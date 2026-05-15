import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Row, Col, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../Components/CustomComponents/ButtonUi';
import { InputWithIcon } from '../../Components/CustomComponents/InputWithIcon';
import authenticatedAxiosInstance from '../../lib/AxiosInstance';
import {
  addleadlistService,
  getLeadFormFeildService,
  getLeadSourceService,
} from './ApiService';
import { DatePicker, Space } from 'antd';
import { Radio } from 'antd';
import InputWithSelect from '../../Components/CustomComponents/InputWIthSelect';

const { Option } = Select;

const Addvancedleadfilter = () => {
  const [formData, setFormData] = useState([]);
  const [dropdownData, setDropdown] = useState([]);
  const [leadsource, setLeadSource] = useState();
  const [dropdownValue, setDropdownValue] = useState({
    phone: 'phone',
    full_name: 'full_name',
    email: 'email',
    did_number: 'did_number',
    user_group: 'user_group',
  });
  const [inputValue, setInputValue] = useState({
    phone: '',
    full_name: '',
    email: '',
    did_number: '',
    user_group: '',
  });

  const [form] = Form.useForm();
  const navigate = useNavigate();

  // getting form creating feild data
  const leadformfieldGetApi = () => {
    getLeadFormFeildService().then((response) => {
      setFormData(response.data.data);
    });
  };

  const optionsFields = [
    {
      label: 'exact',
      value: 'exact',
    },
    {
      label: 'iexact',
      value: 'iexact',
    },
    {
      label: 'contains',
      value: 'contains',
    },
    {
      label: 'icontains',
      value: 'icontains',
    },
  ];
  const handleInput = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };
  const handleEmailSelect = (value) => {
    setDropdownValue({
      ...dropdownValue,
      email: 'email__' + value,
    });
  };

  let phoneKey = dropdownValue.phone;
  let phoneValue = inputValue.phone;
  let emailKey = dropdownValue.email;
  let emailValue = inputValue.email;
  let fullNameKey = dropdownValue.full_name;
  let fullNameValue = inputValue.full_name;
  let didNumberKey = dropdownValue.did_number;
  let didNumberValue = inputValue.did_number;
  let userGroupKey = dropdownValue.user_group;
  let userGroupValue = inputValue.user_group;


  const handleAdvFilters = () => {
    setFilteredData(true);
    setFilters({
      ...filters,
      [phoneKey]: phoneValue,
      [emailKey]: emailValue,
      [fullNameKey]: fullNameValue,
      [didNumberKey]: didNumberValue,
      [userGroupKey]: userGroupValue,
    });
  };

  useEffect(() => {
    leadformfieldGetApi();
  }, []);

  return (
    <>
      <Form
        form={form}
        //    onFinish={handleSubmit}
        layout="vertical"
      >
        <div className="bg-white p-13 rounded-lg mx-6">
          <div className="flex justify-between w-full ">
            <div className="w-fit mb-5">
              <h1 className="text-xl text-black font-semibold ">Lead</h1>
              <p className="text-sm font-thin ">Search your lead</p>
            </div>

            <div>
              <button
                onClick={() => navigate('/lead2')}
                className="underline block"
              >
                Back
              </button>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            {formData &&
              formData.map((field, index) => (
                <React.Fragment key={field.code}>
                  <Col span={12}>
                    <Form.Item
                      className="mb-1"
                      name={field.code}
                      label={field.label}
                      rules={[{ required: field.is_required }]}
                    >
                      {field.type === 'select' ? (
                        <Select
                          size="large"
                          placeholder={`Select ${field.label}`}
                        >
                          {field.options.length > 0 ? (
                            field.options.map((option, i) => (
                              <Option key={i} value={option}>
                                {option}
                              </Option>
                            ))
                          ) : (
                            <Option disabled>No options available</Option>
                          )}
                        </Select>
                      ) : field.type === 'text' ||
                        field.type === 'number' ||
                        field.type === 'email' ? (
                        <InputWithSelect
                          options={optionsFields}
                          // selectHandler={handleEmailSelect}
                          // inputName="email"
                          defaultValue="exact"
                          // inputValue={inputValue.email}
                          inputHandler={handleInput}
                          // title={<span className="text-xs">Email</span>}
                          placeholder={'Enter your email'}
                        />
                      ) : field.type === 'radio' ? (
                        <Radio.Group
                          name={field.code}
                          defaultValue={field.value}
                        >
                          {field.options.length > 0 ? (
                            field.options.map((option, i) => (
                              <Radio key={i} value={option}>
                                {option}
                              </Radio>
                            ))
                          ) : (
                            <Radio>No options available</Radio>
                          )}
                        </Radio.Group>
                      ) : field.type === 'date' ? (
                        <DatePicker
                          name={field.code}
                          defaultValue={
                            field.value ? moment(field.value) : null
                          }
                          format="DD-MM-YYYY"
                          style={{ width: '100%' }}
                        />
                      ) : null}
                    </Form.Item>
                  </Col>
                </React.Fragment>
              ))}
          </Row>
        </div>

        <div className="h-18 w-[100%] fixed bottom-0  bg-white">
          <div className="w-[78%] h-full flex items-center justify-end">
            {/* <PrimaryButton
              // onclick={handleSubmit}
              type="primary"
              htmlType="submit"
              className="p-5"
              title={'Add Lead'}
              block={false}
            /> */}
            <div className="flex items-end">
              <PrimaryButton
                type={'primary'}
                title={'Search'}
                onClick={handleAdvFilters}
                className={'w-fit p-[18px] px-6 mx-1'}
              />
              {/* <PrimaryButton
                title={'Reset'}
                className={'w-fit p-[18px] px-6 mx-2'}
                onClick={handleResetFilter}
              /> */}
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Addvancedleadfilter;
