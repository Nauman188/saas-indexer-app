"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline();

    // Card entrance
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );

    // Stagger inner elements (logo, heading, inputs, button)
    const items = cardRef.current.querySelectorAll(".gsap-item");
    tl.fromTo(
      items,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        ref={cardRef}
        className="auth-card w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}