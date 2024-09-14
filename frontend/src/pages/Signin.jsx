import { BottomWarning } from "../components/bottomwarning"
import { Button } from "../components/button"
import { Heading } from "../components/heading"
import { InputBox } from "../components/inputbox"
import { SubHeading } from "../components/subheading"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export const Signin = () => {

  const navigate=useNavigate();
  const [email , setEmail]=useState("");
  
 
  const [password , setPassword]=useState("");  

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="harkirat@gmail.com" label={"Email"}  onChange={(e)=>{
          setEmail(e.target.value)
        }}/>
        <InputBox placeholder="123456" label={"Password"}  onChange={(e)=>{setPassword(e.target.value)}}/>
        <div className="pt-4">
        <Button onClick={async ()=>{
            const response= await axios.post("http://localhost:3000/api/v1/user/signin",{
                
                email,
                
                password,
            });
             localStorage.setItem("token",response.data.token);
             navigate("/dashboard");
        }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} linkText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}