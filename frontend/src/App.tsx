import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import AboutUs from "./pages/aboutUs";
import ContactUs from "./pages/contactUs";
import FraudDetPage from "./pages/fraudDetPage";
import ChatBotPage from "./pages/chatBotPage";
import ExpLrPage from "./pages/expLrPage";
import RealTimeOptPage from "./pages/realTimeOptPage";
import PersoSuggPage from "./pages/persoSuggPage";
import RiskAssmtPage from "./pages/riskAssmtPage";
import IntTermPredPage from "./pages/intTermPredPage";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/aboutUs" element={<AboutUs/>}/>
        <Route path="/contactUs" element={<ContactUs/>} />
        <Route path='/dashboard/ITP' element={<IntTermPredPage/>}/>
        <Route path='/dashboard/RA' element={<RiskAssmtPage/>}/>
        <Route path='/dashboard/PS' element={<PersoSuggPage/>}/>
        <Route path='/dashboard/RTO' element={<RealTimeOptPage/>}/>
        <Route path='/dashboard/ELR' element={<ExpLrPage/>}/>
        <Route path='/dashboard/CA' element={<ChatBotPage/>}/>
        <Route path='/dashboard/FD' element={<FraudDetPage/>}/>
      </Routes>
    </>
  )
}