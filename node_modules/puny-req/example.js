const req = require('./')

// Examples using: https://jsonplaceholder.typicode.com/

// GET request
req('https://jsonplaceholder.typicode.com/posts/1')
  .then(res => {
    console.log(res.headers, res.body)
  })
  .catch(console.log)

// POST request
req({
  url: 'https://jsonplaceholder.typicode.com/posts',
  json: {
    title: 'Hi',
    body: 'Friend',
    userId: 1
  }
})
  .then(res => {
    console.log(res.headers, res.body)
  })
  .catch(console.log)
