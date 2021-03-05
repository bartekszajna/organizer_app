function checkErrorsFromServer(messages, buttonToClick) {
  let areThereAnyErrors = [...messages].some((message) => message.textContent);
  if (areThereAnyErrors) {
    buttonToClick.click();
  }
}
export default checkErrorsFromServer;
