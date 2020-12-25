import '../styles/signup.scss';
const inputLabels = document.querySelectorAll('.input > label');

window.addEventListener('load', addTransitionToLabels);

addTransitionToLabels = function () {
  inputLabels.forEach((label) => {
    label.style.transition = 'transform 0.35s ease';
  });
};
