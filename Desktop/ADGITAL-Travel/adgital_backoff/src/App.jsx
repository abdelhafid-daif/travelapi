import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css'
import Login from './pages/Login';
import Register from './pages/Register';
import Not from './pages/Not';
import ManagerDashboard from './pages/ManagerDashboard';
import CommercialDashboard from './pages/CommercialDashboard';
import SupportDashboard from './pages/SupportDashboard';
import ComptableDashboard from './pages/ComptableDashboard';
import CategoriePage from './pages/support/CategoriePage';
import DestinationPage from './pages/support/DestinationPage';
import OffrePage from './pages/support/OffrePage';
import DepartDetailManager from './pages/support/DepartDetailManager';
import BookingSup from './pages/support/BookingSup';
import BookingConf from './pages/comptable/BookingConf';
import BookingFact from './pages/comptable/BookingFact';
import PartenairePage from './pages/commercial/PartenairePage';
import PartenaireContrat from './pages/commercial/PartenaireContrat';
import HistoriquePaiementForm from './pages/comptable/HistoriquePaiementForm';
import BookingCharts from './pages/manager/BookingCharts';
import PartenaireStats from './pages/manager/PartenaireStats';
import FacturesStats from './pages/manager/FacturesStats';
import Staff from './pages/manager/Staff';
import HotelsCrud from './pages/commercial/HotelsCrud';
import HotelImageCrud from './pages/commercial/HotelImageCrud';
import ChambreCrud from './pages/commercial/ChambreCrud';
import ReservationsHotel from './pages/commercial/ReservationsHotel';

import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  return (
    <Router>
      <Routes>
      <Route path="" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/not" element={<Not />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/commercial" element={<CommercialDashboard />} />
      <Route path="/comptable" element={<ComptableDashboard />} />
      <Route path="/support" element={<SupportDashboard />} />

      <Route path="/cat-crud" element={<CategoriePage />} />
      <Route path="/dest-crud" element={<DestinationPage />} />
      <Route path="/of-crud" element={<OffrePage />} />
      <Route path="/of-depdet-crud" element={<DepartDetailManager />} />
      <Route path="/booking-dt" element={<BookingSup />} />


      <Route path="/part-lt" element={<PartenairePage />} />
      <Route path="/part-cntr" element={<PartenaireContrat />} />
      <Route path="/hot-crud" element={<HotelsCrud />} />
      <Route path="/hot-img" element={<HotelImageCrud />} />
      <Route path="/hot-chambre" element={<ChambreCrud/>}/>
      <Route path="/hot-reservations" element={<ReservationsHotel/>}/>


      <Route path="/book_conf" element={<BookingConf />} />
      <Route path="/book_fact" element={<BookingFact />} />
      <Route path="/ar_fact" element={<HistoriquePaiementForm />} />


      <Route path="/bock-stats" element={<BookingCharts />} />
      <Route path="/part-stats" element={<PartenaireStats />} />
      <Route path="/fact-stats" element={<FacturesStats />} />
      <Route path="/staff-stats" element={<Staff />} />
      
      

      </Routes>
    </Router>
  )
}

export default App
