import { LitElement, html, css } from 'lit-element';

export class ProgressBar extends LitElement {
    static properties = {
        percentage: { type: Number, reflect: true },
        theme: { type: String, reflect: true },
        color1: { type: String, reflect: true }, 
        color2: { type: String, reflect: true }  
    };

    constructor() {
        super();
        this.percentage = 0;
        this.theme = '#003C71';
        this._targetPercentage = 0;
        this.color1 = ''; 
        this.color2 = ''; 
    }

    firstUpdated() {
        // Limita el valor inicial entre 0 y 100
        let initial = Number(this.percentage);
        if (isNaN(initial) || initial < 0) initial = 0;
        if (initial > 100) initial = 100;
        this._targetPercentage = initial;
        this.percentage = 0;
        this._iniciarCarga();
    }

    _iniciarCarga() {
        let current = 0;
        const meta = this._targetPercentage;
        const interval = setInterval(() => {
        if (current >= meta) {
            clearInterval(interval);
            this.percentage = meta;
            this.dispatchEvent(new CustomEvent('progreso-completado'));
        } else {
            current += 1;
            this.percentage = current;
            this.dispatchEvent(new CustomEvent('progreso-actualizado', {
            detail: { porcentaje: current }
            }));
        }
        }, 30);
    }

    updated(changedProps) {
        if (changedProps.has('percentage')) {
        // Limita el valor de percentage entre 0 y 100 si cambia dinámicamente
        if (this.percentage < 0) this.percentage = 0;
        if (this.percentage > 100) this.percentage = 100;
        }
        if (changedProps.has('theme')) {
        const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(this.theme);
        if (!isValidHex) {
            console.warn('Color de tema no válido. Se usará el color por defecto.');
            this.theme = '#003C71';
        }
        }
    }

    get gradientColors() {
        // Valida si los colores son hexadecimales válidos
        const isValidHex = c => /^#([0-9A-F]{3}){1,2}$/i.test(c);
        const default1 = '#006935';
        const default2 = '#e63329';
        const c1 = isValidHex(this.color1) ? this.color1 : default1;
        const c2 = isValidHex(this.color2) ? this.color2 : default2;
        return `linear-gradient(90deg, ${c1}, ${c2})`;
    }

    static styles = css`
        :host {
            display: block;
            font-family: Arial, Roboto, sans-serif;
            margin: 8px 0;
            --color-complete: #6aa788;
            --color-theme: #003C71;
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
            background-image: linear-gradient(90deg, #6aa788, #f68d91);
        }

        .bar[aria-valuenow="100"] {
            background-color: #6aa788;
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
                    style="
                        width: ${this.percentage}%;
                        background-color: ${this.percentage === 100 
                            ? 'var(--color-complete)' 
                            : 'var(--color-theme)'};
                        background-image: ${this.percentage === 100 ? 'none' : this.gradientColors};
                    "
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

customElements.define('espe-progress-bar', ProgressBar);