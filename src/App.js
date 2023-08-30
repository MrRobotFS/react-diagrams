import React from 'react';
import './App.css';
import DiagramComponent from './DiagramComponent';
import 'beautiful-react-diagrams/styles.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DiagramComponent />
      </header>
    </div>
  );
}

export default App;
