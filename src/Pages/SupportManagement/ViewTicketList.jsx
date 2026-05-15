import { Card, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { getTicketCommentService, getTicketDetailsService } from "./ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import AddComment from "./AddComment";
import { FaUser } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import EditComment from "./EditComment";
import { FaFileImage } from "react-icons/fa6";
import { FcLowPriority } from "react-icons/fc";
import { FcHighPriority } from "react-icons/fc";
import { IoInformationCircle } from "react-icons/io5";
import { Tooltip } from "antd";

const ViewTicketList = () => {
  const [ticketData, setTicketData] = useState();
  const [commentList, setCommentList] = useState();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const showEditDrawer = () => {
    setOpenEdit(true);
  };
  const onEditClose = () => {
    setOpenEdit(false);
  };

  const GetTicketDetailsApi = () => {
    getTicketDetailsService(id).then((response) => {
      setTicketData(response.data.data);
    });
  };

  const GetTicketCommentApi = () => {
    getTicketCommentService(id).then((response) => {
      setCommentList(response.data.data);
    });
  };

  useEffect(() => {
    GetTicketDetailsApi();
    GetTicketCommentApi();
  }, []);

  return (
    <div>
      <div className="flex justify-between w-full px-7 ">
        <div className="w-fit mb-3">
          <h1 className="text-xl text-black font-semibold ">View Tickets</h1>
          <p className="text-sm font-thin ">Manage your Tickets</p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/tickets")}
            className="underline block"
          >
            Back
          </button>
        </div>
      </div>

      <div className="w-[90%] md:max-w-[70%] m-auto">
        <Card className="">
          <div className="flex justify-between">
            <h3 className="font-bold text-base uppercase mb-2">
              {ticketData?.title}
            </h3>

            <div className="h-20 ">
              <p className=" text-slate-400 text-sm">
                {ticketData?.created_at}
              </p>
            </div>
          </div>
          <div>
            <div className="p-0 flex flex-col gap-4">
              <p className="text-sm text-slate-400">
                {ticketData?.description}
              </p>
              <p className="mt-2 text-sm ">
                <strong className="uppercase ">
                  Assigned to User : &nbsp;
                </strong>{" "}
                {ticketData?.assigned_to_user?.join(", ")}
              </p>

              <p className="mt-2 text-sm ">
                <strong className="uppercase ">
                Ticket Category : &nbsp;
                </strong>{" "}
                {ticketData?.ticket_category}
              </p>

              <div className="flex gap-2 justify-between items-center">
                <p className="text-sm flex items-center">
                  <strong className="uppercase">Priority : &nbsp;</strong>{" "}
                  <div className="flex items-center gap-1 border-2 border-orange-200 rounded px-[3px]">
                    <span className="">
                      {ticketData?.priority === "low" ? (
                        <FcLowPriority />
                      ) : (
                        <FcHighPriority />
                      )}
                    </span>
                    {ticketData?.priority}
                  </div>
                </p>
                <p
                  className={`${
                    ticketData?.status === "pending"
                      ? "bg-yellow-400 text-white"
                      : ticketData?.status === "in_review"
                      ? "bg-blue-400 text-white"
                      : ticketData?.status === "open"
                      ? "bg-green-400 text-white"
                      : ticketData?.status === "on_hold"
                      ? "bg-yellow-400 text-white"
                      : ticketData?.status === "closed"
                      ? "bg-red-400 text-white"
                      : ""
                  } py-[1px] text-center mt-2 rounded-2xl max-w-[100px] min-w-[100px]`}
                >
                  {ticketData?.status.replace(/_/, " ")}
                </p>
              </div>

              {ticketData?.attachment && ticketData?.attachment_name && (
                <a
                  href={ticketData?.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex gap-2 items-center p-2 shadow w-[max-content] rounded mt-2">
                    <FaFileImage />
                    <p className="text-sm">{ticketData?.attachment_name}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>

      {commentList?.map((item, index) => {
        return (
          <div className="flex flex-col items-center">
            <div className="bg-slate-200 h-5 w-[2px]"></div>
            <div className={`mx-auto mt-0 w-[90%] md:w-[70%]`}>
              <Card
                className={`
                ${
                  item.my_tag === true
                    ? "bg-orange-50 border-t-2 border-l-0 border-r-0 border-b-0 border-orange-200"
                    : ""
                }
                `}
              >
                <div className="p-0">
                  <div className="">
                    <div className="flex justify-between">
                      <div className="w-10 h-10 rounded-full mb-0">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                          alt="loading"
                        />
                      </div>
                      <div className="h-10 ">
                        <p className=" text-slate-400 text-sm">
                          {item?.created_at}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <h3 className="font-bold mb-6 mt-1 text-sm">
                        {item?.user}
                      </h3>
                    </div>

                    <div className="flex gap-2 items-center mb-4 mt-7 text-slate-400">
                      <p className="text-sm">{item?.comment}</p>
                    </div>

                    <div className="w-full flex justify-between items-center">
                      <div>
                        {item?.attachment_name && (
                          <a
                            href={item?.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <div className="flex gap-2 items-center p-2 shadow w-[max-content] rounded mt-2">
                              <FaFileImage />
                              <p className="text-sm">{item?.attachment_name}</p>
                            </div>
                          </a>
                        )}
                      </div>

                      {/* Add Tooltip on the IoInformationCircle icon */}
                      {item?.tag_user?.length !== 0 && (
                        <div>
                          <Tooltip title={item.tag_user.join(", ")}>
                            <IoInformationCircle size={"24"} />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Drawer
                  title="Edit Comments"
                  placement="right"
                  width={400}
                  onClose={onEditClose}
                  open={openEdit}
                >
                  <EditComment
                    setOpenEdit={setOpenEdit}
                    GetTicketCommentApi={GetTicketCommentApi}
                    commentId={item.id}
                  />
                </Drawer>
              </Card>
            </div>
          </div>
        );
      })}

      {/* Add Comment Section */}
      <div className="bg-white p-6 w-[90%] md:w-[70%] m-auto rounded-lg mt-6 ">
        <AddComment
          GetTicketCommentApi={GetTicketCommentApi}
          GetTicketDetailsApi={GetTicketDetailsApi}
        />
      </div>
    </div>
  );
};

export { ViewTicketList };
