"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/");
      router.refresh();
    } else {
      alert("Invalid Credentials");
    }
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="w-[100%] sm:w-[400px]">
        <div className="flex items-start mb-10">
          <h2 className="text-white text-[32px]">Log in</h2>
        </div>

        <form className="flex flex-col mb-4" onSubmit={handleLogin}>
          <div className="flex flex-col border border-[#eee] rounded-lg mb-4 px-2 py-1">
            <label className=" text-white text-[14px]">Email</label>
            <input
              className=" text-white placeholder:text-white text-4 pt-2 border-none outline-none bg-transparent"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col border border-[#eee] rounded-lg mb-4 px-2 py-1">
            <label className=" text-white text-[14px]">Password</label>
            <input
              className=" text-white placeholder:text-white text-4 pt-2 border-none outline-none bg-transparent"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className=" bg-black rounded-md flex justify-center items-center py-3 text-white font-bold">
            Log in
          </button>
        </form>

        <h6 className=" text-white text-[14px] font-normal">
          Don’t have an account?{" "}
          <Link href="/auth/SignUp">
            <span className=" underline underline-offset-1">Sign up</span>
          </Link>
        </h6>
      </div>
    </div>
  );
}

export default Login;
