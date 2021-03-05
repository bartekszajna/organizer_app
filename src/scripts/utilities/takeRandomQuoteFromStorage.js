import getRandomNumber from './getRandomNumber.js';

function takeRandomQuoteFromStorage(content, author) {
  if (sessionStorage.getItem('quotes')) {
    const objects = JSON.parse(sessionStorage.getItem('quotes'));
    const objectsLength = objects.length;
    const randomNumber = getRandomNumber(objectsLength);

    content.innerText = `"${objects[randomNumber].content}"`;
    author.innerText = `${objects[randomNumber].author}`;
  }
}

export default takeRandomQuoteFromStorage;
