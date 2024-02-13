import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import './index.css'

import Layout from "./layout.jsx"
import About from "./about.jsx"
import Login from "./login.jsx"
import Contact from "./contact.jsx"
import Home from './home.jsx'


const router = createBrowserRouter(createRoutesFromElements(

<Route element={<Layout />}>
  <Route path="/" element={<Home />}/>
  <Route path="/login" element={<Login />}/>
  <Route path="/about" element={<About />}/>
  <Route path="/contact" element={<Contact />}/>
</Route>

))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}





