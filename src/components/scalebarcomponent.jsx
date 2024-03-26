import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './app.css'


export default function  scaleBarComponent() {
    return (
        <div id="scale-box" className = "scale-box" style={{visibility: scaleBarVisible  ? 'visible' : 'hidden' }}>
        <div id="scalebar" className="scalebar" > </div>
        <p id="scalebartag" className = "scalebartag">{distanceScaleText}</p>
      </div>

)
}