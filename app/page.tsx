"use client";

export const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login");
    const redirectUrl = await res.json();
    window.location.href = redirectUrl;
};

export default function Home() {
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
