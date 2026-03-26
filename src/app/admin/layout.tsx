import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary font-body">
      
      {/* Sidebar */}
      <aside className="w-64 bg-bg-surface border-r border-border-glass flex flex-col">
        <div className="p-6 border-b border-border-glass">
          <h1 className="font-display text-2xl italic tracking-wide">Admin Panel</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mt-2">Yashank D.</p>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-4 font-mono text-xs uppercase tracking-[0.15em]">
          <Link href="/admin" className="text-text-muted hover:text-white hover:translate-x-1 transition-all duration-300">
            Enquiries
          </Link>
          <Link href="/admin/availability" className="text-text-muted hover:text-white hover:translate-x-1 transition-all duration-300">
            Availability
          </Link>
          <Link href="/admin/bookings" className="text-text-muted hover:text-white hover:translate-x-1 transition-all duration-300">
            Bookings
          </Link>
        </nav>

        <div className="p-6 border-t border-border-glass">
          <Link href="/" className="font-mono text-[10px] text-text-muted hover:text-white uppercase tracking-widest">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
      
    </div>
  );
}