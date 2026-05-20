import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Mock useAuth with controllable return values
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock AuthModal
jest.mock("@/components/auth/AuthModal", () => {
  return function MockAuthModal({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
    redirectTo?: string;
  }) {
    if (!isOpen) return null;
    return (
      <div data-testid="auth-modal">
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock next/router
const mockReplace = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/members/dashboard",
    asPath: "/members/dashboard",
    push: jest.fn(),
    replace: mockReplace,
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

// Default auth state factory
const createAuthState = (overrides = {}) => ({
  session: null,
  isLoading: false,
  profile: null,
  role: null,
  membershipStatus: null,
  isOnboarded: false,
  refreshProfile: jest.fn(),
  supabaseClient: {},
  ...overrides,
});

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loading state", () => {
    it("shows loading state when isLoading is true", () => {
      mockUseAuth.mockReturnValue(createAuthState({ isLoading: true }));

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("no session", () => {
    it("shows sign-in prompt when there is no session", () => {
      mockUseAuth.mockReturnValue(createAuthState({ session: null }));

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Sign in required")).toBeInTheDocument();
      expect(
        screen.getByText("You need an account to access this page.")
      ).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("shows Sign In button that opens auth modal", () => {
      mockUseAuth.mockReturnValue(createAuthState({ session: null }));

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      const signInButton = screen.getByRole("button", { name: /Sign In/i });
      expect(signInButton).toBeInTheDocument();

      fireEvent.click(signInButton);
      expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    });
  });

  describe("banned user", () => {
    it("shows banned/suspended message when membershipStatus is banned", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "banned",
        })
      );

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Account Suspended")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your account has been suspended. Contact support for more information."
        )
      ).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("pending membership", () => {
    it("shows pending message when membershipStatus is pending", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "pending",
        })
      );

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Membership Pending")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("not onboarded", () => {
    it("redirects to onboarding when user is not onboarded", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "approved",
          isOnboarded: false,
        })
      );

      render(
        <ProtectedRoute requireOnboarded={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(mockReplace).toHaveBeenCalledWith("/members/onboarding");
    });
  });

  describe("role check", () => {
    it("shows access denied when user role is not in requiredRole list", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "approved",
          isOnboarded: true,
          role: "member",
        })
      );

      render(
        <ProtectedRoute requiredRole={["admin", "owner"]}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Access Denied")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("authenticated", () => {
    it("renders children when user is fully authenticated and authorized", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "approved",
          isOnboarded: true,
          role: "member",
        })
      );

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders children when user has the required role", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "approved",
          isOnboarded: true,
          role: "admin",
        })
      );

      render(
        <ProtectedRoute requiredRole={["admin", "owner"]}>
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });

    it("renders children when requireOnboarded is false and user is not onboarded", () => {
      mockUseAuth.mockReturnValue(
        createAuthState({
          session: { user: { id: "123" } },
          membershipStatus: "approved",
          isOnboarded: false,
          role: "member",
        })
      );

      render(
        <ProtectedRoute requireOnboarded={false}>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });
});
