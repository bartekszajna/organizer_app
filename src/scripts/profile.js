import '../styles/profile.scss';
import showBody from './utilities/showBody.js';
import hideBody from './utilities/hideBody.js';
import validationPatterns from './utilities/validationPatterns.js';

// prevents FOUT issue
// fonts.ready IS NOT equal to DOMContentLoaded, which happens
// earlier, without custom fonts loaded
document.fonts.ready.then(showBody);

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

// local storage handling
const inputsForStorage = form.querySelectorAll('.local_storage_member');
const checkboxes = form.querySelectorAll('.radio_input');

// we check all items which
// we want to hold the value persistently
inputsForStorage.forEach((input) => {
  const inputName = input.getAttribute('id');

  // check whether there exists a value for given input
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

// then we add proper listener to adjust and
// update the storage value
// we have set "change" rather than "input" listener
// because one of the inputsForStorage is actually
// a checkbox fieldset, not the input itself
// so it doesn't have "input" one
inputsForStorage.forEach((input) => {
  const inputName = input.getAttribute('id');
  input.addEventListener('change', function (e) {
    localStorage.setItem(inputName, e.target.value);
  });
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

// this piece of code comes from
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// and solves the tricky issue of native vh unit
// changing its value dynamically due to the mobile browsers navigation
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
// now we have vh related to visible piece of our display (and not including
// unstable navigations which change during page scrolling)

// we want to check if server filled any errors into our messages bound to respective inputs
// if that is the case, open modal so the user can see them instantly
document.addEventListener('DOMContentLoaded', checkErrorsFromServer);

function checkErrorsFromServer() {
  let areThereAnyErrors = [...errorMessagesList].some(
    (error) => error.textContent
  );
  if (areThereAnyErrors) {
    addTaskButton.click();
  }
}

let isModalOpening = false;
let isMenuClosing = false;

hamburgerButton.addEventListener('click', navigationToggler);
firstListEl.addEventListener('keydown', handleFirstListEl);
lastListEl.addEventListener('keydown', handleLastListEl);
document.addEventListener('keydown', closeMenuWithEscape);
body.addEventListener('click', detectClickOutsideMenu);

// when we close the nav, we want to make sure
// that hamburger stays focused, the same state
// as when we opened this menu
navigation.addEventListener('transitionend', (e) => {
  if (isMenuClosing) {
    hamburgerButton.focus();
  }
  isMenuClosing = false;
});

// function evoked every time we click hamburger,
// whether to open or to close the menu
function navigationToggler(e) {
  // following animation script with nice smooth per-index
  // delayed transition is derived from:
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

// just to smoothly and gently fade all list items in when menu opened
// with customizable delay specific for every item
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
// to keep focus inside of opened menu and to create so-to-say
// looped state, where only entering the hamburger can break it
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

// self-explanatory
function closeMenuWithEscape(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.code === 'Escape') {
      hamburgerButton.click();
    }
  }
}

// to be able to close te menu by clicking outside of it
function detectClickOutsideMenu(e) {
  if (hamburgerButton.ariaExpanded === 'true') {
    if (e.target !== navigation && e.target !== hamburgerButton) {
      hamburgerButton.click();
    }
  }
}

addTaskButton.addEventListener('click', openModal);
modal.addEventListener('transitionend', focusOnFirstInput);
backButton.addEventListener('click', closeModal);
document.addEventListener('keydown', detectEscapeKeyEvent);
modal.addEventListener('click', detectClickOutsideModal);

function openModal() {
  isModalOpening = true;
  modal.classList.add('open');
  modal.classList.add('modal--open');
  addTaskButton.setAttribute('aria-expanded', 'true');
  firstModalEl.addEventListener('focus', handleFirstModalEl);
  lastModalEl.addEventListener('focus', handleLastModalEl);
}

//whenever we open the modal, we want the first
// input to receive focus
function focusOnFirstInput() {
  if (isModalOpening) {
    firstModalEl.focus();
    isModalOpening = false;
  }
}

function closeModal() {
  modal.classList.remove('modal--open');
  addTaskButton.focus();
  addTaskButton.setAttribute('aria-expanded', 'false');
  firstModalEl.removeEventListener('focus', handleFirstModalEl);
  lastModalEl.removeEventListener('focus', handleLastModalEl);
}

// to close the modal with escape button
function detectEscapeKeyEvent(e) {
  if (e.code === 'Escape') {
    backButton.click();
  }
}

// to be able to close te modal by clicking outside of it
// but only on desktops
// on mobiles due to form transparent sides this behavior
// proved to be counter-intuitive
function detectClickOutsideModal(e) {
  if (!form.contains(e.target) && window.innerWidth >= 1024) {
    backButton.click();
  }
}

// as above, both following functions are expected to
// hold the focus state inside modal and not to let
// it catch any focusable element outside of it
// while it is opened
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
  //deadline validation
  if (inputName === 'deadline') {
    if (input.value && !input.value.match(validationPatterns.deadlinePattern)) {
      deadlineError.innerText = 'Please keep the given format';
    } else {
      deadlineError.innerText = '';
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
