// import React from 'react';
// import InputWithSelect from './InputWIthSelect';
// import { PrimaryButton } from './buttonUi';
// import { Form, Input, Select } from 'antd';
// import { InputWithIcon } from './InputWithIcon';

// function Filters({
//   filterOptions,
//   handleEmail,
//   handleName,
//   handlePhone,
//   handleDidNumber,
//   handleUserGroup,
//   handleInput,
//   handleSearch,
//   handleReset,
//   inputValue,
// }) {
//   return (
//     <div className="mb-3 mx-6 rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
//       <form>
//         <div className="grid grid-cols-4 gap-5">
//           <InputWithSelect
//             options={filterOptions}
//             selectHandler={handleEmail}
//             inputName="email"
//             defaultValue="exact"
//             inputValue={inputValue.email}
//             inputHandler={handleInput}
//             title={<span className="text-xs">Email</span>}
//             placeholder={'Enter your email'}
//           />
//           <InputWithSelect
//             options={filterOptions}
//             selectHandler={handleName}
//             inputName="full_name"
//             defaultValue="exact"
//             inputValue={inputValue.full_name}
//             inputHandler={handleInput}
//             title={<span className="text-xs">Full Name</span>}
//             placeholder={'Enter your full name'}
//           />
//           <InputWithSelect
//             selectHandler={handlePhone}
//             options={filterOptions}
//             inputName="phone"
//             defaultValue="exact"
//             inputValue={inputValue.phone}
//             inputHandler={handleInput}
//             title={<span className="text-xs">Phone</span>}
//             placeholder={'Enter your phone'}
//           />
//           <InputWithSelect
//             selectHandler={handleDidNumber}
//             options={filterOptions}
//             inputName="did_number"
//             defaultValue="exact"
//             inputValue={inputValue.did_number}
//             inputHandler={handleInput}
//             title={<span className="text-xs">DID Number</span>}
//             placeholder={'Enter your did number'}
//           />
//           <InputWithSelect
//             selectHandler={handleUserGroup}
//             inputName="user_group"
//             defaultValue="exact"
//             inputValue={inputValue.user_group}
//             inputHandler={handleInput}
//             title={<span className="text-xs">User Group</span>}
//             placeholder={'Enter your user group'}
//             options={null}
//           />
//           <div className="flex items-end">
//             <PrimaryButton
//               type={'primary'}
//               title={'Search'}
//               onClick={handleSearch}
//               className={'w-fit p-[18px] px-6 mx-1'}
//             />
//             <PrimaryButton
//               title={'Reset'}
//               className={'w-fit p-[18px] px-6 mx-2'}
//               onClick={handleReset}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Filters;



//     // <div>
//     //   <CustomSelectInput
//     //     name={selectName}
//     //     options={options}
//     //     defaultValue={defaultValue}
//     //     value={selectValue}
//     //     handler={selectHandler}
//     //   />
//     //   <InputWithIcon
//     //     name={inputName}
//     //     value={inputValue}
//     //     type="text"
//     //     placeholder={placeholder}
//     //     handler={inputHandler}
//     //   />
//     // </div>
