import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";

export enum DragActionType {
    changeNodes = 1
}

@injectable()
export class DragNodeAction {
    private dragActionTypes = DragActionType;

    // constructor(@inject(DI_LIST.nodeDB) private readonly nodeDB: NodeDB) { }

    handleDrodNode(sourceNode: string, targetNode: TreeNode, action: DragActionType = DragActionType.changeNodes) {
        console.log('handleDrodNode', action);
        switch (action) {
            case this.dragActionTypes.changeNodes: {
                if (sourceNode) {
                    this.changeNodesAction(sourceNode, targetNode);
                }
                break;
            }
        }
    }

    private changeNodesAction(sourceNode: string, targetNode: TreeNode) {
        console.log('changeNodesAction');
        const tempNode = sourceNode;
        sourceNode = targetNode.nodeDOM.innerHTML;
        targetNode.nodeDOM.innerHTML = tempNode;
    }
}