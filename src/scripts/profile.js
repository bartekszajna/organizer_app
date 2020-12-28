import '../styles/profile.scss';

const hamburgerButton = document.querySelector('.hamburger');
const navigation = document.querySelector('.list');
const body = document.querySelector('body');

hamburgerButton.addEventListener('click', (e) => {
  hamburgerButton.classList.toggle('hamburger-open');
  hamburgerButton.setAttribute(
    'aria-expanded',
    hamburgerButton.classList.contains('hamburger-open')
  );
  navigation.classList.toggle('list-open');
});

document.fonts.ready.then(showBody);

function showBody() {
  body.classList.add('visible');
}
