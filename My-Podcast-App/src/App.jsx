import React from 'react'
import Layout from './components/Layout'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './App.css'
import Home from './pages/Home'
import PodcastDetails from './pages/PodcastDetails'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/show/:id" element={<PodcastDetails />} />
        

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
