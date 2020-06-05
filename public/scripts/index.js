const buttonSearch = document.querySelector("#page-home main a")
const buttonClose = document.querySelector("#modal .header a")
const modal = document.querySelector("#modal")

buttonSearch.addEventListener("click", () => {
    modal.classList.remove("hide")
} )

buttonClose.addEventListener("click", () => {
    modal.classList.add("hide")
} )