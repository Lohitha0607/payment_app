import { useState } from "react";
import { BottomWarning } from "../components/bottomwarning";
import { Button } from "../components/button";
import { Heading } from "../components/heading";
import { InputBox } from "../components/inputbox";
import { SubHeading } from "../components/subheading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // To store errors

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                name,
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Store the token
                console.log(response.data.token);
                navigate("/dashboard"); // Redirect to dashboard after successful signup
            } else {
                throw new Error("Token is missing in response");
            }
        } catch (err) {
            console.error("Error during signup:", err);
            setError(err.response?.data?.message || "Signup failed. Please try again."); // Set error message
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox onChange={(e) => setName(e.target.value)} placeholder="loh" label={"Name"} />
                    <InputBox onChange={(e) => setEmail(e.target.value)} placeholder="loh@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) => setPassword(e.target.value)} placeholder="123456" label={"Password"} type="password" />
                    
                    {error && <p className="text-red-500">{error}</p>} {/* Display error if exists */}
                    
                    <div className="pt-4">
                        <Button onClick={handleSignup} label={"Sign up"} />
                    </div>
                    
                    <BottomWarning label={"Already have an account?"} linkText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    );
};
