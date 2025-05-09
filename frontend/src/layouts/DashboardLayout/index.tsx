import DashBoardOptionBar from "../../components/DashBoardOptionBar";

type DashboardLayoutProps={
    children:React.ReactNode;
};
export default function DashboardLayout({children}:DashboardLayoutProps){
    return(
        <div className="flex h-[100vh]">
            {/* <div className="flex-[0.2]"> */}
                <DashBoardOptionBar />
            {/* </div> */}
            {/* <div className="pt-[30px]"> */}
                {children}
            {/* </div> */}
        </div>
    )
}