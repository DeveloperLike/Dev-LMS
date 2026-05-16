import React, { useEffect, useState } from 'react'
import dayjs from "dayjs"
import { parseCSV } from "./parseCSV";
import { Modal, Button, Table, Spinner, Tabs, Tab } from "react-bootstrap";
import { motion } from "framer-motion";
import { Flex, Progress } from 'antd';
import axios from 'axios';
import CustomSpinner from '../../components/CustomSpinner';

function DataUploader({ serverURL, onlineUsers }) {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false);
  const [showCSVIUploader, setShowCSVIUploader] = useState(false)
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [baches, setBaches] = useState([])

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(baches.map((item) => item.uid));
    }
    setIsAllSelected(!isAllSelected);
  };

  useEffect(() => {
    if (baches.length > 0 && selectedIds.length === baches.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedIds, baches]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setData([]);
    setErrors([]);

    try {
      const results = await parseCSV(file, {
        requiredFields: ["full_name", "email", "phone", "source"],
        // uniqueBy: "email",

        // validateRow: (row, index) => {
        //   const errs = [];

        //   if (row.age && isNaN(row.age)) {
        //     errs.push({
        //       row: index + 1,
        //       field: "age",
        //       message: "Age must be a number",
        //     });
        //   }

        //   return errs;
        // },
      });
      const cleanData = results.data.filter((row) => {
        return Object.values(row).some(
          (value) => value !== null && value !== undefined && value.toString().trim() !== ""
        );
      });

      console.log(cleanData)
      setData(cleanData);
      setErrors(results.errors);

    } catch (err) {
      // alert(err);
      setErrors([{
        "row": "",
        "field": "",
        "message": err
      }])
      console.log(err)
    }

    setLoading(false);
  };

  const handleFileChangeForDataMigrate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setData([]);
    setErrors([]);

    try {
      const results = await parseCSV(file, {
        requiredFields: ["Intake", "Location Name", "Course Type", "Category", "Student Status", "KYC", "Lead ID"],
        // uniqueBy: "email",

        // validateRow: (row, index) => {
        //   const errs = [];

        //   if (row.age && isNaN(row.age)) {
        //     errs.push({
        //       row: index + 1,
        //       field: "age",
        //       message: "Age must be a number",
        //     });
        //   }

        //   return errs;
        // },
      });
      const cleanData = results.data.filter((row) => {
        return Object.values(row).some(
          (value) => value !== null && value !== undefined && value.toString().trim() !== ""
        );
      });

      console.log(cleanData)
      setData(cleanData);
      setErrors(results.errors);

    } catch (err) {
      // alert(err);
      setErrors([{
        "row": "",
        "field": "",
        "message": err
      }])
      console.log(err)
    }

    setLoading(false);
  };



  const uploadData = async () => {
    setCompleted(false)
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const uploadDataNow = await axios.post(serverURL + "/csvUploader/upload", data[i])
        if (uploadDataNow.status === 200) {
          console.log(uploadDataNow.data)
        } else {
          console.log(uploadDataNow.data)
        }
        setProgress(i + 1)
      }
      setCompleted(true)
      setProgress(null)
    } else {
      console.log("No data to process")
    }
  }

  const migrateERPData = async () => {
    setCompleted(false)
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const migrateDataNow = await axios.post(serverURL + "/csvUploader/migrateERPData", data[i])
        if (migrateDataNow.status === 200) {
          console.log(migrateDataNow.data)
        } else {
          console.log(migrateDataNow.data)
        }
        setProgress(i + 1)
      }
      setCompleted(true)
      setProgress(null)
    } else {
      console.log("No data to process")
    }

  }


  return (
    <>
      <div className='d-flex flex-column'>
        <div className='alert alert-light d-flex justify-content-end'>
          <button className='btn btn-sm btn-success rounded-pill px-4 fw-bold d-flex align-items-center gap-1' onClick={() => { setShowCSVIUploader(true); }}>
            <i className='fa fa-plus'></i>
            Upload
          </button>
        </div>
        <table className='table table-hover table-yesgermany'>
          <thead>
            <tr>
              <th width="1%" className='text-center'>#{baches.length}</th>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Stats</th>
              <th>Name</th>
              <th>File Name</th>
              <th>Time Started</th>
              <th>Time Finished</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {
              baches && baches.length > 0 ? (
                baches.map((data, key) => {
                  return (
                    <tr key={key}>
                      <td className='text-center'>{key + 1}</td>

                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(data.uid)}
                          onChange={() => handleCheckboxChange(data.uid)}
                        />
                      </td>
                      <td></td>
                      <td>{data?.name}</td>
                      <td>{data?.file_name}</td>
                      <td>{data?.time_started}</td>
                      <td>{data?.time_finished}</td>
                      <td></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={"100%"} className='text-center'>No Process</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      <Modal
        show={showCSVIUploader}
        onHide={() => { setShowCSVIUploader(false); setErrors([]); setCompleted(false); setData([]); setProgress(null); }}
        centered
        size="lg"
      >
        {/* 🔥 Header */}
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">
            📂 Upload CSV File
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>


          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Upload Leads from CSV">
              {/* 📁 Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded text-center mb-4"
                style={{
                  background: "#f8f9fa",
                  borderStyle: "dashed",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="form-control"
                />
                <p className="text-muted mt-2 mb-0">
                  Upload your CSV file (any format supported)
                </p>
              </motion.div>

              {
                !completed &&
                <Button
                  variant="primary"
                  disabled={data.length === 0 || completed || progress > 0 || errors.length > 0}
                  onClick={() => { uploadData() }}
                >
                  {
                    progress > 0 ?
                      <CustomSpinner size={0.5} />
                      :
                      "Start Upload"
                  }
                </Button>
              }
            </Tab>
            <Tab eventKey="profile" title="Migrade Data from CSV">
              {/* 📁 Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded text-center mb-4"
                style={{
                  background: "#f8f9fa",
                  borderStyle: "dashed",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChangeForDataMigrate}
                  className="form-control"
                />
                <p className="text-muted mt-2 mb-0">
                  Upload your CSV file (any format supported)
                </p>
              </motion.div>

              {
                !completed &&
                <Button
                  variant="primary"
                  disabled={data.length === 0 || completed || progress > 0}
                  onClick={() => { migrateERPData() }}
                >
                  {
                    progress > 0 ?
                      <CustomSpinner size={0.5} />
                      :
                      "Start Migration"
                  }
                </Button>
              }
            </Tab>
          </Tabs>




          {/* ⏳ Loading */}
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" />
              <p className="mt-2 text-muted">Processing file...</p>
            </div>
          )}

          {/* ✅ Data Table */}
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ maxHeight: "300px", overflow: "auto" }}
              className="mb-4"
            >
              <h5 className="mb-3 fw-semibold">📊 Preview Data</h5>

              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    {columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col, j) => (
                        <td key={j}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {/* ❌ Errors */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h5 className="text-danger fw-semibold">⚠ Errors Found</h5>

              <Table bordered responsive size="sm">
                <thead className="table-danger">
                  <tr>
                    <th>Row</th>
                    <th>Field</th>
                    <th>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {errors?.map((err, i) => (
                    <tr key={i}>
                      <td>{err.row}</td>
                      <td>{err.field}</td>
                      <td>{err.message}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {
            data?.length > 0 && progress ?
              <>
                <Progress
                  percent={((progress / data.length) * 100).toFixed(2)}
                  strokeColor={{ from: '#108ee9', to: '#87d068' }}
                  percentPosition={{ align: 'center', type: 'inner' }}
                  size={["100%", 20]}
                  status={progress < 100 ? "active" : "success"}
                />

              </>
              :
              ""
          }

        </Modal.Body>

        {/* 🔥 Footer */}
        <Modal.Footer className="border-0">
          {
            !completed ?
              <Button variant="secondary" onClick={() => { setShowCSVIUploader(false); setErrors([]); setCompleted(false); setData([]); setProgress(null); }}>

                Cancel
              </Button>
              :
              <Button variant="success" onClick={() => { setShowCSVIUploader(false); setErrors([]); setCompleted(false); setData([]); setProgress(null); }}>

                Done
              </Button>
          }
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DataUploader