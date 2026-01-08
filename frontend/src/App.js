import React from "react";
import { WalletProvider } from "./contexts/WalletContext.js";
import Dashboard from "./pages/Dashboard.js";
import "./App.css";

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <Dashboard />
      </div>
    </WalletProvider>
  );
}

export default App;
