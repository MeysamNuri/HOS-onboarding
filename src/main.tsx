import PortfolioNotice from "./core/components/PortfolioNotice";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./router";
import { BrowserRouter } from "react-router";
import { store } from "./core/constants/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./core/components/ErrorBoundary";
// import ChatbotWidget from "./core/components/onlineChatBotWidget";
import "./core/pwa/installApp";
import "@/core/assets/styles/globalStyles.scss";
import "swiper/css";
import "swiper/css/pagination";


createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <PortfolioNotice />
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
        {/* <ChatbotWidget /> */}
      </BrowserRouter>
    </Provider>
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      toasterId="default"
      toastOptions={{
        // Define default options
        className: "",
        duration: 3000,
        removeDelay: 1000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        // Default options for specific types
        success: {
          duration: 5000,
          iconTheme: {
            primary: "green",
            secondary: "black",
          },
        },
      }}
    />
  </ErrorBoundary>,
);
