import './styles/styles.scss';
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/vbscript-html';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('html', html);

const navItems = Array.from(document.getElementsByClassName('nav-item-link') as HTMLCollectionOf<HTMLAnchorElement>);

function setActiveNavItem(): void {
    const hashTag = document.location.hash;
    if (hashTag) {
        const newActiveMenuItem: HTMLAnchorElement = navItems.find((item) => item.href.indexOf(hashTag) > -1);
        const currentActiveMenuItem: HTMLAnchorElement = navItems.find((item) => item.parentElement.classList.contains('active'));
        if (newActiveMenuItem) {
            if (currentActiveMenuItem && currentActiveMenuItem.href !== newActiveMenuItem.href) {
                currentActiveMenuItem.parentElement.classList.remove('active');
            }
            newActiveMenuItem.parentElement.classList.add('active');
        }
    }
}

setActiveNavItem();
for (const navItem of navItems) {
    navItem.parentElement.addEventListener('click', () => {
        document.location.href = navItem.href;
        setActiveNavItem();
    });
}

document.querySelectorAll('code').forEach((el) => {
    hljs.highlightElement(el as HTMLElement);
});


