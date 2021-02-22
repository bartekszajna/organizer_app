import '../styles/tasks.scss';

const body = document.querySelector('body');
const links = document.querySelectorAll('a');

const tasksList = document.querySelector('.tasks_list');
const tasksView = document.querySelector('.tasks_view');
const tasks = document.querySelectorAll('.task');
const priorityIndicators = document.querySelectorAll('.task_priority');

const verticalInput = document.querySelector('.button--vertical');
const horizontalInput = document.querySelector('.button--horizontal');

// matchMedia object to handle looks of the tasks list in case of resizing
// better, much more efficient way than listening for resize event
// with probable exception for throttling or debouncing
let mediaQueryObject = window.matchMedia('(min-width: 1024px)');

mediaQueryObject.addEventListener('change', function (e) {
  if (!e.matches) {
    verticalInput.click();
  }
});

document.fonts.ready.then(showBody);

let address = '';
body.addEventListener('transitionend', (e) => {
  if (address) {
    window.location.href = address;
  }
  address = '';
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
  tasksList.classList.remove('tasks_list--multicolumn');
  tasks.forEach((task) => task.classList.remove('task-multicolumn'));
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

function showBody() {
  body.classList.add('body--visible');
}

function hideBody() {
  body.classList.remove('body--visible');
}
