import { PointlineJS } from "@pointlinejs/pointlinejs";

export enum BUTTON_TYPE {
    ADD_BUTTON = 'ADD_BUTTON',
    EXPORT_TO_JSON_BUTTON = 'EXPORT_TO_JSON_BUTTON',
}

export const BUTTON_CALLBACK = {
    ADD_BUTTON: addBtnClickEvent,
    EXPORT_TO_JSON_BUTTON: exportToJSONBtnClickEvent
}

function addBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    const tree = pointlineJS.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
        var nodeTree = nodeDb[key];
        if (nodeTree.text.name == selectedEl.textContent) {
            const selectedNodeTree = nodeTree;
            tree.addNode(selectedNodeTree, { text: { name: 'test' } });
            break;
        }
    }
}

function exportToJSONBtnClickEvent(pointlineJS: PointlineJS) {
    return JSON.stringify(pointlineJS.exportTreeToJSON());
}