import '../styles/index.scss';

const loginButton = document.querySelector('.login-button');
const backButton = document.querySelector('.back-button');
const modal = document.querySelector('.modal');
const logo = document.querySelector('.logo');

loginButton.addEventListener('click', (e) => {
  modal.classList.add('modal-open');
  logo.style.zIndex = 2;
  modal.setAttribute('aria-label', 'modal open');
});

backButton.addEventListener('click', (e) => {
  modal.classList.remove('modal-open');
  logo.style.zIndex = 1;
  modal.setAttribute('aria-label', 'modal closed');
});
