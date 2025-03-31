import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react'
import Home  from '../pages/Home/Home'
import AboutUs  from '../pages/AboutUs/AboutUs'
import ContactUs  from '../pages/ContactUs/ContactUs'
import Faq  from '../pages/FAQ/Faq'
import JobBoard  from '../pages/JobBoard/JobBoard'
import OurServices  from '../pages/OurServices/OurServices'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/our-services" element={<OurServices />} />
      </Routes>
    </BrowserRouter>
  )
}
