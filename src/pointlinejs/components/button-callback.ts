import { PointlineJS } from "@pointlinejs/pointlinejs";

export enum BUTTON_TYPE {
    ADD_PARENT_BUTTON = 'ADD_PARENT_BUTTON',
    ADD_CHILD_BUTTON = 'ADD_CHILD_BUTTON',
    EXPORT_TO_JSON_BUTTON = 'EXPORT_TO_JSON_BUTTON',
}

export const BUTTON_CALLBACK = {
    ADD_PARENT_BUTTON: addParentNodeBtnClickEvent,
    ADD_CHILD_BUTTON: addChildNodeBtnClickEvent,
    EXPORT_TO_JSON_BUTTON: exportToJSONBtnClickEvent
}

async function addParentNodeBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    pointlineJS.addParentNode(selectedEl, { text: { name: 'test' } });
}


async function addChildNodeBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    pointlineJS.addChildNode(selectedEl, { text: { name: 'test' } });
}

function exportToJSONBtnClickEvent(pointlineJS: PointlineJS) {
    return JSON.stringify(pointlineJS.exportTreeToJSON());
}