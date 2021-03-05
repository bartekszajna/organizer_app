import '../styles/profile.scss';
import bodyHandler from './utilities/bodyHandler.js';
import checkErrorsFromServer from './utilities/checkErrorsFromServer';
import resizeVhUnit from './utilities/resizeVhUnit.js';
import takeRandomQuoteFromStorage from './utilities/takeRandomQuoteFromStorage.js';
import validationPatterns from './utilities/validationPatterns.js';

const html = document.querySelector('html');
const body = document.querySelector('body');
const links = document.querySelectorAll('.list_link');
const listItems = document.querySelectorAll('.list_item');

const navigation = document.querySelector('.list');
const hamburgerButton = document.querySelector('.hamburger');
const firstListEl = hamburgerButton;
const lastListEl = navigation.querySelector('.list_link--last');

const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('.button--open-modal');
const backButton = modal.querySelector('.button--close-modal');
const firstModalEl = modal.querySelector('#title');
const lastModalEl = backButton;

const form = modal.querySelector('.addtask_form');
const inputsList = form.querySelectorAll('.input_group > .input');
const errorMessagesList = form.querySelectorAll(
  '.input_group > .error_message'
);
const titleError = form.querySelector('#title-error');
const deadlineError = form.querySelector('#deadline-error');

const quoteContent = document.querySelector('.quote_container--text');
const quoteAuthor = document.querySelector('.quote_container--author');

/* ---------- storage handling ------------- */

const inputsForStorage = form.querySelectorAll('.local_storage_member');
const checkboxes = form.querySelectorAll('.radio_input');

inputsForStorage.forEach((input) => {
  const inputName = input.getAttribute('id');

  if (localStorage.getItem(inputName)) {
    let storageValue = localStorage.getItem(inputName);
    if (inputName === 'fieldset') {
      const checkedOne = [...checkboxes].find(
        (checkbox) => checkbox.value === storageValue
      );
      checkedOne.checked = 'checked';
    } else {
      input.value = storageValue;
    }
  }
});

inputsForStorage.forEach((input) => {
  const inputName = input.getAttribute('id');
  input.addEventListener('change', function (e) {
    localStorage.setItem(inputName, e.target.value);
  });
});

/* ----------------------------------------- */

// provide user with random quote from sessionStorage with every page refresh
takeRandomQuoteFromStorage(quoteContent, quoteAuthor);

bodyHandler(body, links);

resizeVhUnit();

document.addEventListener('DOMContentLoaded', () => {
  checkErrorsFromServer(errorMessagesList, addTaskButton);
});

let isModalOpening = false;
let isMenuClosing = false;

hamburgerButton.addEventListener('click', navigationToggler);
firstListEl.addEventListener('keydown', handleFirstListEl);
lastListEl.addEventListener('keydown', handleLastListEl);
document.addEventListener('keydown', closeMenuWithEscape);
body.addEventListener('click', detectClickOutsideMenu);

navigation.addEventListener('transitionend', (e) => {
  if (isMenuClosing) {
    hamburgerButton.focus();
  }
  isMenuClosing = false;
});

function navigationToggler(e) {
  // following animation is derived from:
  // https://www.youtube.com/watch?v=gXkqy0b4M5g&t=1702s
  listItems.forEach(animateMenuItems);

  e.stopPropagation();
  hamburgerButton.classList.toggle('hamburger--open');
  hamburgerButton.setAttribute(
    'aria-expanded',
    hamburgerButton.classList.contains('hamburger--open')
  );
  navigation.classList.toggle('list--open');
  isMenuClosing = !isMenuClosing;
}

function animateMenuItems(item, index) {
  if (item.style.animation) {
    item.style.opacity = 1;
    item.style.animation = '';
  } else {
    item.style.opacity = 0;
    item.style.animation = `animateMenuItems 0.8s ease-out 0.${index}s forwards`;
  }
}

// hangleFirstListEl&handleLastListEl have one purpose -
// to keep focus inside of opened menu
function handleFirstListEl(e) {
  if (hamburgerButton.getAttribute('aria-expanded') === 'true') {
    if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      lastListEl.focus();
    }
  }
}

function handleLastListEl(e) {
  if (hamburgerButton.getAttribute('aria-expanded') === 'true') {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      firstListEl.focus();
    }
  }
}

function closeMenuWithEscape(e) {
  if (hamburgerButton.getAttribute('aria-expanded') === 'true') {
    if (e.code === 'Escape') {
      hamburgerButton.click();
    }
  }
}

function detectClickOutsideMenu(e) {
  if (hamburgerButton.getAttribute('aria-expanded') === 'true') {
    if (e.target !== navigation && e.target !== hamburgerButton) {
      hamburgerButton.click();
    }
  }
}

addTaskButton.addEventListener('click', openModal);
backButton.addEventListener('click', closeModal);

function openModal() {
  isModalOpening = true;

  modal.addEventListener('transitionend', focusOnFirstInput);
  document.addEventListener('keydown', detectEscapeKeyEvent);
  modal.addEventListener('click', detectClickOutsideModal);

  if (window.innerWidth > 520 && window.innerWidth < 768) {
    html.classList.add('modal--opened-m');
    modal.classList.add('show--modal-m');
  } else {
    html.classList.add('modal--opened-xs');
    modal.classList.add('show--modal-xs');
  }

  addTaskButton.setAttribute('aria-expanded', 'true');

  firstModalEl.addEventListener('focus', handleFirstModalEl);
  lastModalEl.addEventListener('focus', handleLastModalEl);
}

function focusOnFirstInput() {
  if (isModalOpening) {
    firstModalEl.focus();
    isModalOpening = false;
  }
}

function closeModal() {
  html.classList.remove('modal--opened-xs');
  html.classList.remove('modal--opened-m');
  modal.classList.remove('show--modal-xs');
  modal.classList.remove('show--modal-m');

  addTaskButton.focus();
  addTaskButton.setAttribute('aria-expanded', 'false');

  modal.removeEventListener('transitionend', focusOnFirstInput);
  document.removeEventListener('keydown', detectEscapeKeyEvent);
  modal.removeEventListener('click', detectClickOutsideModal);
  firstModalEl.removeEventListener('focus', handleFirstModalEl);
  lastModalEl.removeEventListener('focus', handleLastModalEl);
}

function detectEscapeKeyEvent(e) {
  if (e.code === 'Escape') {
    backButton.click();
  }
}

function detectClickOutsideModal(e) {
  if (!form.contains(e.target) && window.innerWidth >= 1024) {
    backButton.click();
  }
}

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
    localStorage.clear();
    Object.getPrototypeOf(e.target).submit.call(e.target);
  }
}

function validateInput(input, inputName) {
  //task title validation
  if (inputName === 'title') {
    if (!input.value.trim()) {
      titleError.innerText = 'Task title is required';
      input.value = input.value.trim();
    } else if (!input.value.trim().match(validationPatterns.titlePattern)) {
      titleError.innerText = 'Please make it 50 chars at most';
      input.value = input.value.trim();
    } else {
      titleError.innerText = '';
    }
  }
  // rudimentary deadline validation, not for real month-validation
  // and past dates (although technically these are possible)
  if (inputName === 'deadline') {
    let dateArray = input.value.split('-');

    if (input.value && !input.value.match(validationPatterns.deadlinePattern)) {
      deadlineError.innerText = 'Please keep the given format';
    } else if (dateArray[1] > 12 || dateArray[2] > 31) {
      deadlineError.innerText = 'The date looks invalid';
    } else {
      deadlineError.innerText = '';
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
