import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const CustomUpload = ({
  onChange,
  disabled,
  fileList,
  errors = [],
  ...props
}) => {
  return (
    <>
      <Upload
        fileList={fileList}
        listType="picture"
        required={true}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {fileList?.length < 1 && (
          <Button icon={<UploadOutlined />}>Select File</Button>
        )}
      </Upload>
      {errors?.length > 0
        ? errors.map((err, index) => {
            return (
              <p key={index} className="mt-1 text-sm text-red-500">
                {err}
              </p>
            );
          })
        : ""}
    </>
  );
};
