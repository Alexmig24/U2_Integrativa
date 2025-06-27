import { LitElement, html, css } from 'lit-element';

export class EspeProgressBar extends LitElement {
  static properties = {
    percentage: { type: Number, reflect: true },
    theme: { type: String, reflect: true }
  };

  constructor() {
    super();
    this.percentage = 0;
    this.theme = '#003C71';
  }

  firstUpdated() {
    this._iniciarCarga();
  }

  _iniciarCarga() {
    let current = 0;
    const meta = this.percentage > 100 ? 100 : this.percentage;
    const interval = setInterval(() => {
      if (current >= meta) {
        clearInterval(interval);
        this.dispatchEvent(new CustomEvent('progreso-completado'));
      } else {
        current += 1;
        this.percentage = current;
        this.dispatchEvent(new CustomEvent('progreso-actualizado', {
          detail: { porcentaje: current }
        }));
      }
    }, 30); // velocidad de animación (ajustable)
  }

  updated(changedProps) {
    if (changedProps.has('theme')) {
      const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(this.theme);
      if (!isValidHex) {
        console.warn('Color de tema no válido. Se usará el color por defecto.');
        this.theme = '#003C71';
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, Roboto, sans-serif;
      margin: 8px 0;
    }

    .container {
      width: 100%;
      background-color: #eee;
      border-radius: 8px;
      height: 24px;
      overflow: hidden;
      box-shadow: inset 0 0 3px #999;
    }

    .bar {
      height: 100%;
      width: 0%;
      color: white;
      text-align: center;
      line-height: 24px;
      font-size: 0.9rem;
      transition: width 0.4s ease-in-out;
      background-image: linear-gradient(90deg, #006935, #e63329);
    }

    .bar[aria-valuenow="100"] {
      background-color: #FFD700;
    }

    .status-message {
      margin-top: 6px;
      font-size: 0.85rem;
      color: #444;
    }
  `;

  render() {
    return html`
      <div
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.percentage}">
        <div
          class="bar"
          style="width: ${this.percentage}%; background-color: ${this.percentage === 100 ? '#FFD700' : this.theme};"
          aria-valuenow="${this.percentage}">
          ${this.percentage}%
        </div>
      </div>

      <div class="status-message">
        ${this.percentage < 100 ? 'Cargando...' : 'Carga completa ✅'}
      </div>
    `;
  }
}

customElements.define('espe-progress-bar', EspeProgressBar);