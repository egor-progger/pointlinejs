import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";
import { IDragNodeData } from "./drag-node-data";

export enum DragActionType {
    changeNodes = 1
}

@injectable()
export class DragNodeAction {
    private dragActionTypes = DragActionType;

    handleDrodNode(sourceNode: IDragNodeData, targetNode: TreeNode, action: DragActionType = DragActionType.changeNodes) {
        switch (action) {
            case this.dragActionTypes.changeNodes: {
                if (sourceNode) {
                    this.changeNodesAction(sourceNode, targetNode);
                }
                break;
            }
        }
    }

    private changeNodesAction(sourceNode: IDragNodeData, targetNode: TreeNode) {
        const tempNode = sourceNode;
        sourceNode = Object.create(targetNode) as IDragNodeData;
        targetNode = Object.create(tempNode) as TreeNode;
    }
}