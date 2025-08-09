import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    // Redirect to our HTML-based gallery
    window.location.href = "/index.html";
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          🌊 Redirecting to IbizaGirl.pics Ocean Paradise...
        </p>
      </header>
    </div>
  );
}

export default App;
