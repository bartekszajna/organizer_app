import '../styles/index.scss';
import bodyHandler from './utilities/bodyHandler.js';
import checkErrorsFromServer from './utilities/checkErrorsFromServer';
import fetchQuotesToStorage from './utilities/fetchQuotesToStorage.js';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const loginButton = document.querySelector('button.button--open-modal');
const backButton = document.querySelector('.button--close-modal');

const modal = document.querySelector('.modal');
const firstModalEl = modal.querySelector('#username');
const lastModalEl = backButton;

const form = modal.querySelector('.login_form');
const usernameInput = form.querySelector('#username');
const usernameError = form.querySelector('#username-error');
const passwordInput = form.querySelector('#password');
const passwordError = form.querySelector('#password-error');
const inputsList = document.querySelectorAll('input');
const errorMessagesList = form.querySelectorAll('.error_message');

/* ---------- storage handling ------------- */

if (sessionStorage.getItem('login_username')) {
  usernameInput.value = sessionStorage.getItem('login_username');
}

usernameInput.addEventListener('input', (e) => {
  sessionStorage.setItem('login_username', usernameInput.value);
});

/* ----------------------------------------- */

if (!sessionStorage.getItem('quotes')) {
  fetchQuotesToStorage();
}

bodyHandler(body, links);

document.addEventListener('DOMContentLoaded', () => {
  checkErrorsFromServer(errorMessagesList, loginButton);
});

let isModalOpening = false;

// if we are already logged in, loginButton is swapped by PHP to a link to profile page
// when it is the case, we don't want to open any modal
if (loginButton) {
  loginButton.addEventListener('click', openModal);
}
backButton.addEventListener('click', closeModal);

function openModal() {
  isModalOpening = true;
  modal.classList.add('modal--open');
  loginButton.setAttribute('aria-expanded', 'true');

  modal.addEventListener('transitionend', focusOnFirstInput);
  modal.addEventListener('click', detectClickOutsideModal);
  document.addEventListener('keydown', detectEscapeKeyEvent);
  firstModalEl.addEventListener('focus', handleFirstModalEl);
  lastModalEl.addEventListener('focus', handleLastModalEl);
}

function focusOnFirstInput() {
  if (isModalOpening) {
    isModalOpening = false;
    firstModalEl.focus();
  }
}

function closeModal() {
  modal.classList.remove('modal--open');
  loginButton.focus();
  loginButton.setAttribute('aria-expanded', 'false');

  modal.removeEventListener('transitionend', focusOnFirstInput);
  modal.removeEventListener('click', detectClickOutsideModal);
  document.removeEventListener('keydown', detectEscapeKeyEvent);
  firstModalEl.removeEventListener('focus', handleFirstModalEl);
  lastModalEl.removeEventListener('focus', handleLastModalEl);
}

function detectClickOutsideModal(e) {
  if (!form.contains(e.target) && window.innerWidth >= 1024) {
    backButton.click();
  }
}

function detectEscapeKeyEvent(e) {
  if (e.code === 'Escape') {
    backButton.click();
  }
}

// hangleFirstListEl&handleLastListEl have one purpose -
// to keep focus inside of opened menu
function handleFirstModalEl(e) {
  e.target.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      lastModalEl.focus();
    }
  });
}

function handleLastModalEl(e) {
  e.target.addEventListener('keydown', (e) => {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      firstModalEl.focus();
    }
  });
}

// we turn default HTML5 validation off as a progressive enhancement
// people with their browser JS disabled will still take some benefit
// (not so much) from default HMTL validation
// but ideally, we want to take care of it in our own way
form.setAttribute('novalidate', 'true');

form.addEventListener('submit', checkEmptyInputValues);

function checkEmptyInputValues(e) {
  e.preventDefault();
  if (!usernameInput.value) {
    usernameInput.setAttribute('aria-invalid', 'true');
    usernameError.innerText = "Please provide user's name";
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

// we detect inserting some data into input so we clear out the corresponding
// error value (if any) to give little bit better UX to user
inputsList.forEach((input) =>
  input.addEventListener('input', clearErrorMessage)
);

function clearErrorMessage(e) {
  e.target.parentNode.lastElementChild.innerText = '';
}
