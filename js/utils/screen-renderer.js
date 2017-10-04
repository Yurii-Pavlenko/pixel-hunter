const mainCentral = document.querySelector(`.central`);

// Function showing screens
const showScreen = (screen) => {
  mainCentral.innerHTML = ``;
  mainCentral.appendChild(screen);
};

export default showScreen;
