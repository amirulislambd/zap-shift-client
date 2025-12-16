// src/main.jsx
import "slick-carousel/slick/slick.css";         // <-- Add at very top
import "slick-carousel/slick/slick-theme.css";   // <-- Add at very top
import "aos/dist/aos.css";                        // your AOS CSS
import "./index.css";                              // your custom CSS


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router.jsx";
import "aos/dist/aos.css";
import Aos from "aos";
import AuthProvider from "./Context/AuthContext/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

Aos.init();

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
