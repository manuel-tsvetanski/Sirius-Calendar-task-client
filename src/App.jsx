import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DentalCalendar from './components/DentalCalendar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DentalCalendar />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
