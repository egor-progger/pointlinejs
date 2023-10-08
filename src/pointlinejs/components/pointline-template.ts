
import { PointlineJS } from '@pointlinejs/PointlineJS';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pointline-chart')

export class PointlineChart extends LitElement {
    @property({ type: String }) chartId: string;
    @property({ type: PointlineJS }) pointlineJS: PointlineJS;

    override render() {
        return html`<div .id=${this.chartId}></div>`;
    }

    override updated() {
        this.pointlineJS.draw();
    }
}