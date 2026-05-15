import { useState } from 'react';
import { FormItem } from '@/Components/Ui/Form';
import { NavLink, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../../Components/CustomComponents/ButtonUi';
import { InputWithIcon } from '../../../Components/CustomComponents/InputWithIcon';
import { RichTextEditor } from './Components/RichTextEditor';

export const AddEmailTemplate = ({ mode }) => {
  const [formData, setFormData] = useState({
    name: {
      value: '',
      errors: [],
    },
    code: {
      value: '',
      errors: [],
    },
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  return (
    <>
      <div className={`mx-6 p-10 rounded-lg ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between w-full ">
          <div className="w-fit mb-5">
            <h1 className={`text-xl font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
              Add Email Template
            </h1>
            <p className={`text-sm font-thin ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Manage your Email Template
            </p>
          </div>

          <div>
            <button
              onClick={() => navigate('/template')}
              className={`underline block ${mode === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}`}
            >
              Back
            </button>
          </div>
        </div>

        <RichTextEditor mode={mode} />

      </div>
    </>
  );
};
