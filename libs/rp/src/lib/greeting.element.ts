export class GreetingElement extends HTMLElement {
  public static observedAttributes = ['title'];

  attributeChangedCallback() {
    this.innerHTML = `<h1>Welcome to Rumble Studio ${this.title}!</h1>`;
  }
}

customElements.define('rs-greeting', GreetingElement);
