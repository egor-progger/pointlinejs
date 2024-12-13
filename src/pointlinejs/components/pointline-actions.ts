import { PointlineJS } from "@pointlinejs/pointlinejs";
import { injectable } from "inversify";
import { BUTTON_CALLBACK, BUTTON_TYPE } from "./button-callback";
import { MDCDialog, MDCDialogCloseEvent } from '@material/dialog';
import { AddNodeDialogTemplate } from "./add-node-dialog";

interface ButtonAction {
    id: string;
    text: string;
    type: BUTTON_TYPE;
    callback: (ev: MouseEvent) => void;
}

class ButtonItem implements ButtonAction {
    callback: (ev: MouseEvent) => void;
    id: string;
    text: string;
    type: BUTTON_TYPE;

    constructor(
        id: string,
        text: string,
        type: BUTTON_TYPE,
        callback?: (ev: MouseEvent) => void,
    ) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.callback = callback;
    }

    getCallback(event: MouseEvent) {
        return this.callback(event);
    }

    initCallback(callback: (ev: MouseEvent) => void) {
        this.callback = callback;
    }
}


const defaultButtons: ButtonItem[] = [
    new ButtonItem(
        'addNodeBtn', 'Add child node to selected', BUTTON_TYPE.ADD_BUTTON
    ),
];

export type PointlineAction = {
    pointlineActionId: string;
}

@injectable()
export class PointlineActions {
    private selectedEl: HTMLElement;
    private readonly options = {
        selectedElBackgroundColor: "grey"
    };
    private actionsDiv: HTMLElement;
    private pointlineJS: PointlineJS;

    constructor() {
    }

    async init(idDiv: string, pointlineJS: PointlineJS) {
        this.actionsDiv = $('#' + idDiv)[0];
        this.pointlineJS = pointlineJS;
        $('.node').each((index, element) => {
            $(element).click(
                () => this.selectFunc(element)
            );
        });
        for (var key in defaultButtons) {
            var btnData = defaultButtons[key];
            if (btnData.type === BUTTON_TYPE.ADD_BUTTON) {
                this.createAddNodeModal(this.actionsDiv);
                btnData.initCallback(() => this.showAddNodeModal(this.pointlineJS, this.selectedEl));
            }
            var btn = document.createElement('button');
            btn.setAttribute("id", btnData.id);
            btn.innerHTML = btnData.text;
            btn.addEventListener("click", (event) => btnData.getCallback(event));
            if (btnData.type === BUTTON_TYPE.ADD_BUTTON) {
                if (!this.selectedEl) {
                    btn.setAttribute('disabled', 'true');
                }
            }
            this.actionsDiv.append(btn);
        }
    }

    selectFunc(nodeEl: EventTarget) {
        if (this.selectedEl !== null) {
            $(this.selectedEl).css("background-color", "");
        }
        const nodeName = $(nodeEl).find(".node-name");
        nodeName.css("background-color", this.options.selectedElBackgroundColor);
        this.selectedEl = nodeName[0];
        if (this.selectedEl) {
            this.enabledAddNodeButton();
        }
    }

    enabledAddNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.removeAttribute('disabled');
    }

    createAddNodeModal(parentElement: HTMLElement) {
        const modalWin = document.createElement('div');
        modalWin.innerHTML = AddNodeDialogTemplate;
        parentElement.appendChild(modalWin);
        return modalWin;
    }

    showAddNodeModal(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
        const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
        dialog.open();
        dialog.listen('MDCDialog:closed', (event: MDCDialogCloseEvent) => {
            if (event.detail.action === 'accept') {
                BUTTON_CALLBACK.ADD_BUTTON(pointlineJS, selectedEl);
            }
        })
    }
}