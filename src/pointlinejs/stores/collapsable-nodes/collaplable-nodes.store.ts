import { CollapsableNode } from "@pointlinejs/components/nodes/collapsable-node";
import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";

@injectable()
export class CollapsableNodesStore {
    private readonly nodes: CollapsableNode[] = [];

    constructor() { }

    addNode(node: TreeNode) {
        const collapsableNode = new CollapsableNode(node);
        this.nodes.push(collapsableNode);
    }

    findNodeById(id: number): CollapsableNode {
        return this.nodes.find((item) => {
            return item.nodeId === id;
        });
    }
}