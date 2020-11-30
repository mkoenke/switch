URL = "http://localhost:3000"
console.log("hello")

fetch(`${URL}/users`)
    .then(r => r.json())
    .then(users => {
        console.log(users)
    })