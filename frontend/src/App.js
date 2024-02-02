// frontend/src/App.js
import React from 'react';
import './App.css';
import NamespacesList from './components/NamespacesList';

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
