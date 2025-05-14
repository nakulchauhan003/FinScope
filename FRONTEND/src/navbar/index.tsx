"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import './styles.css';

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const location = useLocation();

  return (
    <>
          <ul
            className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
            onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
          >
            <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/'?"highlightedOptionColor":""}`} to={"/"}>Home</Link></Tab>
            <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/dashboard'?"highlightedOptionColor":""}`} to={"/dashboard"}>DashBoard</Link></Tab>
            <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/login'?"highlightedOptionColor":""}`} to={'/login'}>Connect</Link></Tab>
            <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/aboutUs'?"highlightedOptionColor":""}`} to={'/aboutUs'}>About Us</Link></Tab>
            {/* <Tab setPosition={setPosition}><Link className={`navBarComponentOptions ${location.pathname==='/contactUs'?"highlightedOptionColor":""}`} to={'/contactUs'}>ContactUs</Link></Tab> */}
            <Cursor position={position} />
          </ul>
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
