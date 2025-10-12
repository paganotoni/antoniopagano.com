document.querySelectorAll(".copy-btn").forEach(button => {
  button.addEventListener("click", () => {
    const codeBlock = button.previousElementSibling;
    const code = codeBlock.textContent.trim();

    navigator.clipboard.writeText(code).then(function() {
      const copyIcon = button.querySelector(".copy-icon:not(.done)");
      const doneIcon = button.querySelector(".copy-icon.done");

      copyIcon.classList.add("hidden");
      doneIcon.classList.remove("hidden");

      setTimeout(() => {
        copyIcon.classList.remove("hidden");
        doneIcon.classList.add("hidden");
      }, 1000);
    }, function(err) {
      console.error('Could not copy text: ', err);
    });
  })
});
