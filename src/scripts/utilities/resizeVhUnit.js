// this piece of code comes from
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// and solves the tricky issue of native vh unit
// changing its value dynamically due to the mobile browsers navigation

function resizeVhUnit() {
  // initial setting, for page load
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
}

// now we have vh related to visible piece of our screen (and not including
// unstable navigations which fold/unfold during page scrolling)

export default resizeVhUnit;
