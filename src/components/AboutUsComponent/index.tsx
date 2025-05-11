import './style.css';
export default function AboutUsComponent(){
    return(
        <div className="main-container">
                <div className="main-container-first">
                    <h1 className="text-6xl">About us</h1>
                    <p className='pt-5 text-xl'>We're a team of AI enthusiasts, finance experts, and developers who came together to build a smarter solution to one of the most important financial decisions-loans.Whether you're a customer seeking clarity or a bank striving for efficiency, FinScope makes lending smarter and simpler.</p>
                    <button type='button' className='explore-button'>Explore</button>
                </div>
                <div className="main-container-second">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className="main-container-third">
                    <h1 className='text-4xl'>Partners</h1>
                </div>
        </div>
    )
}