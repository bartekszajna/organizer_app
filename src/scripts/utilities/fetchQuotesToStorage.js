function fetchQuotesToStorage() {
  const url =
    'https://api.quotable.io/quotes?tags=inspirational&maxLength=80&limit=100';

  fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      else return Promise.reject(`Error: ${response.status}`);
    })
    .then((json) => {
      const trimmedObjects = json.results.map((obj) => {
        for (const prop in obj) {
          if (prop !== 'author' && prop !== 'content') {
            delete obj[prop];
          }
        }
        return obj;
      });
      sessionStorage.setItem('quotes', JSON.stringify(trimmedObjects));
    });
}

export default fetchQuotesToStorage;
