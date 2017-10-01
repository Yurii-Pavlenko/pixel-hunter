const getElementFromTemplate = (stringWithMarkup) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = stringWithMarkup;
  return newElement;
};

export default getElementFromTemplate;
