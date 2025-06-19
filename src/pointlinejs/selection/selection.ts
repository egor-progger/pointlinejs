import { injectable } from "inversify";

@injectable()
export class Selection {
    private selectedEl: HTMLElement;
    private readonly options = {
        selectedElBackgroundColor: "grey"
    };

    callbackToggleSelectNode: (selectedEl: HTMLElement) => void;

    selectFunc(nodeEl: EventTarget) {
        if (typeof this.selectedEl !== 'undefined') {
            $(this.selectedEl).css("background-color", "");
            this.selectedEl = undefined;
        } else {
            const nodeName = $(nodeEl).find(".node-name");
            nodeName.css("background-color", this.options.selectedElBackgroundColor);
            this.selectedEl = nodeName[0];
        }
        if (this.callbackToggleSelectNode) {
            this.callbackToggleSelectNode(this.selectedEl);
        }
    }

    get selectedElement() {
        return this.selectedEl;
    }

    get hasSelectedElement() {
        return this.selectedEl ? true : false;
    }

    clearSelection() {
        this.selectedEl = undefined;
    }
}