import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";

@injectable()
export class CollapsableNode {
    private node: TreeNode;
    private readonly collapsableClassElement = 'collapsable';
    private readonly collapsedClass = 'collapsed';

    constructor(node: TreeNode) {
        this.node = node;
    }

    get cssClass() {
        let cssClass: string[] = [];
        if (this.node.collapsable) {
            cssClass.push(this.collapsableClassElement);
        }
        if (this.node.collapsed) {
            cssClass.push(this.collapsedClass);
        }
        return cssClass.join(' ');
    }

    get nodeId() {
        return this.node.id;
    }

    collapseNode() {
        this.node.collapse();
    }

    expandNode() {
        this.node.expand();
    }
}