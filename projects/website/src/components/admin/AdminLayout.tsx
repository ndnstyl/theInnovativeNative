import React from 'react';
import Head from 'next/head';
import AdminGuard from './AdminGuard';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  requireOwner?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children, requireOwner }) => {
  const pageTitle = `${title} | Admin | The Innovative Native`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <AdminGuard requireOwner={requireOwner}>
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-layout__main">
            <header className="admin-layout__header">
              <h1 className="admin-layout__title">{title}</h1>
            </header>
            <div className="admin-layout__content">
              {children}
            </div>
          </main>
        </div>
      </AdminGuard>
    </>
  );
};

export default AdminLayout;
