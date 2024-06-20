import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./index.css";
const theme = extendTheme({
  fonts: {
    body: `'Proto mono', sans-serif`,
  },
  colors: {
    crypto: "#429908",
    purple: "#6000c7",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
