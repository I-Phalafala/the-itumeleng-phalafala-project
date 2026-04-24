import { profileData } from "@/constants/profile";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-white/[0.02] backdrop-blur-sm py-10">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-neonBlue/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg font-heading font-semibold mb-1 bg-gradient-to-r from-neonBlue to-neonPink bg-clip-text text-transparent">
          {profileData.name}
        </p>
        <p className="text-sm text-textSecondary mb-5">
          {profileData.title} &middot; {profileData.location}
        </p>
        <div className="flex justify-center space-x-6 mb-5">
          <a
            href={`mailto:${profileData.email}`}
            className="text-textSecondary hover:text-neonBlue transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(0,217,255,0.7)]"
            aria-label="Email"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
          <a
            href={profileData.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-neonBlue transition-colors duration-200 hover:drop-shadow-[0_0_6px_rgba(0,217,255,0.7)]"
            aria-label="LinkedIn"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014V8h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.459zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm1.336 9.763H3.667V8h2.674v8.338zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-textSecondary/50">
          &copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
