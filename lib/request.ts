"use client";

export default async function request(input: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);

  // Check for 401 or 403 status
  if ((res.status === 401 || res.status === 403) && typeof window !== "undefined") {
    alert("Unauthorized");
    // window.location.href = "/login"; // Redirect to login page
  }

  return res;
}
