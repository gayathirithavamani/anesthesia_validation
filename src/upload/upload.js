import { Button, Input, Modal, Progress } from "antd";
import "../App.css";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import image from "../photos/pic.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CustomizeNavigationButtonsExample from "./PdfViewFile";
import MultipleViewersSamePageExample from "./PdfViewFile";

function UploadFile() {
  const [fileInfoList, setFileInfoList] = useState([]);
  const [file, setFile] = useState(null);
  const [fileID, setFileID] = useState(null);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortOrder1, setSortOrder1] = useState("asc");
  const [editIndex, setEditIndex] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [openPDF, setOpenPDF] = useState(false);
  const [pageNum, setPageNum] = useState();
  const [editedRows, setEditedRows] = useState([]);
  const [selectRowData, setSelectRowData] = useState();

  const [editMode, setEditMode] = useState(false);
  const [editedValuesRow, setEditedValuesRow] = useState();
  const handleEditClickRow = () => {
    // setEditMode(true);
    setEditMode(true);

    const existingDiagnosis = selectRowData?.diagnosis || [];

    setEditedValuesRow({
      patientName: selectRowData?.patientName || "",
      patientId: selectRowData?.patientId || "",
      fileId: selectRowData?.fileId || "",

      pageNo: selectRowData?.pageNo || "",
      dateOfService: selectRowData?.dateOfService || "",
      anesthesiologistData: [
        {
          supervisorName:
            selectRowData?.anesthesiologistData?.[0]?.supervisorName || null,
          crnaName: selectRowData?.anesthesiologistData?.[0]?.crnaName || null,
        },
      ],

      startTime: selectRowData?.startTime || "",
      endTime: selectRowData?.endTime || "",
      timeUnit: selectRowData?.timeUnit || "",
      timeInMinutes: selectRowData?.timeInMinutes || "",
      anesthesiaType: selectRowData?.anesthesiaType || "",
      physicalModifier: selectRowData?.physicalModifier || "",
      qs: selectRowData?.qs || "",
      asaCode: selectRowData?.asaCode || "",

      diagnosis: [...existingDiagnosis],
    });
  };
  const handleEditChangeRow = (field, value, index) => {
    setEditedValuesRow((prevValues) => {
      // Ensure that diagnosis is initialized as an array
      const prevDiagnosis = prevValues.diagnosis || [];

      if (field.startsWith("diagnosis")) {
        const updatedDiagnosis = [...prevDiagnosis];
        updatedDiagnosis[index] = value;

        return {
          ...prevValues,
          [field]: value,
          diagnosis: updatedDiagnosis,
        };
      } else if (field === "supervisorName" || field === "crnaName") {
        const updatedAnesthesiologistData =
          prevValues.anesthesiologistData?.map((item) => {
            if (field === "supervisorName") {
              return { ...item, supervisorName: value };
            } else if (field === "crnaName") {
              return { ...item, crnaName: value };
            }
            return item;
          });

        return {
          ...prevValues,
          // [field]: value,
          anesthesiologistData: updatedAnesthesiologistData,
        };
      } else {
        return {
          ...prevValues,
          [field]: value,
        };
      }
    });
  };

  const handleSaveClickRow = async () => {
    const updatedData = [...editedRows];
    updatedData[editMode] = {
      ...updatedData[editMode],
      ...editedValuesRow,
    };

    setEditedRows(updatedData);

    try {
      const response = await fetch(
        "https://anesthesia.encipherhealth.com/api/v1/patient-record/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData[editMode]),
        }
      );
      if (response.ok) {
        setSelectRowData(editedValuesRow);
        setEditMode(null);
      } else {
        console.error("Error saving data:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const openPdfViewer = (pageNumber) => {
    const apiUrl = `https://anesthesia.encipherhealth.com/api/v1/file/${fileID}`;

    setPageNum(pageNumber);
    setOpenPDF(true);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const existingDiagnosis = data[index]?.diagnosis || [];
    setEditedValues({
      patientName: data[index]?.patientName || "",
      pageNo: data[index]?.pageNo || "",
      dateOfService: data[index]?.dateOfService || "",
      anesthesiologistData: [
        {
          supervisorName:
            data[index]?.anesthesiologistData?.[0]?.supervisorName || null,
          crnaName: data[index]?.anesthesiologistData?.[0]?.crnaName || null,
        },
      ],

      startTime: data[index]?.startTime || "",
      endTime: data[index]?.endTime || "",
      timeUnit: data[index]?.timeUnit || "",
      timeInMinutes: data[index]?.timeInMinutes || "",
      anesthesiaType: data[index]?.anesthesiaType || "",
      physicalModifier: data[index]?.physicalModifier || "",
      qs: data[index]?.qs || "",
      asaCode: data[index]?.asaCode || "",

      diagnosis: [...existingDiagnosis],
    });
  };

  const handleEditChange = (field, value, index) => {
    setEditedValues((prevValues) => {
      // Ensure that diagnosis is initialized as an array
      const prevDiagnosis = prevValues.diagnosis || [];

      if (field.startsWith("diagnosis")) {
        const updatedDiagnosis = [...prevDiagnosis];
        updatedDiagnosis[index] = value;

        return {
          ...prevValues,
          [field]: value,
          diagnosis: updatedDiagnosis,
        };
      } else if (field === "supervisorName" || field === "crnaName") {
        const updatedAnesthesiologistData =
          prevValues.anesthesiologistData?.map((item) => {
            if (field === "supervisorName") {
              return { ...item, supervisorName: value };
            } else if (field === "crnaName") {
              return { ...item, crnaName: value };
            }
            return item;
          });

        return {
          ...prevValues,
          [field]: value,
          anesthesiologistData: updatedAnesthesiologistData,
        };
      } else {
        return {
          ...prevValues,
          [field]: value,
        };
      }
    });
  };

  const handleSaveClick = async () => {
    const updatedData = [...data];
    updatedData[editIndex] = {
      ...updatedData[editIndex],
      ...editedValues,
    };
    setData(updatedData);
    // api call using fetch and have tp pass the editedValues in body
    const res = await axios.put(
      `https://anesthesia.encipherhealth.com/api/v1/patient-record/update`,
      updatedData[editIndex]
    );

    setEditIndex(null);

    // setEditedValues({});
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    //upload api
    try {
      const formData = new FormData();
      formData.append("file", file);
      setProgress(1);
      const response = await axios.post(
        "https://anesthesia.encipherhealth.com/api/v1/fileUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data == "File uploaded successfully ") {
        setProgress(100);
        fetchFileList();
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  useEffect(() => {
    //progress bar function
    if (progress > 0) {
      const intervalId = setInterval(() => {
        if (progress >= 99) {
          clearInterval(intervalId); // Clear the interval when progress reaches 99
        } else {
          setProgress(progress + 1);
        }
      }, 500);

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [progress]);

  //list show api
  const fetchFileList = async () => {
    try {
      const response = await fetch(
        "https://anesthesia.encipherhealth.com/api/v1/files"
      );

      const data = await response.json();

      setFileInfoList(data);
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };
  //download api
  const handleDownload = async (fileId) => {
    const res = await axios
      .get(
        `https://anesthesia.encipherhealth.com/api/v1/patient-record/download/${fileId}`
      )
      .then((res) => res.data);
    const link = document.createElement("a");
    link.href = res.downloadUrl;
    link.setAttribute("download", "downloaded_excel.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchFileList();
    fetchDataTable();
  }, [data]);
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000);
    }
  }, [progress]);
  //tables view api
  // useEffect(() => {
  //   fetch(`https://anesthesia.encipherhealth.com/api/v1/anesthesia/${fileID}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData(data);
  //     });
  // }, [fileID]);
  const fetchDataTable = async () => {
    try {
      const response = await fetch(
        `https://anesthesia.encipherhealth.com/api/v1/anesthesia/${fileID}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // sort by order
  const sortTableByAsc = async () => {
    try {
      const response = await axios.get(
        `https://anesthesia.encipherhealth.com/api/v1/patient-record/sort/${fileID}`,
        {
          params: {
            sortBy: "pageNo",
            order: sortOrder === "asc" ? "desc" : "asc",
          },
        }
      );
      setData(response.data); // Assuming your API returns the sorted data
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } catch (error) {
      console.error("Error fetching sorted data:", error);
    }
  };
  const sortTableByAsc1 = async () => {
    try {
      const response = await axios.get(
        `https://anesthesia.encipherhealth.com/api/v1/patient-record/sort/${fileID}`,
        {
          params: {
            sortBy: "qs",
            order: sortOrder1 === "asc" ? "desc" : "asc",
          },
        }
      );
      setData(response.data); // Assuming your API returns the sorted data
      setSortOrder1(sortOrder1 === "asc" ? "desc" : "asc");
    } catch (error) {
      console.error("Error fetching sorted data:", error);
    }
  };
  console.log(editedValues, "table");

  return (
    <div className="two-column-container">
      <div
        style={{
          display: "flex",

          width: "90%",
          margin: "auto",
          height: "36px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "start",
            alignItems: "start",

            cursor: "pointer",
            height: "100%",
          }}
        >
          <Button style={{ marginTop: "10px" }} onClick={openPdfViewer}>
            PDF view
          </Button>
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
            cursor: "pointer",
            height: "100%",
            marginLeft: "102px",
          }}
        >
          <h4>Anesthesia Validator</h4>
        </div>
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "end",
            marginLeft: "128px",
            marginTop: "10px",
          }}
        >
          <div style={{ marginTop: "-6px", marginRight: "4px" }}>
            {/* <img
              src="/src/pic.png"
              alt="Girl in a jacket"
              className="picture"
            /> */}
            <img src={image} alt="Avatar" />
          </div>
          <div>
            {" "}
            <Button>Logout</Button>
          </div>
        </div>
      </div>
      <div className="column1">
        <div style={{ marginTop: "4px" }}>
          <div>
            <h5>UPLOAD PDF</h5>
          </div>
          <div className="upload-container">
            <form action="/action_page.php" style={{ height: "36px" }}>
              <input
                type="file"
                id="myFile"
                name="filename"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <button
                type="button"
                className="btn btn-outline-success py-1 px-3"
                height="90px"
                onClick={handleUpload}
              >
                Submit
              </button>
            </form>
            {progress > 0 && (
              <Progress
                percent={progress}
                status="active"
                style={{ marginTop: "9px", height: "20px" }}
                // strokeWidth={18}
              />
            )}
          </div>
        </div>

        <div style={{ marginTop: "100px" }}>
          <div
            className="dataList"
            class="btn-group"
            role="group"
            aria-label="Basic example"
            style={{ marginBottom: "34px" }}
          >
            <ul style={{ listStyle: "none", padding: "0" }}>
              <li key={1}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "250px", margin: "2px" }}
                  onClick={() =>
                    setFileID(fileInfoList[fileInfoList.length - 1]?.fileId)
                  }
                >
                  {fileInfoList[fileInfoList.length - 1]?.originalFileName}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ margin: "1px" }}
                  onClick={() =>
                    handleDownload(
                      fileInfoList[fileInfoList.length - 1]?.fileId
                    )
                  }
                >
                  <DownloadOutlined />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="column2">
        <div>
          <div class="custom-table">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>SI.No</th>
                  <th>Patient Name</th>

                  <th onClick={sortTableByAsc}>
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        height: "50px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Page No{" "}
                      {sortOrder === "asc" ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )}
                    </div>
                  </th>
                  <th>Date of Service</th>
                  <th>Anesthesiologist</th>
                  <th>CRNA</th>
                  <th>start time </th>
                  <th> End Time </th>
                  <th>Time Unit</th>
                  <th>Total time in Minutes</th>
                  <th>Anesthesia Type</th>
                  <th>Physical Modifier </th>

                  <th onClick={sortTableByAsc1}>
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        height: "50px",
                        alignItems: "center",
                      }}
                    >
                      Modifier{" "}
                      {sortOrder1 === "asc" ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )}
                    </div>
                  </th>

                  <th>ASA Code </th>
                  <th style={{ backgroundColor: "#5a6268" }}>Diagnosis1</th>
                  <th style={{ backgroundColor: "#5a6268" }}>Diagnosis2</th>
                  <th style={{ backgroundColor: "#5a6268" }}>Diagnosis3</th>
                  <th style={{ backgroundColor: "#5a6268" }}>Diagnosis4</th>
                  <th>Edit</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 &&
                  data?.map((item, index) => {
                    return (
                      <tr key={item.id} onClick={() => setSelectRowData(item)}>
                        <td>{index + 1}</td>

                        <td>
                          {editIndex === index ? (
                            <input
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              type="text"
                              value={editedValues.patientName}
                              onChange={(e) =>
                                handleEditChange("patientName", e.target.value)
                              }
                            />
                          ) : (
                            item?.patientName
                          )}
                        </td>

                        <td
                          onClick={() => {
                            if (editIndex !== index) {
                              openPdfViewer(item.pageNo - 1);
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.pageNo}
                              onChange={(e) =>
                                handleEditChange("pageNo", e.target.value)
                              }
                            />
                          ) : (
                            item?.pageNo
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="date"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues?.dateOfService}
                              onChange={(e) =>
                                handleEditChange(
                                  "dateOfService",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item?.dateOfService
                          )}
                        </td>

                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={
                                editedValues?.anesthesiologistData?.[0]
                                  ?.supervisorName
                              }
                              onChange={(e) =>
                                handleEditChange(
                                  "supervisorName",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <>
                              {item?.anesthesiologistData?.[0]
                                ?.supervisorName || "-"}
                            </>
                          )}
                        </td>

                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={
                                editedValues?.anesthesiologistData?.[0]
                                  ?.crnaName
                              }
                              onChange={(e) =>
                                handleEditChange("crnaName", e.target.value)
                              }
                            />
                          ) : (
                            item?.anesthesiologistData?.[0]?.crnaName || "-"
                          )}
                        </td>

                        <td>
                          {editIndex === index ? (
                            <input
                              type="time"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.startTime}
                              onChange={(e) =>
                                handleEditChange("startTime", e.target.value)
                              }
                            />
                          ) : (
                            item?.startTime
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="time"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.endTime}
                              onChange={(e) =>
                                handleEditChange("endTime ", e.target.value)
                              }
                            />
                          ) : (
                            item?.endTime
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="time"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.timeUnit}
                              onChange={(e) =>
                                handleEditChange("timeUnit", e.target.value)
                              }
                            />
                          ) : (
                            item?.timeUnit
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="number"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.timeInMinutes}
                              onChange={(e) =>
                                handleEditChange(
                                  "timeInMinutes",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item?.timeInMinutes
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.anesthesiaType}
                              onChange={(e) =>
                                handleEditChange(
                                  "anesthesiaType",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item?.anesthesiaType
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.physicalModifier}
                              onChange={(e) =>
                                handleEditChange(
                                  "physicalModifier",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item?.physicalModifier
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.qs}
                              onChange={(e) =>
                                handleEditChange("qs", e.target.value)
                              }
                            />
                          ) : (
                            item?.qs
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.asaCode}
                              onChange={(e) =>
                                handleEditChange("asaCode", e.target.value)
                              }
                            />
                          ) : (
                            item?.asaCode
                          )}
                        </td>

                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.diagnosis[0]}
                              onChange={(e) =>
                                handleEditChange("diagnosis", e.target.value, 0)
                              }
                            />
                          ) : (
                            item?.diagnosis[0] || null
                          )}
                        </td>

                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.diagnosis[1]}
                              onChange={(e) =>
                                handleEditChange("diagnosis", e.target.value, 1)
                              }
                            />
                          ) : (
                            item?.diagnosis[1] || null
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.diagnosis[2]}
                              onChange={(e) =>
                                handleEditChange("diagnosis", e.target.value, 2)
                              }
                            />
                          ) : (
                            item?.diagnosis[2] || null
                          )}
                        </td>
                        <td>
                          {editIndex === index ? (
                            <input
                              type="text"
                              className={`inputField ${
                                editIndex === index ? "edit" : ""
                              }`}
                              value={editedValues.diagnosis[3]}
                              onChange={(e) =>
                                handleEditChange("diagnosis", e.target.value, 3)
                              }
                            />
                          ) : (
                            item?.diagnosis[3] || null
                          )}
                        </td>

                        <td>
                          <div style={{ zIndex: "999" }}>
                            {editIndex === index ? (
                              <Button onClick={handleSaveClick}>Save</Button>
                            ) : (
                              <Button onClick={() => handleEditClick(index)}>
                                <EditOutlined style={{ cursor: "pointer" }} />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              {/* </div> */}
            </table>
          </div>
        </div>
      </div>

      {openPDF && (
        <Modal
          open={openPDF}
          onOk={() => setOpenPDF(false)}
          onCancel={() => setOpenPDF(false)}
          style={{ marginTop: "-50px" }}
          width="90%"
          height="auto"
        >
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "75%" }}>
              {/* Your PDF viewer component */}
              <MultipleViewersSamePageExample
                fileID={fileID}
                pageNumber={pageNum}
              />
            </div>
            <div
              style={{
                width: "25%",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#E4E7E7",
              }}
            >
              {selectRowData && (
                <div className="page-container">
                  <h4>Selected Row Data</h4>
                  <div></div>

                  <div class="values">
                    {/* <div>Patient Id</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.patientId}
                        onChange={(e) =>
                          handleEditChangeRow("patientId", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.patientId}</div>
                    )}

                    <div>Field Id</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.fileId}
                        onChange={(e) =>
                          handleEditChangeRow("fileId", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.fileId}</div>
                    )} */}

                    <div>Patient Name</div>

                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.patientName}
                        onChange={(e) =>
                          handleEditChangeRow("patientName", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.patientName}</div>
                    )}
                    {/* <div>{selectRowData.patientName}</div> */}
                    <div>Page No</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.pageNo}
                        onChange={(e) =>
                          handleEditChangeRow("pageNo", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.pageNo}</div>
                    )}
                    <div>DOS</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.dateOfService}
                        onChange={(e) =>
                          handleEditChangeRow("dateOfService", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.pageNo}</div>
                    )}
                    <div>Anesthesiologist</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={
                          editedValuesRow?.anesthesiologistData?.[0]
                            ?.supervisorName
                        }
                        onChange={(e) =>
                          handleEditChangeRow("supervisorName", e.target.value)
                        }
                      />
                    ) : (
                      <div>
                        {
                          selectRowData?.anesthesiologistData?.[0]
                            ?.supervisorName
                        }
                      </div>
                    )}
                    <div>CRNA</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={
                          editedValuesRow?.anesthesiologistData?.[0]?.crnaName
                        }
                        onChange={(e) =>
                          handleEditChangeRow("crnaName", e.target.value)
                        }
                      />
                    ) : (
                      <div>
                        {selectRowData?.anesthesiologistData?.[0]?.crnaName}
                      </div>
                    )}
                    <div>Start Time</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.startTime}
                        onChange={(e) =>
                          handleEditChangeRow("startTime", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.startTime}</div>
                    )}
                    <div>End Time</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.endTime}
                        onChange={(e) =>
                          handleEditChangeRow("endTime", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.endTime}</div>
                    )}
                    <div>Time Unit</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.timeUnit}
                        onChange={(e) =>
                          handleEditChangeRow("timeUnit", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.timeUnit}</div>
                    )}
                    <div>Total time in Minutes</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.timeInMinutes}
                        onChange={(e) =>
                          handleEditChangeRow("timeInMinutes", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.timeInMinutes}</div>
                    )}
                    <div>Anesthesia Type</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.anesthesiaType}
                        onChange={(e) =>
                          handleEditChangeRow("anesthesiaType", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.anesthesiaType}</div>
                    )}
                    <div>Physical Modifier</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.physicalModifier}
                        onChange={(e) =>
                          handleEditChangeRow(
                            "physicalModifier",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div>{selectRowData.physicalModifier}</div>
                    )}
                    <div>Modifier</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.qs}
                        onChange={(e) =>
                          handleEditChangeRow("qs", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.qs}</div>
                    )}
                    <div>ASA</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.asaCode}
                        onChange={(e) =>
                          handleEditChangeRow("asaCode", e.target.value)
                        }
                      />
                    ) : (
                      <div>{selectRowData.asaCode}</div>
                    )}
                    <div>Diagnosis 1</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow?.diagnosis[0]}
                        onChange={(e) =>
                          handleEditChangeRow("diagnosis", e.target.value, 0)
                        }
                      />
                    ) : (
                      <div>{selectRowData.diagnosis[0]}</div>
                    )}

                    <div>Diagnosis 2</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.diagnosis[1]}
                        onChange={(e) =>
                          handleEditChangeRow("diagnosis", e.target.value, 1)
                        }
                      />
                    ) : (
                      <div>{selectRowData.diagnosis[1]}</div>
                    )}

                    <div>Diagnosis 3</div>

                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.diagnosis[2]}
                        onChange={(e) =>
                          handleEditChangeRow("diagnosis", e.target.value, 2)
                        }
                      />
                    ) : (
                      <div>{selectRowData.diagnosis[2]}</div>
                    )}

                    <div>Diagnosis 4</div>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedValuesRow.diagnosis[3]}
                        onChange={(e) =>
                          handleEditChangeRow("diagnosis", e.target.value, 3)
                        }
                      />
                    ) : (
                      <div>{selectRowData.diagnosis[3]}</div>
                    )}

                    {!editMode && (
                      <Button
                        className="editButton"
                        onClick={handleEditClickRow}
                      >
                        Edit
                      </Button>
                    )}

                    {editMode && (
                      <>
                        <Button onClick={handleSaveClickRow}>Save</Button>
                        <Button onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </>
                    )}
                    {/* {editMode ? (
                      <input
                        type="text"
                        value={
                          editedValuesRow.diagnosis &&
                          editedValuesRow.diagnosis.length > 0
                            ? editedValuesRow.diagnosis[3]
                            : ""
                        }
                        onChange={(e) => {
                          setEditedValuesRow({
                            ...editedValuesRow,
                            diagnosis: [e.target.value],
                          });
                        }}
                      />
                    ) : (
                      <div>
                        {selectRowData.diagnosis &&
                        selectRowData.diagnosis.length > 0
                          ? selectRowData.diagnosis[3]
                          : "-"}
                      </div>
                    )} */}
                    {/* {!editMode && (
                      <Button
                        className="editButton"
                        onClick={handleEditClickRow}
                      >
                        Edit
                      </Button>
                    )}

                    {editMode && (
                      <>
                        <Button onClick={handleSaveClickRow}>Save</Button>
                        <Button onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Rest of your table code */}
    </div>
  );
}

export default UploadFile;
