import HomePageHero from "../components/HomePageHero";
import { WavesDemo } from "../components/ui/demo";
import HomePageLayout from "../layouts/HomePageLayout";

export default function Home(){
    return(
        <HomePageLayout>
            <div className="relative min-h-screen">
                <WavesDemo/>
                <HomePageHero/>
            </div>
        </HomePageLayout>
    )
}