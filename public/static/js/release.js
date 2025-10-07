const expandBtn = document.getElementById("release_expand");
const description = document.getElementById("release_desc");

expandBtn.addEventListener("click", () => {
  if (description.classList.contains("line-clamp-4")) {
    expandBtn.textContent = "Свернуть...";
    description.classList.remove("line-clamp-4");
    description.style = "--max-h: 9999px;";
  } else {
    expandBtn.textContent = "Подробнее...";
    description.classList.add("line-clamp-4");
    description.style = "--max-h: 100px;";
  }
});
