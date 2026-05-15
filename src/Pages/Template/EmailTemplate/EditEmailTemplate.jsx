import { useNavigate, useParams } from 'react-router-dom';
import { EditRichTextEditor } from './Components/EditRichTextEditor';
export const EditEmailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="mx-6 bg-white p-10 rounded-lg">
        <div className="flex justify-between w-full ">
          <div className="w-fit mb-5">
            <h1 className="text-xl text-black font-semibold ">
              Edit Email Template
            </h1>
            <p className="text-sm font-thin ">Manage your Email Template</p>
          </div>

          <div>
            <button
              onClick={() => navigate('/template')}
              className="underline block"
            >
              Back
            </button>
          </div>
        </div>

       <EditRichTextEditor id={id} />
      </div>
    </>
  );
};
