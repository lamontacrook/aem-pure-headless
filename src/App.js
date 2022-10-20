import React from 'react';
import './App.css';
import Navigation from './components/navigation';
import Screen from './components/screen';

function App() {
  return (
    <div className="App">
      <nav>
        <Navigation />
      </nav>
      
      <Screen />

    </div>
  );
}

export default App;
