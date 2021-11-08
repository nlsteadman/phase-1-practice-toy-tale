document.addEventListener("DOMContentLoaded", () => {
  //debugger
  let container = document.getElementById("toy-collection");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  let addToy = false
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block"
      toyFormContainer.addEventListener('submit', event => {
        event.preventDefault()
        postToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none"
    }


  });

  function getToys() {
    return fetch('http://localhost:3000/toys')
    .then (response => response.json())
    .then (toys => toys.forEach(toy => renderToys(toy)))
  }

  function postToy(toy_data) {
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        "name": toy_data.name.value,
        "image": toy_data.image.value,
        "likes": 0
      })
    })
    .then(response => response.json())
    .then((objToy) => {
    
    let newToy = renderToys(objToy)
    container.appendChild(newToy);
    })
  }
  function likes(event) {
    //debugger
    event.preventDefault()
    let newLikes = parseInt(event.target.previousElementSibling.innerText) + 1

    fetch(`http://localhost:3000/toys/${event.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept : "application/json"
      },
      body: JSON.stringify({
        "likes": newLikes
      })
    })
    .then(response => response.json())
    .then((likeObj => {
      event.target.previousElementSibling.innerText = `${newLikes} Likes`;
    }))
  }
  function renderToys(toy) {
    //debugger
    const toyCard = document.createElement("div");
    const toyName = document.createElement("h2");
    const toyImg = document.createElement("img");
    const toyLikes = document.createElement("p");
    const likeBttn = document.createElement("button");

    toyName.innerText = toy.name
    toyCard.className = "card"
    toyImg.src = toy.image
    toyImg.className = "toy-avatar"
    toyLikes.innerText = `${toy.likes} Likes`
    likeBttn.className = "like-btn"
    likeBttn.id = toy.id
    likeBttn.innerText = "like"
    likeBttn.addEventListener("click", (event) => {
      console.log(event.target.dataset);
      likes(event)
    })

    toyCard.append(toyName, toyImg, toyLikes, likeBttn);
    container.append(toyCard);
  }
  
  getToys();
})