import CategoryList from '@/components/CategoryList';
import HomeButton from '@/components/homeButton';
import { ScrollBottomButton, ScrollTopButton } from '@/components/scrollButtons';
import DefaultLayout from '@/layouts/DefaultLayout';
import { fetchAllCategories, getAllPosts, PostData } from '@/utils';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

interface CategoryPageProps {
  posts: PostData[];
  categories: string[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ posts, categories }) => {
  const allPosts: PostData[] = posts;
  const postsByCategory = allPosts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const Layout = DefaultLayout;

  return (
    <Layout title='추천글' subtitle=''>
      <div>
        {postsByCategory.map((post) => (
          <Link key={post.title} href={`/${post.category}/${post.title}`}>
            <h2 style={{ color: 'green', fontWeight: 'bold', marginBottom: '0', marginTop: '1em' }}>{post.title}</h2>
            <h3 style={{ color: 'gray', marginTop: '0.2em' }}>{post.subtitle}</h3>
          </Link>
        ))}
      </div>
      <div><HomeButton /></div>
      <div><CategoryList /></div>
      <div><ScrollBottomButton /></div>
      <div><ScrollTopButton /></div>
    </Layout>
  );
};

export default CategoryPage;

export const getStaticProps: GetStaticProps = async () => {
  // 추천된 포스트만 선택
  let posts: PostData[] = getAllPosts().filter((post) => post.getRecommended() === true);

  posts = JSON.parse(JSON.stringify(posts));

  const categories = await fetchAllCategories();

  return {
    props: {
      posts,
      categories,
    },
  };
};
