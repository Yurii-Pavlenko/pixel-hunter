const mainCentral = document.querySelector(`.central`);

// Function showing screens
const renderScreen = (screen) => {
  mainCentral.innerHTML = ``;
  mainCentral.appendChild(screen);
};

export default renderScreen;
