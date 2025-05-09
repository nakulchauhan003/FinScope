import NavBar from "../../navbar";
type HomePageLayoutProps={
    children:React.ReactNode;
};
export default function HomePageLayout({children}:HomePageLayoutProps){
    return(
        <div>
            <NavBar/>
            {children}
        </div>
    )
}