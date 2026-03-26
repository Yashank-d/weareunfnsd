"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { submitEnquiry } from './actions';

import { projectsData } from '../lib/data';
import BestShotsGrid from '../components/BestShotsMarquee';

export default function PortfolioHome() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeProject, setActiveProject] = useState(0);

  // Client-side handler to manage button states
  async function handleEnquiry(formData: FormData) {
    setFormStatus('loading');
    const result = await submitEnquiry(formData);
    
    if (result.error) {
      setFormStatus('error');
    } else {
      setFormStatus('success');
    }
  }

  return (
    <main className="relative w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {/* Added unoptimized flag so you can swap local files easily without Next.js caching getting stuck */}
          <Image src="/photos/hero-bg.jpg" alt="Hero" fill className="object-cover" priority unoptimized />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-bg-primary"></div>
        </div>
        <div className="absolute inset-0 z-10 p-6 md:p-12 pointer-events-none flex-col justify-between hidden md:flex">
          <div className="flex justify-between w-full font-mono text-[10px] uppercase tracking-widest text-text-primary/50">
            <span>Yashank D.</span><span>Est. 2021</span>
          </div>
        </div>
        <div className="relative z-20 text-center flex flex-col items-center mt-12">
          <h1 className="font-display text-7xl md:text-9xl font-light tracking-tight lowercase">yashank d.</h1>
          <div className="mt-6 flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
            <span>Portrait</span><span className="w-1 h-1 bg-accent rounded-full"></span><span>Street</span>
          </div>
          <Link href="#enquiry" className="mt-16 group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <span className="border-b border-transparent group-hover:border-accent transition-colors duration-300 pb-1">Book a session</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </section>

      {/* 2. BEST SHOTS — Full-viewport bento grid */}
      <section id="best-shots">
        <BestShotsGrid />
      </section>

      {/* 3. GALLERY SECTION (Horizontal Slider) */}
      <section id="work" className="py-24 md:py-40 relative w-full overflow-hidden bg-bg-primary">
        <div className="px-6 md:px-12 mb-12 border-b border-border-glass pb-8 max-w-[1600px] mx-auto flex justify-between items-end">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected Work</h2>
          
          {/* Endless Navigation Buttons */}
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveProject(prev => (prev === 0 ? projectsData.length - 1 : prev - 1))}
              className="group font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-white transition-colors flex items-center gap-3"
            >
              <span className="w-8 h-px bg-text-muted group-hover:bg-white transition-colors hidden md:block"></span>
              PREV
            </button>
            <button 
              onClick={() => setActiveProject(prev => (prev + 1) % projectsData.length)}
              className="group font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-white transition-colors flex items-center gap-3"
            >
              NEXT
              <span className="w-8 h-px bg-text-muted group-hover:bg-white transition-colors hidden md:block"></span>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="w-full relative h-[65vh] md:h-[75vh] min-h-[500px]">
          {projectsData.map((project, index) => {
            const N = projectsData.length;
            
            // Shortest path circular offset calculation for true endless visually wrapping
            let offset = (index - activeProject) % N;
            if (offset > Math.floor(N / 2)) offset -= N;
            if (offset < -Math.floor(N / 2)) offset += N;
            
            const isActive = offset === 0;
            const zIndex = N - Math.abs(offset);
            
            // UI Tweaks: Tighter cluster, stronger visual scale hierarchy
            const translateX = offset * 32; // shift by viewport width exactly
            const scale = isActive ? 1 : (1 - Math.abs(offset) * 0.15);
            const blur = isActive ? "blur-0" : "blur-[2px]";
            const opacity = Math.abs(offset) > 1.5 ? 0 : (isActive ? 1 : 0.3);
            const brightness = isActive ? "brightness-100" : "brightness-[0.3]";

            return (
              <div 
                key={project.id}
                className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ 
                  zIndex,
                  transform: `translate(calc(-50% + ${translateX}vw), -50%) scale(${scale})`,
                  opacity,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                {/* Top Label (Matches Reference 1) */}
                <div 
                  className={`mb-6 text-center transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                >
                  <span className="font-mono text-[11px] text-white uppercase tracking-[0.2em]">{project.id}. {project.title}</span>
                </div>
                
                {/* Main Image Block */}
                <Link href={`/work/${project.slug}`} className="relative block w-[85vw] md:w-[400px] xl:w-[500px] aspect-square overflow-hidden bg-black group border border-border-glass">
                  <Image 
                    src={project.coverImage} 
                    alt={project.title} 
                    fill 
                    className={`object-cover transition-all duration-1000 ${brightness} ${blur}`} 
                    sizes="(max-width: 768px) 85vw, 500px"
                    unoptimized
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-sm">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500 scale-95 group-hover:scale-100">
                        View Case Study
                      </span>
                    </div>
                  )}
                </Link>

                {/* Bottom Label */}
                <div 
                  className={`mt-8 text-center transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                >
                  <span className="font-mono text-[11px] text-text-muted uppercase tracking-widest block">{project.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="px-6 py-24 md:px-12 md:py-32 bg-bg-surface">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <div className="relative aspect-4/5 w-full md:w-3/4">
            {/* Note: Add a portrait of yourself to public/photos/yashank-portrait.jpg */}
            <Image src="/photos/portrait-1.jpg" alt="Yashank" fill className="object-cover" /> 
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light italic leading-tight mb-8">
              Documenting people & streets through a still lens.
            </h2>
            <p className="font-body text-text-muted text-lg font-light leading-relaxed max-w-md mb-12">
              Based in Bengaluru. I believe in raw, unforced moments. No heavy manipulations, just the quiet poetry of light hitting reality.
            </p>
            <div className="flex gap-8 border-t border-border-glass pt-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Experience</span>
                <span className="font-mono text-sm tracking-wide">4+ YEARS</span>
              </div>
              <div className="w-px bg-border-glass"></div>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Archive</span>
                <span className="font-mono text-sm tracking-wide">200+ SESSIONS</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 5. ENQUIRY FORM SECTION (Wired to Supabase) */}
      <section id="enquiry" className="px-6 py-24 md:px-12 md:py-40 max-w-6xl mx-auto border-t border-border-glass">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          
          <div>
            <h2 className="font-display text-5xl md:text-7xl font-light italic mb-6">
              Let's make <br/>something together.
            </h2>
            <a href="mailto:hello@yashank.in" className="font-mono text-sm tracking-widest text-text-muted hover:text-accent transition-colors">
              HELLO@YASHANK.IN
            </a>
          </div>

          <form action={handleEnquiry} className="flex flex-col gap-10">
            {formStatus === 'success' ? (
              <div className="p-6 border border-success/30 bg-success/10 text-success font-mono text-sm">
                Enquiry received. I will be in touch shortly.
              </div>
            ) : (
              <>
                <div className="relative group">
                  <label className="absolute -top-4 left-0 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-focus-within:text-accent">Name</label>
                  <input type="text" name="name" required className="input-editorial" placeholder="John Doe" />
                </div>
                
                <div className="relative group">
                  <label className="absolute -top-4 left-0 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-focus-within:text-accent">Email</label>
                  <input type="email" name="email" required className="input-editorial" placeholder="john@example.com" />
                </div>

                <div className="relative group">
                  <label className="absolute -top-4 left-0 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-focus-within:text-accent">Instagram Handle (Optional)</label>
                  <input type="text" name="instagramId" className="input-editorial" placeholder="@username" />
                </div>

                <div className="relative group">
                  <label className="absolute -top-4 left-0 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-focus-within:text-accent">Project Type</label>
                    <select name="projectType" required defaultValue="" className="input-editorial appearance-none rounded-none bg-transparent">
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="Portrait" className="text-black">Portrait Session</option>
                      <option value="Street" className="text-black">Street / Editorial</option>
                      <option value="Commercial" className="text-black">Commercial</option>
                    </select>
                </div>

                <div className="relative group mt-4">
                  <label className="absolute -top-4 left-0 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-focus-within:text-accent">Project Details (Optional)</label>
                  <textarea name="message" rows={2} className="input-editorial resize-none" placeholder="Tell me about your vision..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'loading'}
                  className="mt-4 w-full border border-accent text-accent py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'loading' ? 'SENDING...' : 'SEND ENQUIRY'}
                </button>
                
                {formStatus === 'error' && (
                  <p className="text-danger font-mono text-xs text-center">Something went wrong. Please try again.</p>
                )}
              </>
            )}
          </form>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bg-surface border-t border-border-glass">

        {/* Main footer body */}
        <div className="px-6 md:px-12 py-16 md:py-20 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">

          {/* Col 1 — Brand identity */}
          <div className="flex flex-col gap-4">
            <p className="font-display text-3xl md:text-4xl font-light italic text-text-primary leading-tight">
              Yashank D.
            </p>
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-[0.2em] leading-relaxed max-w-[220px]">
              Portrait &amp; Street Photography<br />Based in Bengaluru · Est. 2021
            </p>
          </div>

          {/* Col 2 — Navigation links */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted mb-2">
              Navigation
            </span>
            {[
              { label: "Selected Work", href: "#work" },
              { label: "Best Shots", href: "#best-shots" },
              { label: "About", href: "#about" },
              { label: "Book a Session", href: "#enquiry" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-primary/80 hover:text-text-primary transition-colors duration-200 w-fit"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Col 3 — Instagram CTA */}
          <div className="flex flex-col gap-4 md:items-end">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-muted">
              Follow the work
            </span>
            <a
              href="https://www.instagram.com/weareunfnsd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              className="group inline-flex items-center gap-3 border border-white/30 hover:border-accent px-6 py-4 transition-all duration-300 hover:bg-accent/5"
            >
              {/* Instagram icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current text-text-muted group-hover:text-accent transition-colors duration-300 shrink-0"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-primary group-hover:text-accent transition-colors duration-300">
                  @weareunfnsd
                </span>
                <span className="font-mono text-[9px] text-text-muted tracking-wider">
                  Instagram ↗
                </span>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom legal strip */}
        <div className="border-t border-white/10 px-6 md:px-12 py-5 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          <span>© 2026 Yashank D. All rights reserved.</span>
          <a
            href="https://weareunfnsd.com"
            className="hover:text-text-muted transition-colors duration-200"
          >
            weareunfnsd.com
          </a>
        </div>

      </footer>

    </main>
  );
}