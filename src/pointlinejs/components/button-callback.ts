import { PointlineJS } from "@pointlinejs/pointlinejs";

export enum BUTTON_TYPE {
    ADD_BUTTON = 'ADD_BUTTON'
}

export const BUTTON_CALLBACK = {
    ADD_BUTTON: addBtnClickEvent,
}

function addBtnClickEvent(pointlineJS: PointlineJS, selectedEl: HTMLElement) {
    console.log('addBtnClickEvent');
    const tree = pointlineJS.getTree();
    const nodeDb = tree.getNodeDb().db;
    console.log(tree);
    for (var key in nodeDb) {
        var nodeTree = nodeDb[key];
        if (nodeTree.text.name == selectedEl.textContent) {
            const selectedNodeTree = nodeTree;
            tree.addNode(selectedNodeTree, { text: { name: 'test' } })
            // $('#modalWin').dialog("open");
            break;
        }
    }
}