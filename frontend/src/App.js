import React from 'react';
import './App.css';
import NamespacesList from './components/NamespacesList'; // Corrected path

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NamespacesList />
      </header>
    </div>
  );
}

export default App;
