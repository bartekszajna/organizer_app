import '../styles/profile.scss';

let isModalOpening = false;
let isMenuClosing = false;

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const navigation = document.querySelector('.list');
const hamburgerButton = document.querySelector('.hamburger');
const firstListEl = hamburgerButton;
const lastListEl = document.querySelector('.list-item:last-child a');

const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('.addtask-button');
const backButton = document.querySelector('.back-button');
const firstEl = document.querySelector('#title');
const lastEl = backButton;

const form = document.querySelector('.addtask-form');
const inputsList = form.querySelectorAll('input:not([type=radio])');
const titleInput = form.querySelector('#title');
const titleError = form.querySelector('#title-error');
const deadlineInput = form.querySelector('#deadline');
const deadlineError = form.querySelector('#deadline-error');

const messagesList = form.querySelectorAll('p.error-message');

firstListEl.addEventListener('keydown', handleFirstListEl);

lastListEl.addEventListener('keydown', handleLastListEl);

document.addEventListener('keydown', closeMenuWithEscape);

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

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

body.addEventListener('click', detectClickOutsideMenu);

document.addEventListener('keydown', detectEscapeKeyEvent);

function openModal() {
  isModalOpening = true;
  modal.classList.add('open');
  modal.classList.add('modal-open');
  addTaskButton.setAttribute('aria-expanded', 'true');
  firstEl.addEventListener('focus', handleFirstEl);
  lastEl.addEventListener('focus', handleLastEl);
  //body.style.backgroundImage = 'linear-gradient(#95bdef, #95bdef)';
}

function closeModal() {
  modal.classList.remove('modal-open');
  addTaskButton.focus();
  addTaskButton.setAttribute('aria-expanded', 'false');
  firstEl.removeEventListener('focus', handleFirstEl);
  lastEl.removeEventListener('focus', handleLastEl);
  //body.style.backgroundImage = 'linear-gradient(to top, #95bdef 70%, #558cd2)';
}

function detectClickOutsideModal(e) {
  if (!form.contains(e.target) && window.innerWidth >= 1024) {
    backButton.click();
  }
}

function detectClickOutsideMenu(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.target !== navigation && e.target !== hamburgerButton) {
      hamburgerButton.click();
    }
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
////////////////////////////////////

form.setAttribute('novalidate', 'true');

const regexPatterns = {
  usernamePattern: '^[a-zA-Z0-9_ ]{3,12}$',
  emailPattern: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
  passwordPattern: '[a-zA-Z0-9_ ]{8,30}',
  titlePattern: '^.{1,50}$',
  deadlinePattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
};

form.addEventListener('submit', generalValidation);

function generalValidation(e) {
  e.preventDefault();
  console.log('validation works');
  inputsList.forEach((input) => {
    validateInput(input, input.getAttribute('name'));
  });

  // if ([...messagesList].every((message) => message.innerText === '')) {
  //   Object.getPrototypeOf(e.target).submit.call(e.target);
  // }
}

function validateInput(input, inputName) {
  //task title validation
  if (inputName === 'title') {
    if (!input.value.trim()) {
      titleError.innerText = 'Task title is required';
      input.value = input.value.trim();
    } else if (!input.value.trim().match(regexPatterns.titlePattern)) {
      titleError.innerText = 'Please make it 50 chars at most';
      input.value = input.value.trim();
    } else {
      titleError.innerText = '';
    }
  }
  //deadline validation
  if (inputName === 'deadline') {
    if (input.value && !input.value.match(regexPatterns.deadlinePattern)) {
      deadlineError.innerText = 'Please keep the given format';
    } else {
      deadlineError.innerText = '';
    }
  }
}

inputsList.forEach((input) =>
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
