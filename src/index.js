import React from "react";
import ReactDOM from "react-dom/client";
import ChecklistApp from "components/ChecklistApp";
import "styles/app.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(<ChecklistApp/>);

serviceWorkerRegistration.register();