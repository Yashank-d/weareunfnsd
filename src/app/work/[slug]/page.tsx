import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectsData } from '../../../lib/data';

// Generates static paths for all projects at build time
export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const project = projectsData.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-bg-primary text-text-primary">
      
      {/* Navbar overlay for closing case study */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-12 z-50 flex pointer-events-none gap-6">
        <Link 
          href="/" 
          className="pointer-events-auto font-mono text-[10px] uppercase tracking-widest text-text-primary mix-blend-difference hover:opacity-50 transition-opacity flex items-center gap-2"
        >
          [X] CLOSE
        </Link>
        <div className="font-mono text-[10px] uppercase tracking-widest text-text-primary mix-blend-difference hidden md:block">
          / {project.title}
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="min-h-screen w-full flex flex-col md:flex-row">
        
        {/* Left Side: Detail & Meta */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-12 md:p-24 bg-bg-primary pt-32 md:pt-24 relative border-b md:border-b-0 md:border-r border-border-glass">
          
          {/* Small thumbnail like in reference */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-16 grayscale opacity-80 mix-blend-luminosity">
            <Image 
              src={project.coverImage} 
              alt={`${project.title} thumbnail`} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>

          <div className="text-center max-w-sm">
            <h1 className="font-display text-2xl md:text-3xl font-light italic mb-6">
              {project.category}
            </h1>
            <p className="font-mono text-[11px] leading-relaxed text-text-muted italic">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Side: Main Hero Image */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-screen relative bg-black">
          <div className="absolute top-12 right-12 z-10 font-mono text-[10px] tracking-widest uppercase text-white mix-blend-difference opacity-50 hidden md:block">
            [ NAVIGATION ]
          </div>
          <Image 
            src={project.heroImage} 
            alt={project.title} 
            fill 
            className="object-cover transition-opacity duration-1000"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      </section>

      {/* Bento Grid Section for remaining images */}
      <section className="px-6 py-24 md:px-12 md:py-40 max-w-[1600px] mx-auto">
        <div className="mb-16 md:mb-24 flex items-center justify-between border-b border-border-glass pb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Archive Layout</h2>
          <span className="font-mono text-[10px] tracking-widest text-text-muted">{project.bentoImages.length} SHOTS</span>
        </div>

        {/* CSS Grid for Bento effect */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {project.bentoImages.map((imgSrc, i) => {
            // Asymmetrical bento grid spanning
            let spanClass = "md:col-span-6";
            let rowClass = "row-span-1";
            
            if (i % 6 === 0) { spanClass = "md:col-span-12"; rowClass = "row-span-1 md:row-span-2"; }
            else if (i % 6 === 1) spanClass = "md:col-span-4";
            else if (i % 6 === 2) spanClass = "md:col-span-8";
            else if (i % 6 === 3) spanClass = "md:col-span-7";
            else if (i % 6 === 4) spanClass = "md:col-span-5";
            else if (i % 6 === 5) { spanClass = "md:col-span-12"; rowClass = "row-span-1"; }

            return (
              <div 
                key={i} 
                className={`relative w-full h-full bg-bg-surface overflow-hidden group ${spanClass} ${rowClass}`}
              >
                <Image 
                  src={imgSrc} 
                  alt={`${project.title} detail ${i + 1}`} 
                  fill 
                  className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 group-hover:grayscale-0 grayscale-50"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Go Back */}
      <section className="py-24 md:py-32 flex flex-col items-center justify-center border-t border-border-glass text-center px-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-6">Explore More</p>
        <Link href="/" className="group font-display text-4xl md:text-6xl text-text-primary hover:text-accent transition-colors font-light italic flex items-center gap-4">
          <span className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden md:block">←</span>
          Return to Hub
          <span className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hidden md:block">→</span>
        </Link>
      </section>
      
    </main>
  );
}
