import { useEffect, useState } from "react"

const useAuth=()=>{
    const [isLoggedIn,setIsLoggedIn]=useState(()=>!!localStorage.getItem('token'));
    useEffect(() => {
        const handleStorageChange = () => {
          setIsLoggedIn(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
          window.removeEventListener("storage", handleStorageChange);
        };
      }, []);
    return {isLoggedIn};
}
export default useAuth;
