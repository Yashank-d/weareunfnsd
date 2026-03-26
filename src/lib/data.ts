export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;    // Square thumbnail used in the homepage carousel
  heroImage: string;     // Tall portrait used as the right split-panel on the case study page
  bentoImages: string[];
}

export const bestShots: string[] = [
  "/photos/kshamaa-3.jpg",
  "/photos/kshamaa-3.jpg",
  "/photos/kshamaa-3.jpg",
  "/photos/kshamaa-3.jpg",
  "/photos/portrait-1.jpg",
  "/photos/portrait-2.jpg",
  "/photos/street-1.jpg",
  "/photos/street-2.jpg",
  "/photos/kshamaa-1.jpg",
  "/photos/hero-bg.jpg",
  "/photos/portrait-2.jpg",
  "/photos/kshamaa-3.jpg",
  "/photos/street-1.jpg",
  "/photos/kshamaa-2.jpg",
  "/photos/portrait-1.jpg",
  "/photos/street-2.jpg",
  "/photos/hero-bg.jpg",
  "/photos/kshamaa-1.jpg",
  "/photos/portrait-2.jpg",
  "/photos/street-1.jpg",
];


export const projectsData: Project[] = [
  {
    id: "01",
    slug: "Kshamaa",
    title: "Red Angel",
    category: "Portrait",
    description: "Multi-disciplinary artist based in Bengaluru. Capturing the unforced, quiet poetry of urban landscapes.",
    coverImage: "/photos/kshamaa-1.jpg",   // Square — used in homepage carousel
    heroImage: "/photos/kshamaa-1.jpg",    // Tall portrait — used in the right split panel (replace this!)
    bentoImages: [
      "/photos/kshamaa-2.jpg",
      "/photos/kshamaa-3.jpg",
      "/photos/hero-bg.jpg",
      "/photos/portrait-2.jpg"
    ]
  },
  {
    id: "02",
    slug: "portrait-01",
    title: "PORTRAIT — 01",
    category: "Portrait",
    description: "An intimate portrait session playing with natural light and stark shadows, showcasing raw human expression.",
    coverImage: "/photos/portrait-1.jpg",
    heroImage: "/photos/portrait-1.jpg",
    bentoImages: [
      "/photos/portrait-2.jpg",
      "/photos/street-1.jpg"
    ]
  },
  {
    id: "03",
    slug: "portrait-02",
    title: "PORTRAIT — 02",
    category: "Editorial",
    description: "Editorial photography series focused on capturing high-contrast cinematic moments in close quarters.",
    coverImage: "/photos/portrait-2.jpg",
    heroImage: "/photos/portrait-2.jpg",
    bentoImages: [
      "/photos/portrait-1.jpg",
      "/photos/street-2.jpg",
      "/photos/street-1.jpg"
    ]
  },
  {
    id: "04",
    slug: "documentary-view",
    title: "DOCUMENTARY",
    category: "Documentary",
    description: "A continuous documentation of daily life, observing the subtle interactions that go unnoticed in a bustling city.",
    coverImage: "/photos/street-2.jpg",
    heroImage: "/photos/street-2.jpg",
    bentoImages: [
      "/photos/hero-bg.jpg",
      "/photos/street-1.jpg"
    ]
  }
];
