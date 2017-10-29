import getElementFromTemplate from "./get-element-from-html";

export default class AbstractView {

  get template() {
    throw new Error(`You need to define template for viewing`);
  }

  render() {
    return getElementFromTemplate(this.template);
  }

  bind() {

  }

  get element() {
    if (!this._element) {
      this._element = this.render();
      this.bind();
    }
    return this._element;
  }

}
