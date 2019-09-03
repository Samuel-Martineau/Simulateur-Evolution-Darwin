//@ts-ignore
import md from './research.md';
import marked from 'marked';
import './research.scss';
document.body.innerHTML = `${document.body.innerHTML}${marked(md)}`;
