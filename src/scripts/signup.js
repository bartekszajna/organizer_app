import '../styles/signup.scss';
import showBody from './utilities/showBody.js';
import hideBody from './utilities/hideBody.js';
import validationPatterns from './utilities/validationPatterns.js';

// prevents FOUT issue
// fonts.ready IS NOT equal to DOMContentLoaded, which happens
// earlier, without custom fonts loaded
document.fonts.ready.then(showBody);

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

// storage handling
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
// pageRefreshed is to prevent transitionend event from focusing on firstEl
// over and over again (which is the case since every transition inside modal
// is effectively also transition on body)
let pageRefreshed = true;
body.addEventListener('transitionend', (e) => {
  if (pageRefreshed) {
    firstInputEl.focus();
    pageRefreshed = false;
  }
  if (navigationAddress) {
    window.location.href = navigationAddress;
  }
  navigationAddress = '';
});

// we turn default HTML5 validation off as a progressive enhancement
// people with their browser JS disabled will still take some benefit
// (not so much) from default HMTL validation
// but ideally, we want to take care of it in our own way
form.setAttribute('novalidate', 'true');

form.addEventListener('submit', generalValidation);

//function generalValidation(input, pattern) {
//check if empty input value
// if so, fill out corresponding error message
// otherwise clear the error message
//check if input value matches the given pattern
// if no, fill out corresponding error message
// otherwise clear the error message
// after all input being checked, check if any error message paragraph contains any content
// if so, prevent submission
// otherwise submit

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
      usernameError.innerText = 'Please make it 3-12 chars long';
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
    inputName === 'repeat-password' &&
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
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
