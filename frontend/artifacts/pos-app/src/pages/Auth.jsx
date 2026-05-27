import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg"
import logo from "../assets/images/logo.png"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {

  useEffect(() => {
    document.title = "POS | Auth"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        {/* BG Image */}
        <img className="w-full h-full object-cover" src={restaurant} alt="Restaurant Image" />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Layani pelanggan dengan cepat, ramah, dan profesional —
          kunci sukses bisnis yang berkelanjutan."
          <br />
          <span className="block mt-4 text-[#5B52D1]">— Gentong Mas</span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className="w-1/2 min-h-screen bg-white p-10">
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 border-2 border-[#5B52D1] rounded-full flex items-center justify-center bg-[#5B52D1] text-white font-bold text-xl">GM</div>
          <h1 className="text-lg font-semibold text-[#1E1B4B] tracking-wide">Gentong Mas POS</h1>
        </div>

        <h2 className="text-4xl text-center mt-10 font-semibold text-[#5B52D1] mb-10">
          {isRegister ? "Employee Registration" : "Employee Login"}
        </h2>

        {/* Components */}  
        {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}


        <div className="flex justify-center mt-6">
          <p className="text-sm text-[#6B7280]">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <a onClick={() => setIsRegister(!isRegister)} className="text-[#5B52D1] font-semibold hover:underline" href="#">
              {isRegister ? "Sign in" : "Sign up"}
            </a>
          </p>
        </div>


      </div>
    </div>
  );
};

export default Auth;
