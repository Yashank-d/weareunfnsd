import prisma from "@/lib/prisma";
import { updateEnquiryStatus } from "../actions";

// This is a Server Component. It fetches data directly on the server.
export default async function AdminEnquiries() {
  // Fetch all enquiries and include the linked client data, ordered by newest first
  const enquiries = await prisma.enquiry.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted border-b border-border-glass pb-4">
          Inbox / Enquiries
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left font-body text-sm">
          <thead>
            <tr className="border-b border-border-glass font-mono text-[10px] uppercase tracking-widest text-text-muted">
              <th className="pb-4 font-normal">Client</th>
              <th className="pb-4 font-normal">Project Type</th>
              <th className="pb-4 font-normal">Message</th>
              <th className="pb-4 font-normal">Date</th>
              <th className="pb-4 font-normal">Status</th>
              <th className="pb-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-6 pr-4">
                  <div className="font-medium text-white">{enquiry.client.name}</div>
                  <div className="font-mono text-[10px] text-text-muted mt-1">{enquiry.client.email}</div>
                </td>
                <td className="py-6 pr-4 font-mono text-xs text-white/80 uppercase tracking-wider">
                  {enquiry.projectType}
                </td>
                <td className="py-6 pr-4 max-w-xs text-text-muted truncate">
                  {enquiry.message}
                </td>
                <td className="py-6 pr-4 font-mono text-[10px] text-text-muted">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </td>
                <td className="py-6 pr-4">
                  <StatusBadge status={enquiry.status} />
                </td>
                <td className="py-6 text-right">
                  {enquiry.status === "PENDING" ? (
                    <div className="flex items-center justify-end gap-3">
                      <form action={async () => { "use server"; await updateEnquiryStatus(enquiry.id, "REJECTED"); }}>
                        <button className="font-mono text-[10px] text-danger hover:underline uppercase tracking-widest">Reject</button>
                      </form>
                      <form action={async () => { "use server"; await updateEnquiryStatus(enquiry.id, "APPROVED"); }}>
                        <button className="font-mono text-[10px] text-accent border border-accent px-3 py-1 hover:bg-accent hover:text-black transition-colors uppercase tracking-widest">Approve</button>
                      </form>
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">—</span>
                  )}
                </td>
              </tr>
            ))}
            
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center font-mono text-xs text-text-muted uppercase tracking-widest">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A simple helper component for the status badge
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-[#E09F4A]/10 text-[#E09F4A] border-[#E09F4A]/20", // Amber
    APPROVED: "bg-success/10 text-success border-success/20",
    REJECTED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 border rounded-sm ${styles[status]}`}>
      {status}
    </span>
  );
}