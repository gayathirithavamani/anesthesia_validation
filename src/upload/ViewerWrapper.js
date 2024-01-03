import * as React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ViewerWrapper = ({ fileUrl, pageNumber }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
      <div
        style={{
          height: "71vh",
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
          initialPage={pageNumber}
        />
      </div>
    </Worker>

    //   <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />;
  );
};

export default ViewerWrapper;
