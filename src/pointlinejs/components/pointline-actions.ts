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
        'addParentNodeBtn', 'Add parent node to selected', BUTTON_TYPE.ADD_PARENT_BUTTON
    ),
    new ButtonItem(
        'addChildNodeBtn', 'Add child node to selected', BUTTON_TYPE.ADD_CHILD_BUTTON
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
        this.resetActionsDiv();
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
            if (btnData.type === BUTTON_TYPE.ADD_PARENT_BUTTON) {
                dialogElements.push(this.createDivWithContentForModal(this.actionsDiv, modalId));
                btn.addEventListener("click", () => this.showAddParentNodeModal(this.pointlineJS, this.selectedEl, modalId));
            }
            if (btnData.type === BUTTON_TYPE.ADD_CHILD_BUTTON) {
                dialogElements.push(this.createDivWithContentForModal(this.actionsDiv, modalId));
                btn.addEventListener("click", () => this.showAddChildNodeModal(this.pointlineJS, this.selectedEl, modalId));
            }
            if (btnData.type === BUTTON_TYPE.EXPORT_TO_JSON_BUTTON) {
                dialogElements.push(this.createDivWithContentForModal(this.actionsDiv, modalId));
                btn.addEventListener("click", () => this.showExportJSONModal(this.pointlineJS, modalId));
            }
            switch (btnData.type) {
                case BUTTON_TYPE.ADD_PARENT_BUTTON:
                    if (!this.selectedEl) {
                        btn.setAttribute('disabled', 'true');
                    }
                    break;
                case BUTTON_TYPE.ADD_CHILD_BUTTON:
                    if (!this.selectedEl) {
                        btn.setAttribute('disabled', 'true');
                    }
                    break;
            }
            this.actionsDiv.append(btn);
        }
        dialogElements.forEach((dialog) => this.actionsDiv.append(dialog));
    }

    selectFunc(nodeEl: EventTarget) {
        if (typeof this.selectedEl !== 'undefined') {
            $(this.selectedEl).css("background-color", "");
            this.disableAddNodeButton();
            this.disableAddParentNodeButton();
            this.selectedEl = undefined;
        } else {
            const nodeName = $(nodeEl).find(".node-name");
            nodeName.css("background-color", this.options.selectedElBackgroundColor);
            this.selectedEl = nodeName[0];
            this.enableAddNodeButton();
            this.enableAddParentNodeButton();
        }
    }

    private enableAddNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_CHILD_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.removeAttribute("disabled");
    }

    private disableAddNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_CHILD_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.setAttribute("disabled", "");
    }

    private enableAddParentNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_PARENT_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.removeAttribute("disabled");
    }

    private disableAddParentNodeButton() {
        const addNodeButton = defaultButtons.find((item) => item.type === BUTTON_TYPE.ADD_PARENT_BUTTON);
        const buttomElement = document.getElementById(addNodeButton.id);
        buttomElement.setAttribute("disabled", "");
    }

    private createDivWithContentForModal(parentElement: HTMLElement, modalId: string) {
        let modalWin = document.getElementById(modalId);
        if (!modalWin || typeof modalWin === 'undefined') {
            modalWin = document.createElement('div');
            modalWin.setAttribute('id', modalId);
        }
        modalWin.innerHTML = DialogTemplate;
        return modalWin;
    }

    private showAddParentNodeModal(pointlineJS: PointlineJS, selectedEl: HTMLElement, modalId: string) {
        const dialogElement = document.getElementById(modalId);
        const dialogTitle = dialogElement.querySelector('#dialog-title');
        dialogTitle.innerHTML = 'Add parent node to selected?';
        const dialogContent = dialogElement.querySelector('#dialog-content');
        dialogContent.innerHTML = '';
        const dialog = new MDCDialog(document.querySelector(`#${modalId} .mdc-dialog`));
        dialog.open();
        dialog.listen('MDCDialog:closed', (event: MDCDialogCloseEvent) => {
            if (event.detail.action === 'accept') {
                BUTTON_CALLBACK.ADD_PARENT_BUTTON(pointlineJS, selectedEl);
            }
        })
    }

    private showAddChildNodeModal(pointlineJS: PointlineJS, selectedEl: HTMLElement, modalId: string) {
        const dialogElement = document.getElementById(modalId);
        const dialogTitle = dialogElement.querySelector('#dialog-title');
        dialogTitle.innerHTML = 'Add child node to selected?';
        const dialogContent = dialogElement.querySelector('#dialog-content');
        dialogContent.innerHTML = '';
        const dialog = new MDCDialog(document.querySelector(`#${modalId} .mdc-dialog`));
        dialog.open();
        dialog.listen('MDCDialog:closed', (event: MDCDialogCloseEvent) => {
            if (event.detail.action === 'accept') {
                BUTTON_CALLBACK.ADD_CHILD_BUTTON(pointlineJS, selectedEl);
            }
        })
    }

    private showExportJSONModal(pointlineJS: PointlineJS, modalId: string) {
        const dialogTitle = document.querySelector(`#${modalId} #dialog-title`);
        const dialogContent = document.querySelector(`#${modalId} #dialog-content`);
        const JSON_data = BUTTON_CALLBACK.EXPORT_TO_JSON_BUTTON(pointlineJS);
        dialogTitle.innerHTML = 'Export JSON result';
        dialogContent.innerHTML = JSON_data;
        const dialog = new MDCDialog(document.querySelector(`#${modalId} .mdc-dialog`));
        dialog.open();
    }

    private resetActionsDiv(): void {
        this.actionsDiv.replaceChildren();
        this.selectedEl = undefined;
    }
}