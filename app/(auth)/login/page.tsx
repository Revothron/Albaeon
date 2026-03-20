"use client";

import Image from "next/image";
import Link from "next/link";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 md:p-6 lg:p-8">
      {/* ── Laptop constraints: lg:h-[80vh] min-h-[600px] max-h-[900px] ── */}
      <div className="w-full max-w-5xl xl:max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 border border-white/5 lg:border-none shadow-2xl lg:shadow-none min-h-[600px] lg:h-[80vh] max-h-[900px]">
        
        {/* ── Left Panel: Empire Intro ── */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary-deep flex flex-col h-full">
          <div className="mb-4 lg:mb-8">
            <h2 className={`${cinzel.className} text-gold text-xl lg:text-2xl font-bold tracking-[0.15em] mb-4`}>
              ALBAEON
            </h2>
            <h1 className={`${cinzel.className} text-text-primary text-3xl lg:text-4xl xl:text-5xl tracking-widest uppercase mb-4`}>
              Enter The Empire
            </h1>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-md hidden sm:block">
              Sign in to access your orders, saved designs, and premium drops
              curated for your region.
            </p>
            <ul className="text-text-muted text-sm space-y-2 hidden xl:block">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                Real-time order tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                Global shipping preferences
              </li>
            </ul>
          </div>

          <div className="relative w-full flex-1 min-h-[250px] border border-gold/30">
            {/* The image now stretches to fill flex-1 instead of causing vertical overflow via aspect ratio */}
            <div className="absolute inset-0 bg-gradient-to-t from-nav to-surface overflow-hidden">
              <Image
                src="/admin/admin-login-artwork.png"
                alt="Albaeon Empire Dress"
                fill
                priority
                className="object-cover opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Customer Login ── */}
        <div className="border border-gold/20 p-6 lg:p-8 xl:p-12 bg-primary flex flex-col justify-center h-full">
          <div className="xl:hidden mb-4 hidden sm:block">
             <h2 className={`${cinzel.className} text-gold text-xl lg:text-2xl font-bold tracking-[0.15em] mb-2`}>
              ALBAEON
            </h2>
          </div>
          <h1 className={`${cinzel.className} text-text-primary text-2xl xl:text-3xl tracking-widest uppercase mb-2 xl:mb-4`}>
            Customer Login
          </h1>
          <p className="text-text-muted text-sm mb-6 lg:mb-8">
            Welcome back.
          </p>

          {/* Form spacing reduced for laptop screens */}
          <form className="space-y-4 xl:space-y-5 mb-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-nav border border-transparent focus:border-gold/40 text-text-primary px-4 py-3 text-sm transition-colors outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 xl:pt-2">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer hover:text-text-primary transition-colors">
                <input type="checkbox" className="accent-gold w-4 h-4 bg-nav border-none" />
                Remember me
              </label>
              <a href="#" className="text-gold hover:text-gold-hover transition-colors">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="w-full bg-gold hover:bg-gold-hover text-nav font-semibold tracking-wider uppercase py-3 transition-colors mt-2 text-sm">
              Login
            </button>
          </form>

          <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
            <Link href="/register" className="border border-gold text-gold hover:bg-gold hover:text-nav text-center text-sm font-medium py-2.5 transition-colors">
              Create Account
            </Link>
            <Link href="/shop" className="bg-nav text-text-primary hover:bg-surface text-center text-sm font-medium py-2.5 transition-colors">
              Continue as Guest
            </Link>
          </div>

          <div>
            <p className="text-text-muted text-xs mb-3 xl:mb-4">Or continue with</p>
            <div className="flex justify-between gap-2 xl:gap-3">
              {[
                { name: "Google", path: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" },
                { name: "Facebook", path: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" },
                { name: "Apple", path: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.822 3.076 1.559-.05 2.14-.984 4.026-.984 1.885 0 2.408.984 4.044.953 1.67-.025 2.686-1.503 3.682-2.96 1.156-1.687 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.484-4.494 2.597-4.559-1.424-2.083-3.64-2.324-4.435-2.365-1.782-.09-3.468 1.152-4.426 1.152v-.105zm2.863-4.148c.844-1.018 1.411-2.433 1.256-3.844-1.218.049-2.73 1.811-3.604 2.827-.78.894-1.453 2.338-1.272 3.731 1.353.105 2.775-.688 3.62-1.714z" }
              ].map((social, i) => (
                <button key={i} className="flex-1 border border-gold/30 hover:border-gold hover:bg-nav flex items-center justify-center py-2 xl:py-3 rounded-full transition-colors">
                  <svg className="w-4 h-4 fill-gold" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                </button>
              ))}
              <button className="flex-1 border border-gold/30 hover:border-gold hover:bg-nav flex items-center justify-center py-2 xl:py-3 rounded-full transition-colors">
                 <span className="text-gold font-bold text-xs px-1">X</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
