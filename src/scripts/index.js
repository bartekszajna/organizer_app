import '../styles/index.scss';

const loginButton = document.querySelector('.login-button');
const backButton = document.querySelector('.back-button');
const modal = document.querySelector('.modal');
const firstEl = modal.querySelector('#username');
const lastEl = modal.querySelector('.back-button');
const form = document.querySelector('.login-form');
const logo = document.querySelector('.logo');

loginButton.addEventListener('click', openModal);

document.addEventListener('keydown', detectEscapeEvent);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

let flag = false;

function openModal(e) {
  //modal.style.display = 'flex';
  modal.classList.add('modal-open');
  form.classList.add('login-form-open');

  // modal.addEventListener('transitionend', () => {
  //   if (flag) {
  //     flag = true;
  //     firstEl.focus();
  //   }
  // });
  logo.style.zIndex = 1;
  loginButton.setAttribute('aria-expanded', 'true');
  firstEl.addEventListener('focus', handleFirstEl);
  lastEl.addEventListener('focus', handleLastEl);
}

function closeModal(e) {
  modal.classList.remove('modal-open');
  logo.style.zIndex = 0;
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
