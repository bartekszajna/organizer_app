import hideBody from './hideBody.js';

// for every link redirecting us outside we need to make sure to pospone its action
// until the body hides smoothly, so we prevent their default behavior, store
// the address inside of navigationAddress variable and start hiding the body with transition
function linksHandler(body, links, navigationAddress) {
  links.forEach((link) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigationAddress = e.currentTarget.href;
      hideBody(body);
    })
  );
}

export default linksHandler;
