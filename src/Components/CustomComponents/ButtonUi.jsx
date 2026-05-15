import { Button, Flex } from 'antd';

//  outline button

export const OutLineButton = ({ title, onclick, className, block = false }) => {
  return (
    <>
      <Button
        className={`border-orange-500 text-orange-500 ${className}`}
        block={block}
        onClick={onclick}
      >
        {title}
      </Button>
    </>
  );
};

// primary button
export const PrimaryButton = ({
  title,
  children,
  type,
  htmlType,
  onClick,
  className,
  block = false,
  disabled,
  ...props
}) => {
  return (
    <Button
      htmlType={htmlType}
      className={className}
      onClick={onClick}
      type={type}
      block={block}
      disabled={disabled}
      {...props}
    >
      {children ? children : title}
    </Button>
  );
};
