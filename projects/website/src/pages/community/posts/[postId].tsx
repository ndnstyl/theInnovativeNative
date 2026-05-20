import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PostDetail from '@/components/community/feed/PostDetail';

const PostPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <ClassroomLayout title="Post">
      <ProtectedRoute>
        <Head>
          <title>Post | The Innovative Native</title>
        </Head>
        {typeof postId === 'string' && <PostDetail postId={postId} />}
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default PostPage;
