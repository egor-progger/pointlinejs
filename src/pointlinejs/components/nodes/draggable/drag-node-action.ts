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

    private changeNodesAction(sourceNode: IDragNodeData, targetNode: TreeNode) {
        console.log('changeNodesAction');
        const tempNode = sourceNode;
        sourceNode = Object.create(targetNode) as IDragNodeData;
        targetNode = Object.create(tempNode) as TreeNode;
    }

    // function swapNodes(nodes, dragIndex, dropIndex) {
    //             const temp = nodes[dragIndex];
    //             const dragClone = { ...temp };
    //             const dropClone = { ...nodes[dropIndex] };

    //             nodes[dragIndex] = nodes[dropIndex];
    //             nodes[dropIndex] = temp;

    //             // set dragged node props
    //             nodes[dragIndex].id = dragClone.id;
    //             nodes[dragIndex].nodeDOM.id = dragClone.id;
    //             nodes[dragIndex].parentId = dragClone.parentId;
    //             nodes[dragIndex].children = dragClone.children;
    //             nodes[dragIndex].connStyle = dragClone.connStyle;
    //             nodes[dragIndex].stackChildren = dragClone.stackChildren;
    //             nodes[dragIndex].stackParentId = dragClone.stackParentId;
    //             nodes[dragIndex].stackParent = dragClone.stackParent;
    //             nodes[dragIndex].leftNeighborId = dragClone.leftNeighborId;
    //             nodes[dragIndex].rightNeighborId = dragClone.rightNeighborId;
    //             nodes[dragIndex].collapsed = dragClone.collapsed;
    //             nodes[dragIndex].collapsable = dragClone.collapsable;

    //             // set dropped node props
    //             nodes[dropIndex].id = dropClone.id;
    //             nodes[dropIndex].nodeDOM.id = dropClone.id;
    //             nodes[dropIndex].parentId = dropClone.parentId;
    //             nodes[dropIndex].children = dropClone.children;
    //             nodes[dropIndex].connStyle = dropClone.connStyle;
    //             nodes[dropIndex].stackChildren = dropClone.stackChildren;
    //             nodes[dropIndex].stackParent = dropClone.stackParent;
    //             nodes[dropIndex].stackParentId = dropClone.stackParentId;
    //             nodes[dropIndex].leftNeighborId = dropClone.leftNeighborId;
    //             nodes[dropIndex].rightNeighborId = dropClone.rightNeighborId;
    //             nodes[dropIndex].collapsed = dropClone.collapsed;
    //             nodes[dropIndex].collapsable = dropClone.collapsable;
    //         }
}