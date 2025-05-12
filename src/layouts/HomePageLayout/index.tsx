import NavHeader from "../../navbar";
import NavBar from "../../navbar";
type HomePageLayoutProps={
    children:React.ReactNode;
};
export default function HomePageLayout({children}:HomePageLayoutProps){
    return(
        <div>
           <header className="justify-center items-center h-full pt-2 absolute">
            <NavHeader />
            </header>
            {children}
        </div>
    )
}