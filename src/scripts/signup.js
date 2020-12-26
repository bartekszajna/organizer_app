import '../styles/signup.scss';
const inputLabels = document.querySelectorAll('.input > label');

window.addEventListener('load', addTransitionToLabels);

function addTransitionToLabels() {
  inputLabels.forEach((label) => {
    label.style.transition = 'transform 0.5s ease';
  });
}
