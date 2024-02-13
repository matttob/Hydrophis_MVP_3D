
import { useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import './app.css'
import Home from './home.jsx'
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export default function Login() {
    const [isLogin, setIsLogin] = useState({isLoginPaneOpen: true, isLoginPaneOpenLeft: true});
    return (

        <>
            <Home />
            <SlidingPane className =  "login-sliding-pane"
          // closeIcon={<div>Some div containing custom close icon.</div>}
            isOpen={isLogin.isLoginPaneOpen}
            title="WELCOME TO HYDROPHIS"
            from="left"
            width= "65vw"
            onRequestClose={() => setIsLogin({isLoginPaneOpen: true })}>
            <div  >LOGIN BOXES</div>
    </SlidingPane>
        
        </>
    )
}





