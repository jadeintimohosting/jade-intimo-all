import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* The Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      {/* lg:pl-64 pushes content right on desktop */}
      {/* pt-16 pushes content down on mobile (for the mobile header) */}
      <main className="lg:pl-64 pt-16 lg:pt-0 transition-all duration-300">
        <div className="container-custom py-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;