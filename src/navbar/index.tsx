// import { Link, useLocation } from "react-router-dom";
// import './styles.css';
// import { useState } from "react";
// export default function NavBar(){
//     const location = useLocation();
//     const [isMobileBarOpen,setIsMobileBarOpen]=useState(false);
//     return(
//         <>
//             <div className="navbarmain mt-1 mb-1">
//                 <div className="flex flex-[0.3] logo"><img src="/images/Screenshot 2025-05-03 132116.png" className="h-[55px] min-w-[40px] rounded-[50%] pt-2 mr-6" alt="" />FinScope</div>
//                 <div className="navbarComponent" >
//                     <div><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></div>
//                     <div><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></div>
//                     <div><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></div>
//                     <div><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></div>
//                     {/* <div><Link className={`navBarComponentOptions ${location.pathname==='/contactUs'?"highlightedOptionColor":""}`} to={'/contactUs'}>ContactUs</Link></div> */}
//                 </div>
//                 <div className="flex-[0.4]"></div>
//             </div>
            // <div className="mobile-navbar-container">
            //     <img src="/images/Screenshot 2025-05-03 132116.png" className="w-[50px] max-w-[50px] min-w-[45px] rounded-[50%]" alt="" />
            //     {!isMobileBarOpen?
            //     <svg onClick={()=>setIsMobileBarOpen(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            //         <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            //     </svg>
            //     :
            //     <svg onClick={()=>setIsMobileBarOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            //         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            //     </svg>
            //     }   
            // </div>
            // <div className={`mobile-navbar-sidebar ${isMobileBarOpen?"active":"notActive"}`}>
            //     <h1 className="text-4xl font-bold">FinScope</h1>
            //     <div><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></div>
            //     <div><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></div>
            //     <div><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></div>
            //     <div><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></div>
            // </div>
//         </>
//     )
// }

"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <>
    <div className="flex justify-between">
        <img src="/images/Screenshot 2025-05-03 132116.png" className="h-[50px] mr-[300px]" alt="" />
        <ul
          className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></Tab>
          <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></Tab>
          <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></Tab>
          <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></Tab>
          <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/contactUs'?"highlightedOptionColor":""}`} to={'/contactUs'}>ContactUs</Link></Tab>
          <Cursor position={position} />
        </ul>
    </div>
    </>
  );
}

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};

export default NavHeader;
