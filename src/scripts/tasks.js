import '../styles/tasks.scss';
import showBody from './utilities/showBody.js';
import hideBody from './utilities/hideBody.js';

// prevents FOUT issue
// fonts.ready IS NOT equal to DOMContentLoaded, which happens
// earlier, without custom fonts loaded
document.fonts.ready.then(showBody);

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const tasksList = document.querySelector('.tasks_list');
const tasksView = document.querySelector('.tasks_view');
const tasks = document.querySelectorAll('.task');
const priorityIndicators = document.querySelectorAll('.task_priority');

const verticalInput = document.querySelector('.button--vertical');
const horizontalInput = document.querySelector('.button--horizontal');

// matchMedia object to handle looks of the tasks list in case of resizing.
// Better, much more efficient way than listening for resize event
// with probable exception for throttling or debouncing
let mediaQueryObject = window.matchMedia('(min-width: 1024px)');

mediaQueryObject.addEventListener('change', function (e) {
  if (!e.matches) {
    verticalInput.click();
  }
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
body.addEventListener('transitionend', (e) => {
  if (navigationAddress) {
    window.location.href = navigationAddress;
  }
  navigationAddress = '';
});

// color of task priority indicators handling
// based on server-side information stored inside
// every dataset attribute
priorityIndicators.forEach((indicator) => {
  const priority = indicator.dataset.priority;
  if (priority === '1') {
    indicator.classList.add('task_priority--low');
  } else if (priority === '2') {
    indicator.classList.add('task_priority--medium');
  } else {
    indicator.classList.add('task_priority--high');
  }
});

// tasks view handling
if (verticalInput.checked) {
  tasksList.classList.remove('tasks_list--multicolumn');
  tasks.forEach((task) => task.classList.remove('task--multicolumn'));
}
if (horizontalInput.checked) {
  tasksList.classList.add('tasks_list--multicolumn');
  tasks.forEach((task) => task.classList.add('task--multicolumn'));
}

tasksView.addEventListener('change', (e) => {
  if (verticalInput.checked) {
    tasksList.classList.remove('tasks_list--multicolumn');
    tasks.forEach((task) => task.classList.remove('task--multicolumn'));
  }
  if (horizontalInput.checked) {
    tasksList.classList.add('tasks_list--multicolumn');
    tasks.forEach((task) => task.classList.add('task--multicolumn'));
  }
});
