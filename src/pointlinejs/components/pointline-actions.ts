import { PointlineJS } from "@pointlinejs/pointlinejs";
import { injectable } from "inversify";
import { BUTTON_CALLBACK, BUTTON_TYPE } from "./button-callback";
import { MDCDialog, MDCDialogCloseEvent } from '@material/dialog';
import { DialogTemplate } from "./dialog-template";

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
}


const defaultButtons: ButtonItem[] = [
    new ButtonItem(
        'addNodeBtn', 'Add child node to selected', BUTTON_TYPE.ADD_BUTTON
    ),
    new ButtonItem(
        'exportNodeStructureBtn', 'Export nodes to JSON', BUTTON_TYPE.EXPORT_TO_JSON_BUTTON
    )
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
        const dialogElements: HTMLElement[] = [];
        this.actionsDiv = $('#' + idDiv)[0];
        this.pointlineJS = pointlineJS;
        $('.node').each((index, element) => {
            $(element).click(
                () => this.selectFunc(element)
            );
        });
        for (var key in defaultButtons) {
            var btnData = defaultButtons[key];
            const modalId = `${btnData.id}-dialog`;
            var btn = document.createElement('button');
            btn.setAttribute("id", btnData.id);
            btn.innerHTML = btnData.text;
            if (btnData.type === BUTTON_TYPE.ADD_BUTTON) {
                dialogElements.push(this.createDivWithContentForModal(this.actionsDiv, modalId));
                btn.addEventListener("click", () => this.showAddNodeModal(this.pointlineJS, this.selectedEl, modalId));
            }
            if (btnData.type === BUTTON_TYPE.EXPORT_TO_JSON_BUTTON) {
                dialogElements.push(this.createDivWithContentForModal(this.actionsDiv, modalId));
                btn.addEventListener("click", () => this.showExportJSONModal(this.pointlineJS, modalId));
            }
            if (btnData.type === BUTTON_TYPE.ADD_BUTTON) {
                if (!this.selectedEl) {
                    btn.setAttribute('disabled', 'true');
                }
            }
            this.actionsDiv.append(btn);
        }
        dialogElements.forEach((dialog) => this.actionsDiv.append(dialog));
    }

    selectFunc(nodeEl: EventTarget) {
        if (typeof this.selectedEl !== 'undefined') {
            $(this.selectedEl).css("background-color", "");
            this.disableAddNodeButton();
            this.selectedEl = undefined;
        } else {
            const nodeName = $(nodeEl).find(".node-name");
            nodeName.css("background-color", this.options.selectedElBackgroundColor);
            this.selectedEl = nodeName[0];
            this.enableAddNodeButton();
        }
    }

    enableAddNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.removeAttribute("disabled");
    }

    disableAddNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.setAttribute("disabled", "");
    }

    createDivWithContentForModal(parentElement: HTMLElement, modalId: string) {
        let modalWin = document.getElementById(modalId);
        if (!modalWin || typeof modalWin === 'undefined') {
            modalWin = document.createElement('div');
            modalWin.setAttribute('id', modalId);
        }
        modalWin.innerHTML = DialogTemplate;
        return modalWin;
    }

    showAddNodeModal(pointlineJS: PointlineJS, selectedEl: HTMLElement, modalId: string) {
        const dialogElement = document.getElementById(modalId);
        const dialogTitle = dialogElement.querySelector('#dialog-title');
        dialogTitle.innerHTML = 'Add child node to selected?';
        const dialogContent = dialogElement.querySelector('#dialog-content');
        dialogContent.innerHTML = '';
        const dialog = new MDCDialog(document.querySelector(`#${modalId} .mdc-dialog`));
        dialog.open();
        dialog.listen('MDCDialog:closed', (event: MDCDialogCloseEvent) => {
            if (event.detail.action === 'accept') {
                BUTTON_CALLBACK.ADD_BUTTON(pointlineJS, selectedEl);
            }
        })
    }

    showExportJSONModal(pointlineJS: PointlineJS, modalId: string) {
        const dialogTitle = document.querySelector(`#${modalId} #dialog-title`);
        const dialogContent = document.querySelector(`#${modalId} #dialog-content`);
        const JSON_data = BUTTON_CALLBACK.EXPORT_TO_JSON_BUTTON(pointlineJS);
        dialogTitle.innerHTML = 'Export JSON result';
        dialogContent.innerHTML = JSON_data;
        const dialog = new MDCDialog(document.querySelector(`#${modalId} .mdc-dialog`));
        dialog.open();
    }
}