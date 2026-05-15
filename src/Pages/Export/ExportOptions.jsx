import { useState, useEffect } from "react";
import axios from "axios";

function ExportOptions() {

  const [jobId, setJobId] = useState(null);

  const [status, setStatus] = useState(null);

  const [progress, setProgress] = useState(0);

  const [downloadUrl, setDownloadUrl] = useState(null);

  const startExport = async () => {

    const res = await axios.post(
      "/api/export/start",
      {},
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        }
      }
    );

    setJobId(res.data.job_id);

    setStatus(res.data.status);
  };

  useEffect(() => {

    if (!jobId) return;

    const interval = setInterval(async () => {

      const res = await axios.get(

        `/api/export/status/${jobId}`,

        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`
          }
        }
      );

      setStatus(res.data.status);

      setProgress(res.data.progress);

      if (res.data.status === "completed") {

        setDownloadUrl(
          `https://your-domain/media/${res.data.file}`
        );

        clearInterval(interval);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, [jobId]);

  return (

    <div>

      <h1 className="text-xl font-semibold mb-4">
        Export Leads
      </h1>

      {!jobId && (

        <button
          onClick={startExport}
          className="bg-yellow-400 px-4 py-2 rounded"
        >
          Start Export
        </button>

      )}

      {status === "processing" && (

        <div className="mt-4">

          <p>Processing: {progress}%</p>

          <div className="w-full bg-gray-200 h-3 rounded">

            <div
              className="bg-yellow-400 h-3 rounded"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

      )}

      {status === "completed" && (

        <div className="mt-4">

          <a
            href={downloadUrl}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download File
          </a>

        </div>

      )}

    </div>

  );
}

export default ExportOptions;