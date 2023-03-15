console.log("잘 동작하긴함");
const deleteBtn = document.querySelectorAll("input");

deleteBtn.forEach((element) => {
  element.addEventListener("click", (event) => {
    event.target.parentNode;
    fetch("http://localhost:4000/board/delete");
  });
});
