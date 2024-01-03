import React from "react";
import UploadFile from "./upload/upload";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      {/* <UploadFile /> */}
      <Router>
        <Routes>
          <Route exact path="/" element={<UploadFile />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
