import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// This component helps debug routing issues
export default function RouteDebugger() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("🔍 ROUTE DEBUGGER 🔍");
    console.log("Current URL:", window.location.href);
    console.log("Path:", location.pathname);
    console.log("Search params:", location.search);
    console.log("Route params:", params);
    
    // Check for specific issues with reset password route
    if (location.pathname.includes("/reset/")) {
      console.log("🔑 Password Reset Route Detected 🔑");
      
      // Extract parameters directly from URL to verify
      const urlParts = location.pathname.split("/");
      console.log("URL parts:", urlParts);
      
      // Find the positions after "/reset/"
      const resetIndex = urlParts.findIndex(part => part === "reset");
      if (resetIndex !== -1 && resetIndex + 2 < urlParts.length) {
        const uidb64FromUrl = urlParts[resetIndex + 1];
        const tokenFromUrl = urlParts[resetIndex + 2];
        console.log("Extracted from URL - uidb64:", uidb64FromUrl);
        console.log("Extracted from URL - token:", tokenFromUrl);
        
        // Compare with route params
        console.log("Match with route params:", 
          uidb64FromUrl === params.uidb64 && tokenFromUrl === params.token);
      } else {
        console.error("❌ Reset parameters not found in URL or incorrect format!");
      }
    }
  }, [location, params]);

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "40px auto",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h1>Route Debugger</h1>
      <p>This page helps debug routing issues. Check your browser console for detailed information.</p>
      
      <h2>Route Information</h2>
      <ul>
        <li><strong>Full URL:</strong> {window.location.href}</li>
        <li><strong>Path:</strong> {location.pathname}</li>
        <li><strong>Search:</strong> {location.search || "(none)"}</li>
      </ul>
      
      <h2>Route Parameters</h2>
      <ul>
        {Object.entries(params).length > 0 ? (
          Object.entries(params).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value || "(empty)"}
            </li>
          ))
        ) : (
          <li>No route parameters found</li>
        )}
      </ul>
      
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px"
        }}
      >
        Go Back
      </button>
      
      <button 
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Go Home
      </button>
    </div>
  );
}