import '../styles/account.scss';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');
const firstEl = document.querySelector('input');

const accountForm = document.querySelector('.account_form');
const usernameInput = accountForm.querySelector('#username');
const usernameError = accountForm.querySelector('#username-error');
const emailInput = accountForm.querySelector('#email');
const emailError = accountForm.querySelector('#email-error');
const passwordInput = accountForm.querySelector('#password');
const passwordError = accountForm.querySelector('#password-error');
const repeatPasswordInput = accountForm.querySelector('#repeat-password');
const repeatPasswordError = accountForm.querySelector('#repeat-password-error');

const deleteForm = document.querySelector('.delete_form');
const deleteInput = deleteForm.querySelector('#delete');
const deleteError = deleteForm.querySelector('#delete-account-error');

const allInputsList = document.querySelectorAll('input');
const inputsList = accountForm.querySelectorAll('input');
const messagesList = accountForm.querySelectorAll('p.error_message');

const updateButton = accountForm.querySelector('.button_primary');
const deleteButton = deleteForm.querySelector('.button_delete');

document.fonts.ready.then(showBody);

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

function showBody() {
  body.classList.add('body--visible');
  //addTransitionToLabels();
}

function hideBody() {
  body.classList.remove('body--visible');
}

// function addTransitionToLabels() {
//   inputLabels.forEach((label) => {
//     label.classList.add('transition');
//   });
// }
////////////////////////////////////////////

// we provide our own client-side JS-based validation
// but if anyone turned their JS down, they will
// stay with default HTML5 validation through input attributes
function turnOffDefaultFormsValidation(...forms) {
  forms.forEach((form) => {
    form.setAttribute('novalidate', 'true');
  });
}

turnOffDefaultFormsValidation(accountForm, deleteForm);

// by defult submission buttons are to be disabled,
// they enable only when some change in any input was detected
function disableFormButtons(...buttons) {
  buttons.forEach((button) => button.setAttribute('disabled', true));
}

disableFormButtons(updateButton, deleteButton);

// disabled to begin with so need to be re-enabled eventually
function enableFormButtons(...buttons) {
  buttons.forEach((button) => button.removeAttribute('disabled'));
}

allInputsList.forEach((input) => input.addEventListener('input', enableInputs));

function enableInputs(e) {
  // grab all surrounding inputs from this form
  const siblingInputsList = e.target.form.querySelectorAll('input');
  const doInputsHaveAnyValue = [...siblingInputsList].some(
    (input) => input.value
  );
  // if our target input (or any other inside this form) has any value
  // enable submission button
  if (e.target.value || doInputsHaveAnyValue) {
    enableFormButtons(e.target.form.lastElementChild);
  } else {
    //if not (all inputs of this form are empty) disable submission button
    disableFormButtons(e.target.form.lastElementChild);
    repeatPasswordError.innerText = '';
  }
}

// object storing all regex patterns used throughout the site
const regexPatterns = {
  usernamePattern: '^[a-zA-Z0-9_ ]{3,12}$',
  emailPattern: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
  passwordPattern: '[a-zA-Z0-9_ ]{8,30}',
  titlePattern: '^.{1,50}$',
  deadlinePattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
};

accountForm.addEventListener('submit', generalValidation);
deleteForm.addEventListener('submit', generalValidation);

function generalValidation(e) {
  e.preventDefault();
  const siblingInputsList = e.target.querySelectorAll('input');
  siblingInputsList.forEach((input) => {
    validateInput(input, input.getAttribute('name'));
  });
  const formMessages = e.target.querySelectorAll('p.error_message');
  const areMessagesEmpty = [...formMessages].every(
    (message) => message.innerText === ''
  );
  if (areMessagesEmpty) {
    //submit the form
    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

function validateInput(input, inputName) {
  if (input.value) {
    if (inputName === 'username') {
      input.value = input.value.trim();
      if (!input.value.match(regexPatterns.usernamePattern)) {
        usernameError.innerText = 'Please make it 3-12 chars long';
      }
    }
    if (inputName === 'email') {
      if (!input.value.match(regexPatterns.emailPattern)) {
        emailError.innerText = 'Invalid email address';
      }
    }
    if (inputName === 'password') {
      repeatPasswordError.innerText = '';
      if (!repeatPasswordInput.value) {
        repeatPasswordError.innerText = 'Passwords do not match';
      }
      if (!input.value.match(regexPatterns.passwordPattern)) {
        passwordError.innerText = 'Provide between 8 and 30 chars';
      }
    }
    if (inputName === 'repeat-password') {
      if (input.value !== passwordInput.value) {
        repeatPasswordError.innerText = 'Passwords do not match';
      }
    }
    if (inputName === 'delete') {
      if (!input.value.match(regexPatterns.passwordPattern)) {
        deleteError.innerText = 'You provided the wrong password';
      }
    }
  }
}

allInputsList.forEach((input) =>
  input.addEventListener('input', function (e) {
    e.target.parentNode.lastElementChild.innerText = '';
  })
);
