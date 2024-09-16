import CategoryList from '@/components/CategoryList';
import HomeButton from '@/components/homeButton';
import { ScrollBottomButton, ScrollTopButton } from '@/components/scrollButtons';
import DefaultLayout from '@/layouts/DefaultLayout';
import { fetchAllCategories, getAllPosts, PostData } from '@/utils';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';

interface CategoryPageProps {
  posts: PostData[];
  category: string;
  categories: string[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ posts, category, categories }) => {

  const allPosts: PostData[] = posts;
  const postsByCategory = allPosts
    .filter(post => post.category === category)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  const Layout = DefaultLayout;


  return (
    <Layout title={category} subtitle=''>
      <div>
        {postsByCategory.map((post) => (
          <Link key={post.title} href={`/${category}/${post.title}`}>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      props: {
        posts: [],
        category: '',
        categories: [],
      },
    };
  }


  // Replace with your logic to fetch posts
  let posts: PostData[] = getAllPosts().filter((post) => post.category === params.category);

  posts = JSON.parse(JSON.stringify(posts));

  const categories = await fetchAllCategories();

  return {
    props: {
      posts,
      category: params.category,
      categories,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Replace with your logic to fetch all posts
  const allPosts = getAllPosts();
  const categories = allPosts.map((post) => post.category);

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return { paths, fallback: false };
};
