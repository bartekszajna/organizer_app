import showBody from './showBody.js';
import hideBody from './hideBody.js';

// to invoke once and set up all neccessary listeners
// inputToFocus is needed only on pages with directly accessed forms
// to immediately give them focus state
// pageRefreshed is to prevent transitionend event from focusing on firstEl
// over and over again (which is the case since every transition inside modal/form
// is effectively also transition on body)
function bodyHandler(body, links, inputToFocus, pageRefreshed) {
  // prevents FOUT issue
  // fonts.ready IS NOT equal to DOMContentLoaded, which happens
  // earlier, without custom fonts loaded
  document.fonts.ready.then(() => {
    showBody(body);
  });

  let addressToNavigate = '';

  // for every link redirecting us outside we need to make sure to postpone its action
  // until the body hides smoothly, so we prevent their default behavior, store
  // the address inside of addressTonavigate variable and start hiding the body with transition
  links.forEach((link) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      addressToNavigate = e.currentTarget.href;
      hideBody(body);
    })
  );

  // ... so now we wait for finishing of body hiding (hence the transitionend event)
  // to finally swap window.location.href with our pre-saved location taken from
  // link clicked before, which causes immediate redirection to given page
  body.addEventListener('transitionend', (e) => {
    if (pageRefreshed) {
      inputToFocus.focus();
      pageRefreshed = false;
    }
    if (addressToNavigate) {
      window.location.href = addressToNavigate;
    }
    addressToNavigate = '';
  });
}

export default bodyHandler;
