import '../styles/index.scss';

let flag = true;

const loginButton = document.querySelector('.login-button');
const backButton = document.querySelector('.back-button');
const modal = document.querySelector('.modal');
const firstEl = modal.querySelector('#username');
const lastEl = modal.querySelector('.back-button');
const form = document.querySelector('.login-form');
const logo = document.querySelector('.logo');

// window.addEventListener('load', () => {
//   modal.classList.add('open');
// });

loginButton.addEventListener('click', openModal);

document.addEventListener('keydown', detectEscapeEvent);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

modal.addEventListener('transitionend', (e) => {
  if (flag) {
    flag = false;
    firstEl.focus();
  }
});

function openModal() {
  modal.classList.add('open');
  modal.classList.add('modal-open');
  loginButton.setAttribute('aria-expanded', 'true');
  firstEl.addEventListener('focus', handleFirstEl);
  lastEl.addEventListener('focus', handleLastEl);
}

function closeModal() {
  modal.classList.remove('modal-open');
  loginButton.focus();
  loginButton.setAttribute('aria-expanded', 'false');
  firstEl.removeEventListener('focus', handleFirstEl);
  lastEl.removeEventListener('focus', handleLastEl);
}

function detectEscapeEvent(e) {
  if (e.code === 'Escape') {
    backButton.click();
  }
}

function detectClickOutsideModal(e) {
  if (!form.contains(e.target)) {
    backButton.click();
  }
}

function handleFirstEl(e) {
  e.target.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      lastEl.focus();
    }
  });
}

function handleLastEl(e) {
  e.target.addEventListener('keydown', (e) => {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      firstEl.focus();
    }
  });
}
