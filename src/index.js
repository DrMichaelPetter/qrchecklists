import React from "react";
import ReactDOM from "react-dom/client";
import ChecklistApp from "components/ChecklistApp";
import "styles/app.css";

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(<ChecklistApp/>);