import '../styles/index.scss';

let isModalOpening = false;

const body = document.querySelector('body');
const loginButton = document.querySelector('.login-button');
const backButton = document.querySelector('.back-button');
const modal = document.querySelector('.modal');
const firstEl = modal.querySelector('#username');
const lastEl = modal.querySelector('.back-button');
const form = document.querySelector('.login-form');

hideBody();

document.fonts.ready.then(function () {
  showBody();
});

function hideBody() {
  body.style.visibility = 'hidden';
}

function showBody() {
  body.style.visibility = 'visible';
}

loginButton.addEventListener('click', openModal);

modal.addEventListener('transitionend', focusOnFirstInput);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

document.addEventListener('keydown', detectEscapeKeyEvent);

function openModal() {
  isModalOpening = true;
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

function detectClickOutsideModal(e) {
  if (!form.contains(e.target)) {
    backButton.click();
  }
}

function detectEscapeKeyEvent(e) {
  if (e.code === 'Escape') {
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

function focusOnFirstInput() {
  if (isModalOpening) {
    isModalOpening = false;
    firstEl.focus();
  }
}
