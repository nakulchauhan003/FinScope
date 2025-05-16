import { useEffect } from "react";
import { clientServer } from "../../Config";

const DashBoardMainComponent:React.FC=()=>{

    useEffect(()=>{
        const response=clientServer.get('api/user/get_user_and_profile',{
            params:{
                token:localStorage.getItem("token")
            }
        })
    },[])
    interface UserInfo {
        name: string;
        username: string;
        email: string;
        role: string;
      }
      
      const user: UserInfo = {
        name: "Aditya Sharma",
        username: "aditya_01",
        email: "aditya@email.com",
        role: "Admin",
      };
      
      const features = [
        {
          icon: "🤖",
          title: "AI Chatbot",
          description: "Ask queries and get instant AI support.",
          action: "Launch",
        },
        {
          icon: "🛡",
          title: "Fraud Detection",
          description: "Scan and detect suspicious activities.",
          action: "Start Scan",
        },
        {
          icon: "📉",
          title: "Risk Prediction",
          description: "Predict risks based on your data.",
          action: "Analyze",
        },
        {
          icon: "⚙",
          title: "Real-Time Optimization",
          description: "Optimize processes with live feedback.",
          action: "Optimize",
        },
        {
          icon: "📊",
          title: "Analytics Dashboard",
          description: "View reports and data insights.",
          action: "View",
        },
        {
          icon: "🔧",
          title: "System Settings",
          description: "Customize your system preferences.",
          action: "Configure",
        },
      ];
      
    return(
        <div className="p-6 bg-gray-100 min-h-screen">
      {/* User Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user.name}!</h2>
        <p><span className="font-medium">Username:</span> {user.username}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-2">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
            <button type="button" className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
              {feature.action}
            </button>
          </div>
        ))}
      </div>
    </div>

    )
}
export default DashBoardMainComponent;