import '../styles/account.scss';
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

const accountForm = document.querySelector('.account_form');
const usernameError = accountForm.querySelector('#username-error');
const emailError = accountForm.querySelector('#email-error');
const passwordInput = accountForm.querySelector('#password');
const passwordError = accountForm.querySelector('#password-error');
const repeatPasswordInput = accountForm.querySelector('#repeat-password');
const repeatPasswordError = accountForm.querySelector('#repeat-password-error');

const deleteForm = document.querySelector('.delete_form');
const deleteError = deleteForm.querySelector('#delete-account-error');

const inputsList = document.querySelectorAll('.input');
const updateButton = accountForm.querySelector('.button_primary');
const deleteButton = deleteForm.querySelector('.button_delete');

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

// we have two separate forms (updating and deleting)
// so we need to turn it off twice, for both of them
function turnOffDefaultFormsValidation(...forms) {
  forms.forEach((form) => {
    form.setAttribute('novalidate', 'true');
  });
}

turnOffDefaultFormsValidation(accountForm, deleteForm);

// by defult submission buttons are to be disabled,
// they enable only when some change in any input was detected
// seems to be better UX for user
function disableFormButtons(...buttons) {
  buttons.forEach((button) => button.setAttribute('disabled', true));
}

disableFormButtons(updateButton, deleteButton);

// since disabled to begin with, they need to be re-enabled eventually
function enableFormButtons(...buttons) {
  buttons.forEach((button) => button.removeAttribute('disabled'));
}

// to conditionally enable/disable corresponding form submission button,
// we need to keep checking the presence of any value in
// any input field in that form
// unfortunately we cannot simply listen for all form inputs at once
// so we attach input event listener to every one of them
inputsList.forEach((input) =>
  input.addEventListener('input', formButtonsActivation)
);

function formButtonsActivation(e) {
  // grab all surrounding inputs from this form
  const siblingInputsList = e.target.form.querySelectorAll('.input');

  // check if any of them has at least some value entered
  const doInputsHaveAnyValue = [...siblingInputsList].some(
    (input) => input.value
  );
  // if our target input (or any other inside this form)
  // has any value - enable submission button
  if (doInputsHaveAnyValue) {
    enableFormButtons(e.target.form.lastElementChild);
  } else {
    //if not (all inputs of this form are empty) disable submission button
    disableFormButtons(e.target.form.lastElementChild);
  }
}

// two different forms, so two separate submit events
accountForm.addEventListener('submit', generalValidation);
deleteForm.addEventListener('submit', generalValidation);

function generalValidation(e) {
  e.preventDefault();

  // since we have two unrelated forms, we have to grab only
  // the ones inside this particular validated form
  const siblingInputsList = e.target.querySelectorAll('.input');

  // so we test every input against validateInput function (below)
  siblingInputsList.forEach((input) => {
    validateInput(input, input.getAttribute('name'));

    // here we switch our aria-invalid value due to
    // existing any corresponding error message
    // p.error_message is always the last child in every input group
    input.setAttribute(
      'aria-invalid',
      !!input.parentNode.lastElementChild.innerText
    );
  });

  // we need to grab error messages only inside of this form
  const formErrorMessages = e.target.querySelectorAll('.error_message');

  // and test them against being empty - since it is the condition
  // for the form to be submited
  const areMessagesEmpty = [...formErrorMessages].every(
    (message) => !message.innerText
  );

  // main purpose of this validation is to fill the corresponding
  // error messages (or not if valid inputs)
  // so after that we simply look for any errors left
  // if there is none, submit
  if (areMessagesEmpty) {
    // and now, since the programmatic JS form submission doesn't include the submit button
    // name and value pair (which is essential on server-side to differentiate which form - update, or delete
    // was submited), we need to send that pair some other way.
    // I went with dynamic creating of the hidden input with those attributes to emulate
    // default submit button behavior, but we probably also could do something with FormData and AJAX calls
    // like: (and it worked)
    // let FD = new FormData(e.target);
    // FD.append(e.target.lastElementChild.getAttribute('name'), e.target.lastElementChild.getAttribute('value));
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', 'account.php');
    // xhr.send(FD);
    // window.location.reload();

    const hiddenInput = document.createElement('input');
    // until we append the hidden input, the last child of form
    // is always submit button with desirable attributes
    hiddenInput.setAttribute(
      'name',
      e.target.lastElementChild.getAttribute('name')
    );
    hiddenInput.setAttribute(
      'value',
      e.target.lastElementChild.getAttribute('value')
    );
    hiddenInput.setAttribute('type', 'hidden');
    e.target.appendChild(hiddenInput);
    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

// general solitary function for all types of input, kind of verbose
// but convenient to evoke it against every entered input field
function validateInput(input, inputName) {
  if (input.value) {
    // username validation
    if (inputName === 'username') {
      input.value = input.value.trim();
      if (!input.value.match(validationPatterns.usernamePattern)) {
        usernameError.innerText = 'Please make it 3-12 chars long';
      }
    }
    // email validation
    if (inputName === 'email') {
      if (!input.value.match(validationPatterns.emailPattern)) {
        emailError.innerText = 'Invalid email address';
      }
    }
    //password validation
    if (inputName === 'password') {
      repeatPasswordError.innerText = '';
      if (!repeatPasswordInput.value) {
        repeatPasswordError.innerText = 'Passwords do not match';
      }
      if (!input.value.match(validationPatterns.passwordPattern)) {
        passwordError.innerText = 'Provide between 8 and 30 chars';
      }
    }
    // repeated password validation
    if (inputName === 'repeat_password') {
      if (input.value !== passwordInput.value) {
        repeatPasswordError.innerText = 'Passwords do not match';
      }
    }
    //delete account validation
    if (inputName === 'delete') {
      if (!input.value.match(validationPatterns.passwordPattern)) {
        deleteError.innerText = 'You provided the wrong password';
      }
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
