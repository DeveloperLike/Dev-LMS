// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App';
// // import './css/style.css';
// // import './css/satoshi.css';
// import '../src/assets/css/style.css';
// import '../src/assets/css/satoshi.css';
// import 'jsvectormap/dist/css/jsvectormap.css';
// import 'flatpickr/dist/flatpickr.min.css';
// import Store from './lib/redux/Store';
// import { Provider } from 'react-redux';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//     <Provider store={Store}>
//       <Router>
//         <App />
//       </Router>
//     </Provider>
//   // </React.StrictMode>
// );
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider, theme } from "antd";

import App from "./App";

// CSS
import "../src/assets/css/style.css";
import "../src/assets/css/satoshi.css";
// import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";

// Redux
import Store from "./lib/redux/Store";
import { Provider } from "react-redux";

const { defaultAlgorithm, darkAlgorithm } = theme;

function Root() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Provider store={Store}>
        <Router>
          {/* Pass dark mode to App */}
          <App darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
      </Provider>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Root />
);
