import { Outlet } from "react-router-dom";

function ExportLayout() {

  return (

    <div className="flex h-full">

      <div className="w-[25%] border-r p-4">

        <h2 className="font-semibold text-lg">
          Export Menu
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Select export options
        </p>

      </div>

      <div className="flex-1 p-4">

        <Outlet />

      </div>

    </div>

  );
}

export default ExportLayout;