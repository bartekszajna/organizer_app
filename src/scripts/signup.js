import '../styles/signup.scss';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');
const inputLabels = document.querySelectorAll('.input > label');
const firstEl = document.querySelector('input');

let address = '';
let pageRefreshed = true;
body.addEventListener('transitionend', (e) => {
  if (pageRefreshed) {
    firstEl.focus();
    pageRefreshed = false;
  }
  if (address) {
    window.location.href = address;
  }
  address = '';
});

links.forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();
    address = e.currentTarget.href;
    hideBody();
  })
);

document.fonts.ready.then(showBody);

function showBody() {
  body.classList.add('visible');
  addTransitionToLabels();
}

function hideBody() {
  body.classList.remove('visible');
}

function addTransitionToLabels() {
  inputLabels.forEach((label) => {
    label.classList.add('transition');
  });
}
