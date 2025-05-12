import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login';
import OffreDetail from './pages/OffreDetail';
import Destinations  from './pages/Destinations';
import Offres from './pages/Offres';
import OffresParCategoriePage from './pages/OffresParCategoriePage';
import OffresParDestination from './pages/OffresParDestinationsPage';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Destinations" element={<Destinations />} />
        <Route path="/Offres" element={<Offres />} />
        <Route path="/offre/:slug" element={<OffreDetail />} />
        <Route path="/categorie/:id" element={<OffresParCategoriePage />} />
        <Route path="/destinations/:id/offres" element={<OffresParDestination />} />
        <Route path="/Hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="*" element={<Home />} />

      </Routes>
    </Router>
  )
}

export default App
