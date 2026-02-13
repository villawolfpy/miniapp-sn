import { Suspense } from 'react';
import { PostDetailClient } from './PostDetailClient';

interface Props {
  params: { id: string };
}

export default function PostPage({ params }: Props) {
  return (
    <Suspense>
      <PostDetailClient id={params.id} />
    </Suspense>
  );
}
