import '../styles/signup.scss';
import bodyHandler from './utilities/bodyHandler.js';
import validationPatterns from './utilities/validationPatterns.js';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const firstInputEl = document.querySelector('.input');

const form = document.querySelector('.signup_form');
const inputsList = form.querySelectorAll('.input');
const usernameInput = form.querySelector('#username');
const usernameError = form.querySelector('#username-error');
const emailInput = form.querySelector('#email');
const emailError = form.querySelector('#email-error');
const passwordInput = form.querySelector('#password');
const passwordError = form.querySelector('#password-error');
const repeatPasswordError = form.querySelector('#repeat-password-error');
const errorMessagesList = form.querySelectorAll('.error_message');

/* ---------- storage handling ------------- */

if (sessionStorage.getItem('signup_username')) {
  usernameInput.value = sessionStorage.getItem('signup_username');
}

if (sessionStorage.getItem('signup_email')) {
  emailInput.value = sessionStorage.getItem('signup_email');
}
usernameInput.addEventListener('input', (e) => {
  sessionStorage.setItem('signup_username', usernameInput.value);
});
emailInput.addEventListener('input', (e) => {
  sessionStorage.setItem('signup_email', emailInput.value);
});

/* ----------------------------------------- */

bodyHandler(body, links, firstInputEl, true);

// we turn default HTML5 validation off as a progressive enhancement
// people with their browser JS disabled will still take some benefit
// (not so much) from default HMTL validation
// but ideally, we want to take care of it in our own way
form.setAttribute('novalidate', 'true');

form.addEventListener('submit', generalValidation);

function generalValidation(e) {
  e.preventDefault();
  inputsList.forEach((input) => {
    validateInput(input, input.getAttribute('name'));
    // here we switch our aria-invalid value due to
    // existing any corresponding error message
    // p.error_message is always the last child in every input group
    input.setAttribute(
      'aria-invalid',
      !!input.parentNode.lastElementChild.innerText
    );
  });

  // and test them against being empty - since it is the condition
  // for the form to be submited
  const areMessagesEmpty = [...errorMessagesList].every(
    (message) => !message.innerText
  );

  // main purpose of this validation is to fill the corresponding
  // error messages (or not if valid inputs)
  // so after that we simply look for any errors left
  // if there is none, submit
  if (areMessagesEmpty) {
    sessionStorage.clear();
    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

// general solitary function for all types of input, kind of verbose
// but convenient to evoke it against every entered input field
function validateInput(input, inputName) {
  //username validation
  if (inputName === 'username') {
    input.value = input.value.trim();
    if (!input.value) {
      usernameError.innerText = 'Username is required';
    } else if (!input.value.trim().match(validationPatterns.usernamePattern)) {
      usernameError.innerText = 'Please make it 3-16 chars long';
      input.value = input.value.trim();
    } else {
      usernameError.innerText = '';
      input.value = input.value.trim();
    }
  }
  //email validation
  if (inputName === 'email') {
    if (!input.value) {
      emailError.innerText = 'Email is required';
    } else if (!input.value.match(validationPatterns.emailPattern)) {
      emailError.innerText = 'Invalid email address';
      input.value = input.value.trim();
    } else {
      emailError.innerText = '';
      input.value = input.value.trim();
    }
  }
  //password validation
  if (inputName === 'password' && input.getAttribute('id') === 'password') {
    if (!input.value) {
      passwordError.innerText = 'Password is required';
    } else if (!input.value.match(validationPatterns.passwordPattern)) {
      passwordError.innerText = 'Provide between 8 and 30 chars';
    } else {
      passwordError.innerText = '';
    }
  }

  //repeated password validation
  if (
    inputName === 'repeat_password' &&
    input.getAttribute('id') === 'repeat-password'
  ) {
    if (input.value !== passwordInput.value) {
      repeatPasswordError.innerText = 'Passwords do not match';
    } else if (!input.value) {
      repeatPasswordError.innerText = 'Please repeat your password';
    } else {
      repeatPasswordError.innerText = '';
    }
  }
}

// we detect inserting some data into input so we clear out the corresponding
// error value (if any) to give the user a little bit better UX
inputsList.forEach((input) =>
  input.addEventListener('input', clearErrorMessage)
);

function clearErrorMessage(e) {
  e.target.parentNode.lastElementChild.innerText = '';
}
