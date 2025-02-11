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

function addParentNodeBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    const tree = pointlineJS.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
        var nodeTree = nodeDb[key];
        if (nodeTree.text.name == selectedEl.textContent) {
            console.log(nodeTree);
            console.log(nodeTree.parent());
            const selectedNodeTree = nodeTree.parent();
            nodeTree.children = [];
            tree.addNode(selectedNodeTree, { text: { name: 'test' } });
            break;
        }
    }
}


async function addChildNodeBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    const tree = pointlineJS.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
        var nodeTree = nodeDb[key];
        if (nodeTree.text.name == selectedEl.textContent) {
            const selectedNodeTree = nodeTree;
            tree.addNode(selectedNodeTree, { text: { name: 'test' } });
            pointlineJS.reload();
            await pointlineJS.draw();
            break;
        }
    }
}

function exportToJSONBtnClickEvent(pointlineJS: PointlineJS) {
    return JSON.stringify(pointlineJS.exportTreeToJSON());
}