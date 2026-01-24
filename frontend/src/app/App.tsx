import React from "react";
import { Providers } from "./providers";
import { AppRoutes } from "./routes";

function App() {
  return (
    <Providers>
      <div className="App">
        <AppRoutes />
      </div>
    </Providers>
  );
}

export default App;
