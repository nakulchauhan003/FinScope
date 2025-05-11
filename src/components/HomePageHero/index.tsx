import { Link } from 'react-router-dom';
import { Demo } from '../LogoSymbol/demo';
import './index-style.css';
import { useRef } from 'react';
export default function HomePageHero(){
    const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction:number):void => {
    if (scrollRef.current) {
        const scrollAmount = 220; // card width + gap
        scrollRef.current.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });
      }
  };
    return (
        <>
        <div className="homeHeroContainer relative z-10">
            <h1 className="text-[4rem] font-bold">Welcome To FinScope</h1>
            <p className="text-[4rem]">See Risk. Simulate. Decide Smarter.</p>
            <div className="scroll-wrapper">
                <button className="scroll-btn left" onClick={() => scroll(-1)}>←</button>
                <div className="scroll-container" ref={scrollRef}>
                        <div className="card">Interest & Term Predection</div>
                        <div className="card">Risk Assesment</div>
                        <div className="card">Explainable AI</div>
                        <div className="card">Fraud Detection</div>
                        <div className='card'>Personalized Suggestion</div>
                 </div>
                <button className="scroll-btn right" onClick={() => scroll(1)}>→</button>
            </div>
        </div>

        <Link to={'/dashboard/CA'}>
            <div className='AiLogoBottomRight'>
                <Demo/>
            </div>
        </Link>
        </>
    )
}