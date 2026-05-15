
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';

const UploadImage = ({ setAttachment }) => {
  const [selectedFilePath, setSelectedFilePath] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      const filePath = info.file.response.filePath; 
      setSelectedFilePath(filePath);
      console.log(filePath, 'priti');
      console.log('File path:', filePath);
    } else if (info.file.status === 'error') {
      setSelectedFilePath(null);
    } else if(info.file.status === 'removed') {
      setSelectedFilePath(null);
    }
  };


  const beforeUpload = (file) => {
    // Create a new FormData object
    const formData = new FormData();
    
    // Append the file to the FormData object
    formData.append("file", file);

    // Set the FormData to your attachment handler
    setAttachment(formData);
    return false;  // Prevent auto upload to handle it manually
};

  
  return (
    <div className="w-[100%]">
      <Upload
        listType="picture"
        onChange={handleChange}
        beforeUpload={beforeUpload}
        maxCount={1}
      >
        <Button type="primary" icon={<UploadOutlined />}>
          Upload
        </Button>
      </Upload>
      {selectedFilePath && (
        <div className="mt-4">
          <p>Selected File Path: {selectedFilePath}</p>
        </div>
      )}
    </div>
  );
};

export default UploadImage;





// // // import React, { useState } from 'react';
// // // import { UploadOutlined } from '@ant-design/icons';
// // // import { Button, Upload } from 'antd';

// // // const UploadImage = ({ setAttachment }) => {
// // //   const [selectedFilePath, setSelectedFilePath] = useState(null);

// // //   const handleChange = (info) => {
// // //     if (info.file.status === 'done') {
// // //       const filePath = info.file.response.filePath; 
// // //       setSelectedFilePath(filePath);
// // //       console.log(filePath, 'priti');
// // //       console.log('File path:', filePath);

// // //       // Update the parent component with the file path
// // //       setAttachment(filePath);
// // //     } else if (info.file.status === 'error') {
// // //       setSelectedFilePath(null);
// // //     } else if(info.file.status === 'removed') {
// // //       setSelectedFilePath(null);
// // //     }
// // //   };

// // //   const beforeUpload = (file) => {
// // //     // Create a new FormData object
// // //     const formData = new FormData();
    
// // //     // Append the file to the FormData object
// // //     formData.append("file", file);

// // //     // Set the FormData to your attachment handler
// // //     setAttachment(formData);
// // //     return false;  // Prevent auto upload to handle it manually
// // //   };

// // //   return (
// // //     <div className="w-[100%]">
// // //       <Upload
// // //         listType="picture"
// // //         onChange={handleChange}
// // //         beforeUpload={beforeUpload}
// // //         maxCount={1}
// // //       >
// // //         <Button type="primary" icon={<UploadOutlined />}>
// // //           Upload
// // //         </Button>
// // //       </Upload>
// // //       {selectedFilePath && (
// // //         <div className="mt-4">
// // //           <p>Selected File Path: {selectedFilePath}</p>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default UploadImage;



// import React, { useState } from 'react';
// import { UploadOutlined } from '@ant-design/icons';
// import { Button, Upload } from 'antd';

// const UploadImage = ({ setAttachment }) => {
//   const [selectedFilePath, setSelectedFilePath] = useState(null);

//   const handleChange = (info) => {
//     if (info.file.status === 'done') {
//       const filePath = info.file.response?.filePath; // Corrected line
//       setSelectedFilePath(filePath);
//       console.log(filePath, 'priti');
//       console.log('File path:', filePath);
//       setAttachment(filePath); // Pass filePath to parent
//     } else if (info.file.status === 'error') {
//       setSelectedFilePath(null);
//       setAttachment(null); // Clear attachment on error
//     } else if (info.file.status === 'removed') {
//       setSelectedFilePath(null);
//       setAttachment(null); // Clear attachment on remove
//     }
//   };


//   const beforeUpload = (file) => {
//     // const formData = new FormData();  // Removed formData here
//     // formData.append("file", file);
//     // setAttachment(formData);
//     setAttachment(file); // Pass the file object directly
//     return false;
// };

  
//   return (
//     <div className="w-[100%]">
//       <Upload
//         listType="picture"
//         onChange={handleChange}
//         beforeUpload={beforeUpload}
//         maxCount={1}
//       >
//         <Button type="primary" icon={<UploadOutlined />}>
//           Upload
//         </Button>
//       </Upload>
//       {selectedFilePath && (
//         <div className="mt-4">
//           <p>Selected File Path: {selectedFilePath}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadImage;



// import React, { useState } from 'react';
// import { UploadOutlined } from '@ant-design/icons';
// import { Button, Upload } from 'antd';
// import { message } from 'antd';

// const UploadImage = ({ setAttachment }) => {
//   const [selectedFilePath, setSelectedFilePath] = useState(null);

//   const handleChange = (info) => {
//     if (info.file.status === 'done') {
//       const filePath = info.file.response?.filePath;
//       setSelectedFilePath(filePath);
//       console.log(filePath, 'priti');
//       console.log('File path:', filePath);
//       setAttachment(info.file.originFileObj); // Pass the actual file object
//     } else if (info.file.status === 'error') {
//       setSelectedFilePath(null);
//       setAttachment(null);
//       message.error(`${info.file.name} file upload failed.`);
//     } else if (info.file.status === 'removed') {
//       setSelectedFilePath(null);
//       setAttachment(null);
//     }
//   };


//   const beforeUpload = (file) => {
//     // You can add additional checks here (e.g., file type, size)
//     return true; // Important:  Return true to allow Ant Design to handle the file
//   };

//   const customRequest = async ({ file, onSuccess, onError }) => {
//       // Create a FormData object to hold the file
//       const formData = new FormData();
//       formData.append('file', file); // 'file' is the key the server expects

//       // Pass the FormData object to the parent component
//       setAttachment(formData);

//       // Simulate a successful upload (you'd replace this with your actual upload logic)
//       setTimeout(() => {
//           // In a real scenario, you'd get the server's response here.
//           //  For this example, we're just simulating success.
//           const mockResponse = {
//               filePath: 'mocked-file-path/' + file.name, // Mocked file path
//           };

//           onSuccess(mockResponse); // Call onSuccess and pass a mock response
//       }, 1000); // Simulate a 1-second delay
//   };
  
//   return (
//     <div className="w-[100%]">
//       <Upload
//         listType="picture"
//         onChange={handleChange}
//         beforeUpload={beforeUpload}
//         customRequest={customRequest} // Use customRequest
//         maxCount={1}
//       >
//         <Button type="primary" icon={<UploadOutlined />}>
//           Upload
//         </Button>
//       </Upload>
//       {selectedFilePath && (
//         <div className="mt-4">
//           <p>Uploaded File: {selectedFilePath}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadImage;
