import '../styles/tasks.scss';

const tasksView = document.querySelector('.tasks-view');
const verticalInput = document.querySelector('#vertical');
const horizontalInput = document.querySelector('#horizontal');
const tasksList = document.querySelector('.tasks-list');
const tasks = document.querySelectorAll('.task');
const links = document.querySelectorAll('a');
const body = document.querySelector('body');
const priorityIndicators = document.querySelectorAll('.priority');

console.log(priorityIndicators);

document.fonts.ready.then(showBody);

let address = '';
body.addEventListener('transitionend', (e) => {
  if (address) {
    window.location.href = address;
  }
  address = '';
  removeBackdropFromBody();
});

priorityIndicators.forEach((indicator) => {
  const priority = indicator.dataset.priority;
  if (priority === '1') {
    indicator.classList.add('priority-low');
  } else if (priority === '2') {
    indicator.classList.add('priority-medium');
  } else {
    indicator.classList.add('priority-high');
  }
});

links.forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();
    address = e.currentTarget.href;
    hideBody();
  })
);

if (verticalInput.checked) {
  tasksList.classList.remove('tasks-list-multicolumn');
  tasks.forEach((task) => task.classList.remove('task-multicolumn'));
}
if (horizontalInput.checked) {
  tasksList.classList.add('tasks-list-multicolumn');
  tasks.forEach((task) => task.classList.add('task-multicolumn'));
}

tasksView.addEventListener('change', (e) => {
  if (verticalInput.checked) {
    tasksList.classList.remove('tasks-list-multicolumn');
    tasks.forEach((task) => task.classList.remove('task-multicolumn'));
  }
  if (horizontalInput.checked) {
    tasksList.classList.add('tasks-list-multicolumn');
    tasks.forEach((task) => task.classList.add('task-multicolumn'));
  }
});

function showBody() {
  body.classList.add('visible');
}

function hideBody() {
  body.classList.remove('visible');
}

function removeBackdropFromBody() {
  body.style.backdropFilter = 'none';
}
