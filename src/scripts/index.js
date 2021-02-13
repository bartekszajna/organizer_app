import '../styles/index.scss';

let isModalOpening = false;
const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const loginButton = document.querySelector('.login-button');
const backButton = document.querySelector('.back-button');

const modal = document.querySelector('.modal');
const firstEl = modal.querySelector('#username');
const lastEl = modal.querySelector('.back-button');

const form = modal.querySelector('.login-form');
const usernameInput = form.querySelector('#username');
const usernameError = form.querySelector('#username-error');
const passwordInput = form.querySelector('#password');
const passwordError = form.querySelector('#password-error');
const inputsList = document.querySelectorAll('input');

//let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
//document.documentElement.style.setProperty('--vh', `${vh}px`);
// window.addEventListener('resize', () => {
//   // We execute the same script as before
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
//   console.log(vh);
// });

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

loginButton.addEventListener('click', openModal);

modal.addEventListener('transitionend', focusOnFirstInput);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

document.addEventListener('keydown', detectEscapeKeyEvent);

function showBody() {
  body.classList.add('visible');
}

function hideBody() {
  body.classList.remove('visible');
}

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
form.setAttribute('novalidate', 'true');

form.addEventListener('submit', checkEmptyInputValues);

function checkEmptyInputValues(e) {
  e.preventDefault();
  if (!usernameInput.value) {
    usernameInput.setAttribute('aria-invalid', 'true');
    usernameError.innerText = "You need to provide user's name";
  } else {
    usernameError.innerText = '';
  }
  if (!passwordInput.value) {
    passwordInput.setAttribute('aria-invalid', 'true');
    passwordError.innerText = 'You need to enter the password';
  } else {
    passwordError.innerText = '';
  }
  if (usernameInput.value && passwordInput.value) {
    // simple e.target.submit() won't work in this case
    // because our submit button has a name="submit"
    // which somewhat overshadows this method
    // best solution would be to simply change that name attribute
    // to something else but I wanted to try this hacky solution

    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

inputsList.forEach((input) =>
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
