import { computePosition, offset, flip, shift, arrow, Placement, MiddlewareData } from '@floating-ui/dom';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('pl-tooltip')
export class Tooltip extends LitElement {
    static override styles = css`:host {
  display: none;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
  background: #222;
  color: white;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
  
  #arrow {
    position: absolute;
    background: #222;
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    }
}`;

    // Declare reactive properties
    @property()
    text = 'tooltip';

    @state()
    protected isShow = false;

    constructor(text: string) {
        super();
        this.text = text;
    }

    // Render the UI as a function of component state
    override render() {
        return html`<div>${this.text}<div id="arrow"></div></div>`;
    }

    arrowElement: HTMLElement;

    async show(linkedElement: HTMLElement) {
        if (!this.isShow) {
            this.style.display = 'block';
            this.isShow = true;
            await this.updateComplete;
            this.arrowElement = this.shadowRoot.getElementById('arrow');
            this.updateTooltip(linkedElement, this.arrowElement);
        }
    }

    hide() {
        this.style.display = '';
        this.isShow = false;
    }

    private async updateTooltip(linkedElement: HTMLElement, arrowElement: HTMLElement): Promise<void> {
        const { x, y, placement, middlewareData } = await computePosition(linkedElement, this, {
            placement: 'top',
            middleware: [
                offset(6),
                flip(),
                shift({ padding: 5 }),
                arrow({ element: arrowElement }),
            ],
        });
        this.calcTooltipPosition(x, y, placement, middlewareData);
    }

    private calcTooltipPosition(x: number, y: number, placement: Placement, middlewareData: MiddlewareData) {
        Object.assign(this.style, {
            left: `${x}px`,
            top: `${y}px`,
        });

        // Accessing the data
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
        }[placement.split('-')[0]];

        Object.assign(this.arrowElement.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
        });
    }
}