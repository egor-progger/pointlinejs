import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";
import { IBaseNodeType } from "@pointlinejs/stores/base/base-nodes.store";

@injectable()
export class DraggableNode implements IBaseNodeType {
    private draggable = true;
    private node: TreeNode;
    private dropNodeEvent: Promise<{ sourceNodeId: number, destinationNodeId: number }>;
    private dropNodeEventResolve: (value: { sourceNodeId: number, destinationNodeId: number } | PromiseLike<{ sourceNodeId: number, destinationNodeId: number }>) => void;
    private dropNodeEventOutput: (sourceNodeId: number, destinationNodeId: number) => void;

    initDraggableNode(node: TreeNode, dropNodeEventOutput: (sourceNodeId: number, destinationNodeId: number) => void) {
        this.node = node;
        if (this.draggable && this.node.nodeDOM) {
            this.enableDraggable();
            this.addDragendCallback();
            this.addDragStartCallback();
            this.allowDragOver();
            this.addDropCallback();
            this.initDropNodeEvent();
            if (!this.dropNodeEventOutput) {
                this.dropNodeEventOutput = dropNodeEventOutput;
            }
        }
        return this;
    }

    get nodeId() {
        return this.node.id;
    }

    updateDropNodeEventOutput(dropNodeEventOutput: (sourceNodeId: number, destinationNodeId: number) => void) {
        this.dropNodeEventOutput = dropNodeEventOutput;
    }

    public initDropNodeEvent() {
        this.dropNodeEvent = new Promise<{ sourceNodeId: number, destinationNodeId: number }>((resolve) => {
            this.dropNodeEventResolve = resolve;
        });
        this.dropNodeEvent.then((resolve) => {
            this.dropNodeEventOutput(resolve.sourceNodeId, resolve.destinationNodeId);
            this.initDropNodeEvent();
        });
    }

    private enableDraggable() {
        this.node.nodeDOM.draggable = true;
    }

    private addDragStartCallback() {
        this.node.nodeDOM.addEventListener('dragstart', (event: Event) => {
            this.node.dragInProgress = true;
            (event as DragEvent).dataTransfer.setData('text/plain', this.node.id.toString())
        })
    }

    private allowDragOver() {
        this.node.nodeDOM.addEventListener('dragover', (event) => event.preventDefault());
    }

    private addDropCallback() {
        this.node.nodeDOM.addEventListener('drop', (event: Event) => {
            event.preventDefault();
            const sourceNodeId = parseInt((event as DragEvent).dataTransfer.getData("text/plain"), 10);
            if (sourceNodeId !== null && sourceNodeId !== this.node.id) {
                this.dropNodeEventResolve({ sourceNodeId: sourceNodeId, destinationNodeId: this.node.id });
            }
        });
    }

    private addDragendCallback() {
        this.node.nodeDOM.addEventListener('dragend', () => {
            this.node.dragInProgress = false;
        });
    }
}