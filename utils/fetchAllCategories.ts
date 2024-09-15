import { getAllPosts } from "./getAllPosts";
import { PostData } from "./PostData";

const fetchAllCategories = async (): Promise<string[]> => {
  const posts: PostData[] = getAllPosts();
  const categoriesSet = new Set(posts.map(post => post.category)); // map을 사용하여 바로 set에 추가

  return Array.from(categoriesSet); // Set을 배열로 변환하여 반환
};

export default fetchAllCategories;
