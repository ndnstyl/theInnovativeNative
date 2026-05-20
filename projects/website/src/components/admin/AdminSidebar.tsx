import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { href: '/admin', icon: 'fa-solid fa-gauge', label: 'Dashboard', exact: true },
  { href: '/admin/members', icon: 'fa-solid fa-users', label: 'Members' },
  { href: '/admin/moderation', icon: 'fa-solid fa-shield-halved', label: 'Moderation' },
  { href: '/admin/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
  { href: '/admin/audit-log', icon: 'fa-solid fa-clipboard-list', label: 'Audit Log' },
];

const AdminSidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Link href="/" className="admin-sidebar__back">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Site
        </Link>
        <h3 className="admin-sidebar__title">Admin</h3>
      </div>
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map(item => {
          const isActive = item.exact
            ? router.pathname === item.href
            : router.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link ${isActive ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
