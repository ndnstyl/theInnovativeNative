import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      window.location.href = '/classroom';
    } catch {
      // Sign-out failed — user can retry
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Get user initials for avatar
  const getInitials = () => {
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  // Truncate email for display
  const displayEmail = () => {
    const email = user.email || '';
    if (email.length > 24) {
      return email.substring(0, 24) + '...';
    }
    return email;
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="user-avatar">{getInitials()}</span>
        <i className={`fa-solid fa-chevron-down ${isOpen ? 'rotated' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <span className="user-avatar user-avatar-lg">{getInitials()}</span>
            <div className="user-info">
              <span className="user-email">{displayEmail()}</span>
              <span className="user-role">Member</span>
            </div>
          </div>

          <div className="user-menu-divider"></div>

          <nav className="user-menu-nav">
            <Link href="/dashboard" className="user-menu-item" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-gauge-high"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard#billing" className="user-menu-item" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-credit-card"></i>
              <span>Billing</span>
            </Link>
          </nav>

          <div className="user-menu-divider"></div>

          <button
            className="user-menu-item user-menu-signout"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="signout-spinner"></span>
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Sign out</span>
              </>
            )}
          </button>
        </div>
      )}

      <style jsx>{`
        .user-menu {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid #1a1a1a;
          border-radius: 50px;
          padding: 6px 12px 6px 6px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .user-menu-trigger:hover {
          border-color: #00FFFF;
        }

        .user-menu-trigger i {
          color: #757575;
          font-size: 10px;
          transition: transform 0.2s ease;
        }

        .user-menu-trigger i.rotated {
          transform: rotate(180deg);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00FFFF 0%, #0088aa 100%);
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .user-avatar-lg {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }

        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 12px;
          min-width: 240px;
          padding: 8px;
          z-index: 1000;
          animation: dropdownFadeIn 0.15s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-menu-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .user-email {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          color: #00FFFF;
          font-size: 12px;
        }

        .user-menu-divider {
          height: 1px;
          background-color: #1a1a1a;
          margin: 8px 0;
        }

        .user-menu-nav {
          display: flex;
          flex-direction: column;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          color: #c1c1c1;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          transition: background-color 0.15s ease, color 0.15s ease;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .user-menu-item:hover {
          background-color: #1a1a1a;
          color: #fff;
        }

        .user-menu-item i {
          width: 16px;
          text-align: center;
          font-size: 14px;
        }

        .user-menu-signout {
          color: #ff6b6b;
        }

        .user-menu-signout:hover {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff4444;
        }

        .user-menu-signout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signout-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #1a1a1a;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
