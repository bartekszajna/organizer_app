import '../styles/tasks.scss';

const tasksView = document.querySelector('.tasks-view');
const verticalInput = document.querySelector('#vertical');
const horizontalInput = document.querySelector('#horizontal');
const tasksList = document.querySelector('.tasks-list');
const tasks = document.querySelectorAll('.task');
const links = document.querySelectorAll('a');
const body = document.querySelector('body');

document.fonts.ready.then(showBody);

let address = '';
body.addEventListener('transitionend', (e) => {
  if (address) {
    window.location.href = address;
  }
  address = '';
  removeBackdropFromBody();
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

// verticalInput.addEventListener('click', (e) => {
//   if (horizontalInput.checked == 'checked') {
//     horizontalInput.removeAttribute('checked');
//     verticalInput.setAttribute('checked', 'checked');
//   }
// });
// horizontalInput.addEventListener('click', (e) => {
//   if (verticalInput.checked == 'checked') {
//     verticalInput.removeAttribute('checked');
//     horizontalInput.setAttribute('checked', 'checked');
//   }
// });

function showBody() {
  body.classList.add('visible');
}

function hideBody() {
  body.classList.remove('visible');
}

function removeBackdropFromBody() {
  body.style.backdropFilter = 'none';
}
