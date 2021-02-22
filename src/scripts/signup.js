import '../styles/signup.scss';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const firstEl = document.querySelector('input');

const form = document.querySelector('.signup-form');
const inputsList = form.querySelectorAll('input');
const usernameInput = form.querySelector('#username');
const usernameError = form.querySelector('#username-error');
const emailInput = form.querySelector('#email');
const emailError = form.querySelector('#email-error');
const passwordInput = form.querySelector('#password');
const passwordError = form.querySelector('#password-error');
const repeatPasswordInput = form.querySelector('#repeat-password');
const repeatPasswordError = form.querySelector('#repeat-password-error');
const messagesList = form.querySelectorAll('p.error-message');

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

let address = '';
let pageRefreshed = true;
body.addEventListener('transitionend', (e) => {
  if (pageRefreshed) {
    firstEl.focus();
    pageRefreshed = false;
  }
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
  body.classList.add('body--visible');
}

function hideBody() {
  body.classList.remove('body--visible');
}

// function addTransitionToLabels() {
//   inputLabels.forEach((label) => {
//     label.classList.add('transition');
//   });
// }

// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   checkEmptyInputValues(e);
// });

// function checkEmptyInputValues(e) {
//   if (!usernameInput.value) {
//     usernameError.innerText = 'Username is required';
//   } else {
//     usernameError.innerText = '';
//   }
//   if (!emailInput.value) {
//     emailError.innerText = 'Email address is required';
//   } else {
//     emailError.innerText = '';
//   }
//   if (!passwordInput.value) {
//     passwordError.innerText = 'Password is required';
//   } else {
//     passwordError.innerText = '';
//   }
//   if (!repeatPasswordInput.value) {
//     repeatPasswordError.innerText = 'Repeated password is required';
//   } else {
//     repeatPasswordError.innerText = '';
//   }
// }

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
//}

form.setAttribute('novalidate', 'true');

const regexPatterns = {
  usernamePattern: '^[a-zA-Z0-9_ ]{3,12}$',
  emailPattern: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
  passwordPattern: '[a-zA-Z0-9_ ]{8,30}',
};

form.addEventListener('submit', generalValidation);

function generalValidation(e) {
  e.preventDefault();
  inputsList.forEach((input) => {
    validateInput(input, input.getAttribute('name'));
  });

  if ([...messagesList].every((message) => message.innerText === '')) {
    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

function validateInput(input, inputName) {
  //username validation
  if (inputName === 'username') {
    input.value = input.value.trim();
    if (!input.value) {
      usernameError.innerText = 'Username is required';
    } else if (!input.value.trim().match(regexPatterns.usernamePattern)) {
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
    } else if (!input.value.match(regexPatterns.emailPattern)) {
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
    } else if (!input.value.match(regexPatterns.passwordPattern)) {
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

inputsList.forEach((input) =>
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
