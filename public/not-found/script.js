const homeButton = document.getElementById('homeButton');
const backButton = document.getElementById('backButton');

homeButton.addEventListener('click', () => {
  window.location.href = '/';
});

backButton.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
});
