import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import HeroBanner from './HeroBanner';
import CourseGallery from './CourseGallery';
import CommunityMetaBar from './CommunityMetaBar';
import AboutSection from './AboutSection';
import CommunitySidebar from './CommunitySidebar';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SectionErrorFallback from '@/components/error/SectionErrorFallback';

interface ClassroomLandingProps {
  memberCount: number;
  adminCount: number;
  onlineCount: number;
  isConnected: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onTrialClick: () => void;
}

export default function ClassroomLanding({
  memberCount,
  adminCount,
  onlineCount,
  isConnected,
  loading,
  isAuthenticated,
  onLoginClick,
  onTrialClick,
}: ClassroomLandingProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const metaBarRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const tweens: gsap.core.Tween[] = [];

    // Fade-in hero on load
    if (heroRef.current) {
      tweens.push(gsap.from(heroRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }));
    }

    // Stagger-in course gallery thumbnails
    if (galleryRef.current) {
      const cards = galleryRef.current.querySelectorAll('.course-gallery__card');
      if (cards.length > 0) {
        tweens.push(gsap.from(cards, {
          opacity: 0,
          y: 15,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out',
        }));
      }
    }

    // Fade-in meta bar and about section sequentially
    if (metaBarRef.current) {
      tweens.push(gsap.from(metaBarRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
      }));
    }

    if (aboutRef.current) {
      tweens.push(gsap.from(aboutRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.6,
        ease: 'power2.out',
      }));
    }

    // Slide-in sidebar from right
    if (sidebarRef.current) {
      tweens.push(gsap.from(sidebarRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.7,
        delay: 0.4,
        ease: 'power2.out',
      }));
    }

    return () => { tweens.forEach(t => t.kill()); };
  }, []);

  return (
    <div className="classroom-landing">
      <div className="classroom-landing__grid">
        <main className="classroom-landing__main">
          <div ref={heroRef}>
            <HeroBanner />
          </div>
          <div ref={galleryRef}>
            <ErrorBoundary fallback={<SectionErrorFallback section="Courses" />}>
              <CourseGallery isAuthenticated={isAuthenticated} onTrialClick={onTrialClick} />
            </ErrorBoundary>
          </div>
          <div ref={metaBarRef}>
            <CommunityMetaBar memberCount={memberCount} loading={loading} />
          </div>
          <div ref={aboutRef}>
            <AboutSection />
          </div>
        </main>
        <div className="classroom-landing__sidebar" ref={sidebarRef}>
          <CommunitySidebar
            memberCount={memberCount}
            onlineCount={onlineCount}
            adminCount={adminCount}
            isConnected={isConnected}
            loading={loading}
            isAuthenticated={isAuthenticated}
            onLoginClick={onLoginClick}
            onTrialClick={onTrialClick}
          />
        </div>
      </div>
      <div className="classroom-landing__legal">
        <Link href="/privacy-policy">Privacy Policy</Link>
        {' · '}
        <Link href="/terms-and-conditions">Terms and Conditions</Link>
      </div>
    </div>
  );
}
