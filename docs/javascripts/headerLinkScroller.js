// /docs/javascripts/headerLinkScroller.js
window.addEventListener('scroll', function() {
    var headerLinks = document.getElementById('header-links');
    var headerLinksToggler = document.getElementById('header-links-toggler');
    var topValue = Math.max(300, 520 - window.scrollY);
    headerLinks.style.top = topValue + 20 + 'px';
    headerLinksToggler.style.top = topValue - 20 + 'px';
});
