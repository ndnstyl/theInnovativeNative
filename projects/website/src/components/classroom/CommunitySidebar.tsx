interface CommunitySidebarProps {
  memberCount: number;
  onlineCount: number;
  adminCount: number;
  isConnected: boolean;
  loading?: boolean;
  isAuthenticated?: boolean;
  onLoginClick: () => void;
  onTrialClick: () => void;
}

export default function CommunitySidebar({
  memberCount,
  onlineCount,
  adminCount,
  isConnected,
  loading,
  isAuthenticated,
  onLoginClick,
  onTrialClick,
}: CommunitySidebarProps) {
  return (
    <aside aria-label="Community information" className="sidebar-card">
      <div className="sidebar-card__header">
        <img
          src="/images/classroom/logo-buildmytribe.png"
          alt="BuildMyTribe.AI"
          className="sidebar-card__logo"
          width={60}
          height={60}
        />
        <h3 className="sidebar-card__name">BuildMyTribe.AI</h3>
        <p className="sidebar-card__subtitle">by The Innovative Native</p>
        <p className="sidebar-card__tagline">
          Where builders trade chaos for clarity. Automate, grow, and joke about the grind we just deleted.
        </p>
      </div>

      <div className="sidebar-card__stats">
        <div className="sidebar-card__stats-item">
          <span className="sidebar-card__stats-number">
            {loading ? '...' : memberCount === 0 ? '—' : memberCount}
          </span>
          <span className="sidebar-card__stats-label">
            {memberCount === 0 && !loading ? 'Be first!' : 'Members'}
          </span>
        </div>
        {isConnected && (
          <div className="sidebar-card__stats-item">
            <span className="sidebar-card__stats-number sidebar-card__stats-number--online">
              {onlineCount}
            </span>
            <span className="sidebar-card__stats-label">Online</span>
          </div>
        )}
        <div className="sidebar-card__stats-item">
          <span className="sidebar-card__stats-number">{loading ? '...' : adminCount}</span>
          <span className="sidebar-card__stats-label">Admins</span>
        </div>
      </div>

      {isAuthenticated ? (
        <a href="/classroom/my-progress" className="sidebar-card__cta">
          My Progress
        </a>
      ) : (
        <>
          <button type="button" className="sidebar-card__cta" onClick={onTrialClick}>
            Start 7-Day Free Trial
          </button>
          <p className="sidebar-card__pricing">Then $99/mo after trial</p>
          <button type="button" className="sidebar-card__login" onClick={onLoginClick}>
            Log In
          </button>
        </>
      )}
    </aside>
  );
}
