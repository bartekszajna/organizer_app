import '../styles/index.scss';
import showBody from './utilities/showBody.js';
import hideBody from './utilities/hideBody.js';

// prevents FOUT issue
// fonts.ready IS NOT equal to DOMContentLoaded, which happens
// earlier, without custom fonts loaded
document.fonts.ready.then(showBody);

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const loginButton = document.querySelector('.button--open-modal');
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
const errorMessages = form.querySelectorAll('.error_message');

// storage handling
if (sessionStorage.getItem('login_username')) {
  usernameInput.value = sessionStorage.getItem('login_username');
}

usernameInput.addEventListener('input', (e) => {
  sessionStorage.setItem('login_username', usernameInput.value);
});

// for every link redirecting us outside we need to make sure to pospone its action
// until the body hides smoothly, so we prevent their default behavior, store
// the address inside of navigationAddress variable and start hiding the body with transition
links.forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigationAddress = e.currentTarget.href;
    hideBody();
  })
);

// contents of this viarable determine whether we clicked <a> link redirecting
// us to other page or not. If that is the case, it will contain the url
let navigationAddress = '';

// ... so now we wait for finishing of body hiding (hence the transitionend event)
// to finally swap window.location.href with our pre-saved location taken from
// link clicked before, which causes immediate redirection to given page
body.addEventListener('transitionend', (e) => {
  if (navigationAddress) {
    window.location.href = navigationAddress;
  }
  navigationAddress = '';
});

// simple flag to denote opening the modal moment
let isModalOpening = false;

loginButton.addEventListener('click', openModal);

modal.addEventListener('transitionend', focusOnFirstInput);

backButton.addEventListener('click', closeModal);

modal.addEventListener('click', detectClickOutsideModal);

document.addEventListener('keydown', detectEscapeKeyEvent);

function openModal() {
  isModalOpening = true;
  modal.classList.add('open');
  modal.classList.add('modal--open');
  loginButton.setAttribute('aria-expanded', 'true');
  firstModalEl.addEventListener('focus', handleFirstModalEl);
  lastModalEl.addEventListener('focus', handleLastModalEl);
}

// we want to check if server filled any errors into our messages bound to respective inputs
// if that is the case, open modal so the user can see them instantly
document.addEventListener('DOMContentLoaded', checkErrorsFromServer);

function checkErrorsFromServer() {
  let areThereAnyErrors = [...errorMessages].some((error) => error.textContent);
  if (areThereAnyErrors) {
    loginButton.click();
  }
}

// without checking the isModalOpening flag, this eventListener fired
// and focused on this input over and over (apparently detecting smoothness of input focusing every time)
// nevertheless, its purpose is to bring automatic focus to first input element
// inside modal but only when opening it
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
  firstModalEl.removeEventListener('focus', handleFirstModalEl);
  lastModalEl.removeEventListener('focus', handleLastModalEl);
}

// we check innerWidth for we want this behavior to occur only on desktops
// on mobiles form is not 100% wide (with transparent sides) and clicking on those sides of form
// (i.e. to close the virtual keyboard) made users actually closing the whole modal
function detectClickOutsideModal(e) {
  if (!form.contains(e.target) && window.innerWidth >= 1024) {
    backButton.click();
  }
}

// function to enable escape-key-based modal closing feature
function detectEscapeKeyEvent(e) {
  if (e.code === 'Escape') {
    backButton.click();
  }
}

// handleFirstModalEl & handleLastModalEl are supposed to keep modal focused between first and last
// focusable elements, therefore creating the feeling of infinite tab loop when modal opened
// in both directions -> hence  the e.shiftKey condition
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

// we detect inserting some data into input so we clear out the corresponding
// error value (if any) to give little bit better UX to user
inputsList.forEach((input) =>
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
