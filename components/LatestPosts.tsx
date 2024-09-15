import React, { useEffect, useRef } from 'react';
import '../styles/latestPosts.css';
import { PostData } from '../utils';

const INITIAL_TOP = 400;
const MIN_TOP = 30;
const HIDE_WIDTH_THRESHOLD = 1600;

const handleScroll = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current) return;

  const scrollY = window.scrollY;
  const newTop = scrollY >= INITIAL_TOP
    ? Math.max(INITIAL_TOP - scrollY, MIN_TOP)
    : INITIAL_TOP - scrollY;

  ref.current.style.top = `${newTop}px`;
};

const handleResize = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current) return;

  const shouldHide = window.innerWidth <= HIDE_WIDTH_THRESHOLD;
  ref.current.style.display = shouldHide ? 'none' : 'block';
};

const setupScrollAndResizeHandlers = (ref: React.RefObject<HTMLElement>) => {
  const scrollHandler = () => handleScroll(ref);
  const resizeHandler = () => handleResize(ref);

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('resize', resizeHandler);

  // 초기 창 크기 확인
  handleResize(ref);

  return () => {
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', resizeHandler);
  };
};

type LatestPostsProps = {
  posts: PostData[];
  onPostClick: (category: string, postTitle: string) => void;
};

const LatestPosts: React.FC<LatestPostsProps> = ({ posts, onPostClick }) => {
  const latestPostsRef = useRef<HTMLElement>(null);

  const latestPosts = posts
    .slice()
    .sort((a, b) => b.data.date.localeCompare(a.data.date))
    .slice(0, 10);

  useEffect(() => {
    const cleanupHandlers = setupScrollAndResizeHandlers(latestPostsRef);
    return cleanupHandlers;
  }, []);

  return (
    <aside id="latest-posts" ref={latestPostsRef} className="latest-posts" aria-label="Latest Posts">
      <h2 className="font-bold mb-4">Latest Posts</h2>
      <ul>
        {latestPosts.map((post) => (
          <li key={post.title}>
            <a onClick={() => onPostClick(post.category, post.title)}>{post.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LatestPosts;
