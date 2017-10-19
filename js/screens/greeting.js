import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";

export default (data) => {
  const greeting = getElementFromTemplate(`
 <div class="greeting central--blur">
    <div class="greeting__logo"><img src="img/logo_big.png" width="201" height="89" alt="Pixel Hunter"></div>
    <h1 class="greeting__asterisk">*</h1>
    <div class="greeting__challenge">${data.greeting.description}</div>
    <div class="greeting__continue"><span><img src="img/arrow_right.svg" width="64" height="64" alt="Next"></span></div>
  </div>
`);

  const greetingContinue = greeting.querySelector(`.greeting__continue`);

  greetingContinue.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.greeting.jumpTo.next(data));
  });

  return greeting;
};
