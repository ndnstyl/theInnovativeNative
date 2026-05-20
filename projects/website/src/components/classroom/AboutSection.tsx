import { MEMBERSHIP_PRICE } from '@/lib/constants';

export default function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="about-section">
      <h2 id="about-heading">Here's what actually works.</h2>

      <p>
        Most entrepreneurs I talk to are stuck in the same loop. Duct-taping
        tools together. Doing everything manually. Burning energy just to keep
        things moving instead of actually building something that scales without
        them.
      </p>

      <p>
        That's exactly why I built the 7-day free trial inside{" "}
        <strong>The Innovative Native / BuildMyTribe.AI</strong>.
      </p>

      <p>
        It's the system I wish I had years ago — pulled
        straight from scaling an agency, building AI-first automation frameworks,
        and launching SaaS products without adding chaos. Inside the trial,
        you'll see how to replace disconnected silos with connected systems and
        turn messy workflows into clear, repeatable growth engines.
      </p>

      <p>
        During your free 7 days, you get full access to the classrooms,
        resources, and tools that show you how this works in practice, including:
      </p>

      <ul>
        <li>Brand Vibe Builder — clarify your positioning and messaging in one sitting</li>
        <li>Viral content systems for every major social platform</li>
        <li>Paid ad copy and visual frameworks built for AI execution</li>
        <li>n8n automation templates — plug-and-play workflows for lead gen, onboarding, and content distribution</li>
      </ul>

      <p>
        After the trial, it's <strong>{MEMBERSHIP_PRICE}</strong> — and you can cancel
        anytime. No contracts, no hoops.
      </p>

      <p>
        No commitment during the trial. No paywall. Just a clear look at whether
        AI-first systems are the right next move for you.
      </p>
    </section>
  );
}
