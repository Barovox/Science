// @mantine styles
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/tiptap/styles.css";

import * as ReactDOM from "react-dom/client";
import App from "@/App";
import "animate.css";
import { ReduxProvider } from "./redux/Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReduxProvider>
    <App />
  </ReduxProvider>
);
