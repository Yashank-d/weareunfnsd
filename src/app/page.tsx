"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { submitEnquiry } from './actions';

const galleryWork = [
  { id: 1, src: '/photos/street-1.jpg', span: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', label: 'STREET — BLR' },
  { id: 2, src: '/photos/portrait-1.jpg', span: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', label: 'PORTRAIT — 01' },
  { id: 3, src: '/photos/portrait-2.jpg', span: 'col-span-12 md:col-span-4', aspect: 'aspect-[3/4]', label: 'PORTRAIT — 02' },
  { id: 4, src: '/photos/street-2.jpg', span: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]', label: 'DOCUMENTARY' },
];

export default function PortfolioHome() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      <section className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src="/photos/hero-bg.jpg" alt="Hero" fill className="object-cover" priority />
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

      {/* 2. GALLERY SECTION */}
      <section className="px-6 py-24 md:px-12 md:py-40 max-w-[1600px] mx-auto">
        <div className="mb-16 border-b border-border-glass pb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected Work</h2>
        </div>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {galleryWork.map((item) => (
            <div key={item.id} className={`group relative overflow-hidden bg-bg-surface ${item.span} ${item.aspect}`}>
              <Image src={item.src} alt={item.label} fill className="object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03]" />
              <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-linear-to-t from-black/90 to-transparent">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="px-6 py-24 md:px-12 md:py-32 bg-bg-surface">
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

      {/* 4. ENQUIRY FORM SECTION (Wired to Supabase) */}
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
      <footer className="px-6 py-8 md:px-12 border-t border-border-glass flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
        <span>© 2026 Yashank D.</span>
        <span>Portrait & Street Photography</span>
        <a href="https://weareunfnsd.com" className="hover:text-text-primary transition-colors">@weareunfnsd</a>
      </footer>

    </main>
  );
}