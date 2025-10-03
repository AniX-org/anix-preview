document.getElementById("release_expand").addEventListener("click", () => {
  if (
    document.getElementById("release_desc").classList.contains("line-clamp-4")
  ) {
    document.getElementById("release_expand").textContent = "Свернуть...";
    document.getElementById("release_desc").classList.remove("line-clamp-4");
    document.getElementById("release_desc").style = "--max-h: 9999px;";
  } else {
    document.getElementById("release_expand").textContent = "Подробнее...";
    document.getElementById("release_desc").classList.add("line-clamp-4");
    document.getElementById("release_desc").style = "--max-h: 100px;";
  }
});
