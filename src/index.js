import React from "react";
import ReactDOM from "react-dom";
import MyDiagram from "./MyDiagram";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <MyDiagram />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
