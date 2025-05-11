import { Link, useLocation } from "react-router-dom";
import './styles.css';
import { useState } from "react";
export default function NavBar(){
    const location = useLocation();
    const [isMobileBarOpen,setIsMobileBarOpen]=useState(false);
    return(
        <>
            <div className="navbarmain">
                <div className="flex flex-[0.2] border-b border-b-black logo"><img src="/images/Screenshot 2025-05-03 132116.png" className="h-[50px] min-w-[40px]" alt="" />FinScope</div>
                <div className="flex-[0.1] border-b border-b-black"></div>
                <div className="navbarComponent" >
                    <div><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></div>
                    <div><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></div>
                    <div><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></div>
                    <div><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></div>
                    {/* <div><Link className={`navBarComponentOptions ${location.pathname==='/contactUs'?"highlightedOptionColor":""}`} to={'/contactUs'}>ContactUs</Link></div> */}
                </div>
            </div>
            <div className="mobile-navbar-container">
                <img src="/images/Screenshot 2025-05-03 132116.png" className="w-[50px] max-w-[50px] min-w-[45px]" alt="" />
                {!isMobileBarOpen?
                <svg onClick={()=>setIsMobileBarOpen(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
                :
                <svg onClick={()=>setIsMobileBarOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                }   
            </div>
            <div className={`mobile-navbar-sidebar ${isMobileBarOpen?"active":"notActive"}`}>
                <h1 className="text-4xl font-bold">FinScope</h1>
                <div><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></div>
                <div><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></div>
                <div><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></div>
                <div><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></div>
            </div>
        </>
    )
}