import AdminGuard from "@/components/admin/AdminGuard";
import AdminBodyClass from "@/components/admin/AdminBodyClass";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBodyClass />
      <AdminGuard>{children}</AdminGuard>
    </>
  );
}
