import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Dashboard page — redirects all users to /classroom.
 * The original Law Firm RAG dashboard has been replaced by the classroom LMS.
 */
export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/classroom');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting... | The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <p style={{ color: '#555' }}>Redirecting to classroom...</p>
      </div>
    </>
  );
}
