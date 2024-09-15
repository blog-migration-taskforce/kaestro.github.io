import React, { useEffect, useRef } from 'react';
import '../styles/categoryList.css';

const INITIAL_TOP = 400;
const MIN_TOP = 30;
const HIDE_WIDTH_THRESHOLD = 1600;

// 스크롤 핸들러 함수
const handleScroll = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current) return;

  const scrollY = window.scrollY;
  const newTop = scrollY >= INITIAL_TOP
    ? Math.max(INITIAL_TOP - scrollY, MIN_TOP)
    : INITIAL_TOP - scrollY;

  ref.current.style.top = `${newTop}px`;
};

// 창 크기 조정 핸들러 함수
const handleResize = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current) return;

  const shouldHide = window.innerWidth <= HIDE_WIDTH_THRESHOLD;
  ref.current.style.display = shouldHide ? 'none' : 'block';
};

// 외부 함수: 스크롤 및 리사이즈 이벤트 등록
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

type CategoryListProps = {
  categories: string[];
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const categoryListRef = useRef<HTMLElement>(null);
  const filteredCategories = categories.filter(
    category => !['Legacy', 'Pre-Renewal', 'ProtoType'].includes(category)
  );

  useEffect(() => {
    const cleanupHandlers = setupScrollAndResizeHandlers(categoryListRef);
    return cleanupHandlers;
  }, []);

  return (
    <aside id="category-list" ref={categoryListRef} aria-label="Category List">
      <h2>Categories</h2>
      <ul>
        {filteredCategories.map(category => (
          <li key={category}>
            <a href={`/${category}`}>{category}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryList;
