import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import './index.css'

import Home from './home.jsx'
import Layout from "./Layout.jsx"
import About from "./about.jsx"



const router = createBrowserRouter(createRoutesFromElements(

<Route element={<Layout />}>
  <Route path="/" element={<Home />}/>
  <Route path="/about" element={<About />}/>
</Route>

))

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}





