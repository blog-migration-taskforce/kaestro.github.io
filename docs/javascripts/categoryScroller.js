// /docs/javascripts/categoryScroller.js
window.addEventListener('scroll', function() {
    var categoryList = document.getElementById('category-list');
    var topValue = Math.max(300, 520 - window.scrollY);
    categoryList.style.top = topValue + 'px';
});
