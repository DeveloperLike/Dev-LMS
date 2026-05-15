import { Tabs } from "antd";
import { StudentCourse } from "./StudentCourse";
import AppliedCourses from "./AppliedCourses";

export const CoursesTab = ({userName}) => {
  const column = [
    {
      key: "1",
      label: "All Courses",
      children: <StudentCourse userName={userName} />,
    },
    {
      key: "2",
      label: "Applied Courses",
      children: <AppliedCourses userName={userName}/>,
    },
  ];

  return (
    <>
      <Tabs
        className="mt-4"
        defaultActiveKey="1"
        items={column.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.children,
          icon: item.icon,
        }))}
      />
    </>
  );
};
