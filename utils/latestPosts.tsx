import { useRouter } from 'next/router';
import React from 'react';

type PostJson = {
  title: string;
  category: string;
};

type LatestPostsProps = {
  posts: PostJson[];
};

const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => {
  const router = useRouter();

  const handlePostClick = (category: string, postName: string) => {
    router.push(`/${category}/${postName}`);
  };

  return (
    <aside id="latest-posts" aria-label="Latest Posts">
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 10).map((post) => (
          <li key={post.title}>
            <a onClick={() => handlePostClick(post.category, post.title)}>{post.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LatestPosts;