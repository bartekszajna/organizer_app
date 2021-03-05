import '../styles/tasks.scss';
import bodyHandler from './utilities/bodyHandler.js';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const tasksViewFieldset = document.querySelector('.tasks_view');

const tasksList = document.querySelector('.tasks_list');
const tasksView = document.querySelector('.tasks_view');
const tasks = document.querySelectorAll('.task');
const priorityIndicators = document.querySelectorAll('.task_priority');

const verticalInput = document.querySelector('.button--vertical');
const horizontalInput = document.querySelector('.button--horizontal');

/* ---------- storage handling ------------- */

if (localStorage.getItem('tasks_view')) {
  const tasksViewId = localStorage.getItem('tasks_view');
  tasksViewFieldset.querySelector(`#${tasksViewId}`).checked = true;
}

tasksViewFieldset.addEventListener('change', (e) => {
  const tasksViewId = e.target.getAttribute('id');
  localStorage.setItem('tasks_view', tasksViewId);
});

/* ----------------------------------------- */

// matchMedia object to handle looks of the tasks list in case of resizing.
// Better, much more efficient way than listening for resize event
// with probable exception for throttling or debouncing
let mediaQueryObject = window.matchMedia('(min-width: 1024px)');

mediaQueryObject.addEventListener('change', function (e) {
  if (!e.matches) {
    verticalInput.click();
  }
});

bodyHandler(body, links);

// color of task priority indicators handling
// based on server-side information stored inside
// every dataset attribute
priorityIndicators.forEach(setColorToIndicator);

function setColorToIndicator(indicator) {
  const priority = indicator.dataset.priority;
  if (priority === '1') {
    indicator.classList.add('task_priority--low');
  } else if (priority === '2') {
    indicator.classList.add('task_priority--medium');
  } else {
    indicator.classList.add('task_priority--high');
  }
}

/* -------------- tasks view handling --------------- */

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
