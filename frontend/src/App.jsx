import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import RecapPage from './components/RecapPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/recap/:id" element={<RecapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
