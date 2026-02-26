import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-1Y337DKQ72"; 
ReactGA.initialize(TRACKING_ID);

createRoot(document.getElementById("root")!).render(<App />);