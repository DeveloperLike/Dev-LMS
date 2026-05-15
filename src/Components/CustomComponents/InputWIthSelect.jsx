import React from 'react';
import { CustomSelectInput, InputWithIcon } from './InputWithIcon';

const InputWithSelect = ({
  options,
  defaultValue,
  optionName,
  inputName,
  inputValue,
  selectValue,
  title,
  selectHandler,
  inputHandler,
  placeholder,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{title}</label>
      <div className="flex flex-row items-center gap-1">
        <CustomSelectInput
          name={optionName}
          options={options}
          defaultValue={defaultValue}
          value={selectValue}
          handler={selectHandler}
          style={{maxWidth:'100px'}}
          placeholder={placeholder}
        />
        <InputWithIcon
          name={inputName}
          value={inputValue}
          type="text"
          placeholder={placeholder}
          handler={inputHandler}
        />
      </div>
    </div>
  );
};

export default InputWithSelect;
