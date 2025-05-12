import { Link } from 'react-router-dom';
import { Demo } from '../LogoSymbol/demo';
import './index-style.css';
import { AnimatedTestimonialsDemo } from '../ui-cards/demo';
import { TestimonialsSectionDemo } from './demo';
export default function HomePageHero(){
    return (
        <>
        <div className="homeHeroContainer relative z-10">
            <h1 className="text-[4rem] font-bold">Welcome To FinScope</h1>
            <p className="text-[4rem]">See Risk. Simulate. Decide Smarter.</p>
            <AnimatedTestimonialsDemo/>
            <TestimonialsSectionDemo/>
        </div>
        <Link to={'/dashboard/CA'}>
            <div className='AiLogoBottomRight'>
                <Demo/>
            </div>
        </Link>
        </>
    )
}