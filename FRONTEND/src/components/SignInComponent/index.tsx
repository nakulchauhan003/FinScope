import './style.css';
import { useState } from "react";
export default function SignInComponent(){
    const [inSignUpMode,setInSignUpMode]=useState(false);
    return(
        <div className="mainContainer">
            <div className={`signIn_mainContainer ${inSignUpMode?"sign-up-mode":""}`}>
                {!inSignUpMode?
                <div className="singIn_mainContainerLeft">
                    <h1 className="text-5xl font-medium text-center">Sign in</h1>
                    <input className="inputFields" type="text" placeholder="Email" required />
                    <input className="inputFields" type="text" placeholder="Password" required />
                    <select className="roleSelector" title="Select role" name="role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                     <div className="SignInButton">SIGN IN</div>
                </div>
                :
                <div className="singUp_mainContainerLeft">
                    <h1 className="text-7xl">Already Have,</h1>
                    <h1 className="text-6xl">Account!</h1>
                    <div onClick={()=>setInSignUpMode(false)} className="SignUpButton">SIGN IN</div>
                </div>
                }
                {!inSignUpMode?
                <div className="singIn_mainContainerRight">
                    <h1 className="text-7xl">Create,</h1>
                    <h1 className="text-6xl">Account!</h1>
                    <p className="text-2xl">Sign up if you still dont't have an account ...</p>
                    <div onClick={()=>setInSignUpMode(true)} className="SignUpButton">SIGN UP</div>
                </div>
                :
                <div className="singUp_mainContainerRight">
                    <h1 className="text-5xl font-medium text-center">Sign Up</h1>
                    <input type="text" className="inputFields" placeholder="UserName" required />
                    <input className="inputFields" type="text" placeholder="Email" required />
                    <input className="inputFields" type="password" placeholder="Password" required />
                    <select className="roleSelector" title="Select role" name="role">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                     <div className="SignInButton">SIGN UP</div>
                </div>
                }
            </div>
        </div>
    )
}