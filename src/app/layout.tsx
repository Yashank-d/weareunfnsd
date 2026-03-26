import type { Metadata } from "next";
import { Cormorant_Garamond, Karla, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 1. Load the Display Serif (For large headings)
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant"
});

// 2. Load the Body Sans (For paragraphs)
const karla = Karla({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  variable: "--font-karla"
});

// 3. Load the Monospace (For metadata, labels, and small UI text)
const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  title: "Yashank D. | Portrait & Street",
  description: "Documenting people & streets through a still lens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable} ${jetbrains.variable}`}>
      <body className="antialiased relative min-h-screen flex flex-col">
        
        {/* THE FILM GRAIN OVERLAY */}
        {/* We use an inline SVG fractal noise filter. It is ultra-lightweight and creates a perfect film texture. */}
        <div 
          className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        />
        
        {children}
      </body>
    </html>
  );
}