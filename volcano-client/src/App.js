import './App.css';
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Components/Home'
import SingleVolcano from './Components/SingleVolcano';
import CountryVolcanoes from './Components/CountryVolcanoes'
import Register from './Components/Register'
import Login from './Components/Login'
import { Container } from '@mui/material';
import './App.css';
import Navigation from './Components/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

// Create AppContext to prioritize Login state in nav bar
export const AppContent = React.createContext({
  isLoggedIn: false
});

// Get token state and parse into nav bar
export default function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  return (
    <AppContent.Provider value={{isLoggedIn}}>
    <div className='App'>
      <Router>
        <Navigation setIsLoggedIn={setIsLoggedIn}/> 
        <Container maxWidth='md'>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path = "/volcanolist/:id" element={<SingleVolcano/>} />
            <Route path = "/volcanolist/" element={<CountryVolcanoes/>} />
            <Route path = "/register" element={<Register/>} />
            <Route path = "/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          </Routes>
          </Container>
          </Router>

    </div>
    </AppContent.Provider>
  );
}

