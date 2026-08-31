import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { inject, injectable } from "inversify";
import { DragNodeAction } from "./drag-node-action";
import { DI_LIST } from "@pointlinejs/InjectableList";


@injectable()
export class DraggableNodeFactory {
    @inject(DI_LIST.draggableNodeConstructor) private draggableNode: { new(): DraggableNode };

    public create(node: TreeNode): DraggableNode {
        const draggableNode = new this.draggableNode();
        draggableNode.init(node);
        return draggableNode;
    }
}

@injectable()
export class DraggableNode {
    private draggable = true;
    private node: TreeNode;
    private readonly dragNodeAction: DragNodeAction = new DragNodeAction();

    // constructor(@inject(DI_LIST.dragNodeAction) private readonly dragNodeAction: DragNodeAction) { }

    init(node: TreeNode) {
        console.log('DraggableNode init', node);
        console.log('dragNodeAction', this.dragNodeAction);
        this.node = node;
        if (this.draggable && this.node.nodeDOM) {
            this.enableDraggable();
            this.addDraggableCallback();
            this.allowDragOver();
            this.addDropCallback();
        }
    }

    private enableDraggable() {
        this.node.nodeDOM.draggable = true;
    }

    private addDraggableCallback() {
        this.node.nodeDOM.addEventListener('dragstart', (event: Event) => {
            console.log('this.node dragsrart', this.node);
            (event as DragEvent).dataTransfer.setData('text/plain', this.node.nodeDOM.innerHTML)
        })
    }

    private allowDragOver() {
        this.node.nodeDOM.addEventListener('dragover', (event) => event.preventDefault());
    }

    private addDropCallback() {
        this.node.nodeDOM.addEventListener('drop', (event: Event) => {
            event.preventDefault();
            const sourceNode = (event as DragEvent).dataTransfer.getData("text");
            console.log('addDropCallback', sourceNode);
            if (sourceNode) {
                console.log('source node id', sourceNode);
                console.log('destination node', this.node.nodeDOM.innerHTML);
                this.dragNodeAction.handleDrodNode(sourceNode, this.node);
                console.log('destination node', this.node.nodeDOM.innerHTML);
            }
        });
    }

    // private disableDraggable() {
    //     this.node.nodeDOM.draggable = false;
    // }
    //     function addingDragAndDropSupport() {
    // 	var nodeDivs = document.getElementsByClassName("node");
    // 	var i;
    // 	for(i=0; i<nodeDivs.length; i++) {
    //         nodeDivs[i].draggable = true;
    //         nodeDivs[i].classList.add("drop");
    //         nodeDivs[i].addEventListener('dragstart', drag, false);
    //         nodeDivs[i].addEventListener('drop',drop, false);
    //         nodeDivs[i].addEventListener('dragover', allowDrop, false);
    //     }
    // }

    // function drag(event) {
    //     event.dataTransfer.setData("text", event.target.id);
    // }

    // function drop(event){
    // 	event.preventDefault();
    // 	console.log("Drop");
    // }

    // function  allowDrop(event) {
    // 	event.preventDefault();
    // }
}