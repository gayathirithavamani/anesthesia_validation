import * as React from "react";
import ViewerWrapper from "./ViewerWrapper";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

const MultipleViewersSamePageExample = ({ fileID, pageNumber }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
 
  const fileUrl = `https://anesthesia.encipherhealth.com/api/v1/file/${fileID}#page=${pageNumber}`;
  return (
    <div>
      <ViewerWrapper
        fileUrl={fileUrl}
        plugins={[defaultLayoutPluginInstance]}
        // initialPage={pageNumber}
        pageNumber={pageNumber}
      />
      {/* <ViewerWrapper fileUrl={fileUrl} /> */}
    </div>
  );
};

export default MultipleViewersSamePageExample;

// import React from "react";

// import {
//   pageNavigationPlugin,
//   RenderGoToPageProps,
// } from "@react-pdf-viewer/page-navigation";
// import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// const CustomizeNavigationButtonsExample = ({ fileID, pageNumber }) => {
//   const fileUrl =
//      `https://anesthesia.encipherhealth.com/api/v1/file/${fileID}#page=${pageNumber}`

//   //   `${apiUrl}#page=${pageNumber}`
//   const pageNavigationPluginInstance = pageNavigationPlugin();
//   const { GoToFirstPage, GoToLastPage, GoToNextPage, GoToPreviousPage } =
//     pageNavigationPluginInstance;
//   const defaultLayoutPluginInstance = defaultLayoutPlugin();
//   return (
//     <div
//       style={{
//         border: "1px solid rgba(0, 0, 0, 0.3)",
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//       }}
//     >
//       <div
//         style={{
//           alignItems: "center",
//           backgroundColor: "#eeeeee",
//           borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
//           display: "flex",
//           justifyContent: "center",
//           padding: "4px",
//           position: "sticky",
//           top: "0",
//           zIndex: "100",
//         }}
//       >
//         {/* <div style={{ padding: "0 2px" }}>
//           <GoToFirstPage>
//             {(props) => (
//               <button
//                 style={{
//                   backgroundColor: "#357edd",
//                   border: "none",
//                   borderRadius: "4px",
//                   color: "#ffffff",
//                   cursor: "pointer",
//                   padding: "8px",
//                 }}
//                 onClick={props.onClick}
//               >
//                 First page
//               </button>
//             )}
//           </GoToFirstPage>
//         </div>
//         <div style={{ padding: "0 2px" }}>
//           <GoToPreviousPage>
//             {(props) => (
//               <button
//                 style={{
//                   backgroundColor: props.isDisabled ? "#96ccff" : "#357edd",
//                   border: "none",
//                   borderRadius: "4px",
//                   color: "#ffffff",
//                   cursor: props.isDisabled ? "not-allowed" : "pointer",
//                   padding: "8px",
//                 }}
//                 disabled={props.isDisabled}
//                 onClick={props.onClick}
//               >
//                 Previous page
//               </button>
//             )}
//           </GoToPreviousPage>
//         </div>
//         <div style={{ padding: "0 2px" }}>
//           <GoToNextPage>
//             {(props) => (
//               <button
//                 style={{
//                   backgroundColor: props.isDisabled ? "#96ccff" : "#357edd",
//                   border: "none",
//                   borderRadius: "4px",
//                   color: "#ffffff",
//                   cursor: props.isDisabled ? "not-allowed" : "pointer",
//                   padding: "8px",
//                 }}
//                 disabled={props.isDisabled}
//                 onClick={props.onClick}
//               >
//                 Next page
//               </button>
//             )}
//           </GoToNextPage>
//         </div>
//         <div style={{ padding: "0 2px" }}>
//           <GoToLastPage>
//             {(props) => (
//               <button
//                 style={{
//                   backgroundColor: "#357edd",
//                   border: "none",
//                   borderRadius: "4px",
//                   color: "#ffffff",
//                   cursor: "pointer",
//                   padding: "8px",
//                 }}
//                 onClick={props.onClick}
//               >
//                 Last page
//               </button>
//             )}
//           </GoToLastPage>
//         </div> */}
//       </div>
//       <div
//         style={{
//           flex: 1,
//           overflow: "hidden",
//         }}
//       >
//         {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
//           <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} />
//         </Worker> */}
//         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
//           <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />;
//         </Worker>
//       </div>
//     </div>
//   );
// };

// export default CustomizeNavigationButtonsExample;
