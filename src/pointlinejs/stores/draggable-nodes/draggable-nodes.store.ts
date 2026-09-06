import { injectable } from "inversify";
import { BaseNodesStore } from "../base/base-nodes.store";
import { DraggableNode } from "@pointlinejs/components/nodes/draggable/draggable-node";

@injectable()
export class DraggableNodesStore extends BaseNodesStore<DraggableNode> {
    replaceNodes(sourceId: number, destinationId: number) {
        console.log('replaceNodes');
        const sourceIndex = this.findNodeIndexById(sourceId);
        const destinationIndex = this.findNodeIndexById(destinationId);

        console.log('sourceIndex', this.nodes[sourceIndex]);
        console.log('destinationIndex', this.nodes[destinationIndex]);

        this.nodes[sourceIndex].initDropNodeEvent();
        this.nodes[destinationIndex].initDropNodeEvent();

        const temp = this.nodes[sourceIndex];

        this.nodes[sourceIndex] = this.nodes[destinationIndex];
        this.nodes[destinationIndex] = temp;

        console.log('sourceIndex', this.nodes[sourceIndex]);
        console.log('destinationIndex', this.nodes[destinationIndex]);

        // this.nodes[sourceIndex].initDropNodeEvent.bind(this.nodes[sourceIndex])();
        // this.nodes[destinationIndex].initDropNodeEvent.bind(this.nodes[destinationIndex])();
    }
}