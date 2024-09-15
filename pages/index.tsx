import CategoryList from '@/components/CategoryList';
import HomeButton from '@/components/homeButton';
import LatestPosts from '@/components/LatestPosts';
import { ScrollBottomButton, ScrollTopButton } from '@/components/scrollButtons';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import path from 'path';
import React, { useMemo } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import { getAllPosts, getCategories, getLatestPostsByCategory, PostData } from '../utils';

const RecommendedPosts: React.FC<{ posts: PostData[], onPostClick: (category: string, title: string) => void }> = ({ posts, onPostClick }) => {
  return (
    <div className="p-4 rounded-md">
      <h2 className="font-bold mb-4 !text-black">추천 글</h2>
      <hr className="mb-4 border-gray-300" />
      <div className="space-y-0">
        {posts.slice(0, 5).map((post) => (
          <p key={post.title} onClick={() => onPostClick(post.category, post.title)} className="text-blue-500 hover:underline cursor-pointer !mb-0">
            {post.title}
          </p>
        ))}
      </div>
      <p className="mt-4 text-blue-500 hover:underline cursor-pointer font-bold" onClick={() => onPostClick('recommended', '')}>
        see all posts({posts.length}) in 추천 글
      </p>
    </div>
  );
};

const CategoryPosts: React.FC<{ category: string, posts: PostData[], postCount: number, onPostClick: (category: string, title: string) => void }> = ({ category, posts, postCount, onPostClick }) => {
  return (
    <div className="p-4 rounded-md">
      <h2 className="font-bold mb-4">{category}</h2>
      <hr className="mb-4 border-gray-300" />
      <div className="space-y-0">
        {posts.map((post) => (
          <p key={post.title} onClick={() => onPostClick(category, post.title)} className="text-blue-500 hover:underline cursor-pointer !mb-0">
            {post.title}
          </p>
        ))}
      </div>
      <p className="mt-4 text-blue-500 hover:underline cursor-pointer font-bold" onClick={() => onPostClick(category, '')}>
        see all posts({postCount}) in {category}
      </p>
    </div>
  );
};

const HomePage: React.FC<{ postsJson: PostData[], latestPostsByCategory: { category: string, posts: PostData[] }[] }> = ({ postsJson, latestPostsByCategory }) => {
  const router = useRouter();

  const customOrder = useMemo(() => [
    '신변잡기', '개발일지', '서평', '개발이야기', '게임이야기', 
    '디자인패턴', 'Algorithm', 'WeeklyPosts', 'ETC'
  ], []);

  const sortedPosts = useMemo(() => (
    [...latestPostsByCategory].sort((a, b) => customOrder.indexOf(a.category) - customOrder.indexOf(b.category))
  ), [latestPostsByCategory, customOrder]);

  const recommendedPosts = useMemo(() => postsJson.filter(post => post.data && post.data.recommended), [postsJson]);

  const postCountByCategory = useMemo(() => (
    postsJson.reduce((count, post) => {
      count[post.category] = (count[post.category] || 0) + 1;
      return count;
    }, {} as { [category: string]: number })
  ), [postsJson]);

  const handlePostClick = (category: string, postName: string) => {
    console.log(`Clicked on post ${category}, postDirectory ${postName}`);
    router.push(`/${category}/${postName}`);
  };

  return (
    <DefaultLayout title="Kaestro's BlackSmith" subtitle='프로그래밍을 단련하고, 기록하는 공간'>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        {/* 추천 글 컴포넌트 */}
        <RecommendedPosts posts={recommendedPosts} onPostClick={handlePostClick} />

        {/* 카테고리별 포스트 컴포넌트 */}
        {sortedPosts.map(({ category, posts }) => (
          <CategoryPosts
            key={category}
            category={category}
            posts={posts}
            postCount={postCountByCategory[category]}
            onPostClick={handlePostClick}
          />
        ))}
      </div>

      <LatestPosts posts={postsJson} onPostClick={handlePostClick} />
      <div><CategoryList categories={ customOrder } /></div>
      <div><HomeButton /></div>
      <div><ScrollBottomButton /></div>
      <div><ScrollTopButton /></div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), '_posts');
  const posts: PostData[] = getAllPosts();

  const categoriesSet: Set<string> = getCategories(posts);
  const categories = Array.from(categoriesSet);

  const latestPostsByCategory = categories.map(category => ({
    category,
    posts: getLatestPostsByCategory(posts, category).map(post => post.toJSON()),
  }));

  const postsJson = posts.map(post => ({ ...post.toJSON() }));

  return {
    props: {
      postsJson,
      categories,
      latestPostsByCategory,
    },
  };
};

export default HomePage;
