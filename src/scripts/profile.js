import '../styles/profile.scss';

let isModalOpening = false;
let isMenuClosing = false;

const links = document.querySelectorAll('a');
const hamburgerButton = document.querySelector('.hamburger');
const navigation = document.querySelector('.list');
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const backButton = document.querySelector('.back-button');
const addTaskButton = document.querySelector('.addtask-button');
const firstEl = document.querySelector('#title');
const lastEl = backButton;
const form = document.querySelector('.addtask-form');
const firstListEl = hamburgerButton;
const lastListEl = document.querySelector('.list-item:last-child a');

firstListEl.addEventListener('keydown', handleFirstListEl);

lastListEl.addEventListener('keydown', handleLastListEl);

document.addEventListener('keydown', closeMenuWithEscape);

function closeMenuWithEscape(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.code === 'Escape') {
      hamburgerButton.click();
    }
  }
}
navigation.addEventListener('transitionend', (e) => {
  if (isMenuClosing) {
    hamburgerButton.focus();
  }
  isMenuClosing = false;
});

function handleFirstListEl(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      lastListEl.focus();
    }
  }
}

function handleLastListEl(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      firstListEl.focus();
    }
  }
}

let address = '';
body.addEventListener('transitionend', (e) => {
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
}

function hideBody() {
  body.classList.remove('visible');
}

hamburgerButton.addEventListener('click', (e) => {
  hamburgerButton.classList.toggle('hamburger-open');
  hamburgerButton.setAttribute(
    'aria-expanded',
    hamburgerButton.classList.contains('hamburger-open')
  );
  navigation.classList.toggle('list-open');
  isMenuClosing = !isMenuClosing;
});

addTaskButton.addEventListener('click', openModal);

modal.addEventListener('transitionend', focusOnFirstInput);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

document.addEventListener('keydown', detectEscapeKeyEvent);

function openModal() {
  isModalOpening = true;
  modal.classList.add('open');
  modal.classList.add('modal-open');
  addTaskButton.setAttribute('aria-expanded', 'true');
  firstEl.addEventListener('focus', handleFirstEl);
  lastEl.addEventListener('focus', handleLastEl);
}

function closeModal() {
  modal.classList.remove('modal-open');
  addTaskButton.focus();
  addTaskButton.setAttribute('aria-expanded', 'false');
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
