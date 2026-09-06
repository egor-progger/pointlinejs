import { injectable } from "inversify";
import { BaseNodesStore } from "../base/base-nodes.store";
import { DraggableNode } from "@pointlinejs/components/nodes/draggable/draggable-node";

@injectable()
export class DraggableNodesStore extends BaseNodesStore<DraggableNode> {
    replaceNodes(sourceId: number, destinationId: number) {
        const sourceIndex = this.findNodeIndexById(sourceId);
        const destinationIndex = this.findNodeIndexById(destinationId);

        this.nodes[sourceIndex].initDropNodeEvent();
        this.nodes[destinationIndex].initDropNodeEvent();

        const temp = this.nodes[sourceIndex];

        this.nodes[sourceIndex] = this.nodes[destinationIndex];
        this.nodes[destinationIndex] = temp;
    }
}