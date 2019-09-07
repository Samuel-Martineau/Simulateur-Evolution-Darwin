//@ts-ignore
import md from './research.md';
import marked from 'marked';
import './research.scss';

const body = document.body;
const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  const escapedText = text
    .toLowerCase()
    .replace(/d&#[0-9]{2};/, '-')
    .replace(/[ ]/g, '-')
    .replace(/\-+/g, '-');
  return `
  <a href="#${escapedText}" class="anchor">
    <h${level} id="${escapedText}" onclick="window.copyLink('${escapedText}')">
      ${text}
    </h${level}>
  </a>
  `;
};

document.body.innerHTML = `${document.body.innerHTML}${marked(md, { renderer })}`;

window.copyLink = (id: string) => {
  const text = `https://smartineau.me/simulateur-evolution-darwin/recherche#${id}`;
  const tempInput = document.createElement('input');
  body.appendChild(tempInput);
  tempInput.setAttribute('value', text);
  tempInput.select();
  document.execCommand('copy');
  body.removeChild(tempInput);
};
