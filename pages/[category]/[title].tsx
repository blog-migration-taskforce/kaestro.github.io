import CategoryList from '@/components/CategoryList';
import { ScrollBottomButton, ScrollTopButton } from '@/components/scrollButtons';
import { marked } from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import HomeButton from '../../components/homeButton';
import layouts from '../../layouts/layouts';
import { fetchAllCategories, getAdjacentPosts, getAllPosts, getPostByTitleAndCategory, PostData } from '../../utils';

export const getStaticPaths: GetStaticPaths = async () => {

  const posts: PostData[] = await getAllPosts();
  const paths= posts.map(post => ({
    params: {
      title: post.getTitle(),
      category: post.getCategory(),
      fullPath: post.getFullPath(),
      layout: post.getLayout(),
    }
  }));

  return {
    paths,
    fallback: false,
  };
};

const handleInvalidParams = () => {
  return {
    props: {
      postData: {
        title: 'Error: Invalid parameters',
        contentHtml: 'Error: Invalid parameters',
      },
    },
  };
};

const handlePostNotFound = (): { notFound: true } => {
  return {
    notFound: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.title || !params.category) {
    return handleInvalidParams();
  }

  const post: PostData | null = await getPostByTitleAndCategory(params.title as string, params.category as string);

  if (!post) {
    return handlePostNotFound();
  }

  const postDataJson = post.toJSON();
  const categories = await fetchAllCategories();

  const adjacentPosts = await getAdjacentPosts(params.title as string, params.category as string);

  return {
    props: {
      postDataJson,
      title: params.title as string,
      category: params.category as string,
      categories,
      adjacentPosts,
    }
  };
};

const Post: React.FC<{ postDataJson: PostData; title: string, category: string, categories: string[], adjacentPosts: { prev: PostData | null, next: PostData | null} }> =
  ({ postDataJson, title, category, categories, adjacentPosts }) => {
  if (!postDataJson) {
    return <div>Post not found</div>;
  }

  const layoutJson = postDataJson.layout;

  let Layout;
  try {
    Layout = initializeLayout(layoutJson);
  } catch (error) {
    return <div>post에 오류가 있습니다</div>;
  }

  let htmlContent;
  try {
    htmlContent = initializeHtmlContent(postDataJson.content);
  } catch (error) {
    return <div>post에 오류가 있습니다</div>;
  }

  return (
    <Layout title={postDataJson.title} subtitle={postDataJson.data.subtitle}>
      <div>
        <CategoryList />
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          {adjacentPosts.prev && <div><a href={`/${adjacentPosts.prev.category}/${adjacentPosts.prev.title}`}>이전 포스트: {adjacentPosts.prev.title}</a></div>}
          {adjacentPosts.next && <div style={{ textAlign: 'right' }}><a href={`/${adjacentPosts.next.category}/${adjacentPosts.next.title}`}>다음 포스트: {adjacentPosts.next.title}</a></div>}
        </div>
        <div><HomeButton /></div>
        <div><ScrollTopButton /></div>
        <div><ScrollBottomButton /></div>
      </div>
    </Layout>
  );
};

const initializeLayout = (layoutJson: string) => {
  if (!layoutJson) {
    throw new Error('Layout not found');
  }

  let Layout;

  if (!(layoutJson in layouts)) {
    Layout = layouts['defaultLayout'];
  } else {
    Layout = layouts[layoutJson as keyof typeof layouts];
  }

  return Layout;
}

const initializeHtmlContent = (content: string) => {
  if (!content) {
    throw new Error('Content not found');
  }

  const renderer = new marked.Renderer();

  // Override function for headers
  renderer.heading = (text, level) => {
    const escapedText = text.toLowerCase().replace(/[\s]+/g, '-');
    return `
      <h${level} id="${escapedText}">
        <a name="${escapedText}" class="anchor" href="#${escapedText}">
          <span class="header-link"></span>
        </a>
        ${text}
      </h${level}>`;
  };

  // Override function for links
  renderer.link = (href, title, text) => {
    return `<a target="_self" href="${href}" title="${title}">${text}</a>`;
  };

  marked.setOptions({
    renderer,
  })

  return marked(content);
}

export default Post;