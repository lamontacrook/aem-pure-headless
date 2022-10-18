import React from 'react';
import './App.css';
import Navigation from './components/navigation';
import Teaser from './components/teaser';

function App() {
  return (
    <div className="App">
      <nav>
        <Navigation />
      </nav>
      <header className="home-hero" role="banner">
        <Teaser />
      </header>
    </div>
  );
}

export default App;
