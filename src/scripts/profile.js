import '../styles/profile.scss';

const hamburgerButton = document.querySelector('.hamburger');
const navigation = document.querySelector('.list');
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const backButton = document.querySelector('.back-button');
const addTaskButton = document.querySelector('.addtask-button');

hamburgerButton.addEventListener('click', (e) => {
  hamburgerButton.classList.toggle('hamburger-open');
  hamburgerButton.setAttribute(
    'aria-expanded',
    hamburgerButton.classList.contains('hamburger-open')
  );
  navigation.classList.toggle('list-open');
});

document.fonts.ready.then(showBody);

function showBody() {
  body.classList.add('visible');
}

addTaskButton.addEventListener('click', openModal);

backButton.addEventListener('click', closeModal);

function openModal() {
  modal.classList.add('open');
  modal.classList.add('modal-open');
  addTaskButton.setAttribute('aria-expanded', 'true');
}

function closeModal() {
  modal.classList.remove('modal-open');
  addTaskButton.focus();
  addTaskButton.setAttribute('aria-expanded', 'false');
}
