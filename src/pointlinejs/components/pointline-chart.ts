
import { ChartConfigType } from '@pointlinejs/vendor/treant/Treant';
import { PointlineJS } from '@pointlinejs/pointlinejs';
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('pointline-chart')
export class PointlineChart extends LitElement {
    @property({ type: String }) chartId: string = null;
    @property({ type: Object }) chartConfig: ChartConfigType = null;
    private pointlineJS = new PointlineJS(this.chartConfig);

    override render() {
        return html`<div .id=${this.chartId}></div>`;
    }

    override updated() {
        this.pointlineJS.draw();
    }
}
