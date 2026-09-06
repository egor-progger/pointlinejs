import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";
// import { DI_LIST } from "@pointlinejs/InjectableList";
import { IBaseNodeType } from "@pointlinejs/stores/base/base-nodes.store";


// @injectable()
// export class DraggableNodeFactory {
//     @inject(DI_LIST.draggableNodeConstructor) private draggableNode: { new(): DraggableNode };

//     public create(node: TreeNode): DraggableNode {
//         const draggableNode = new this.draggableNode();
//         draggableNode.init(node);
//         return draggableNode;
//     }
// }

@injectable()
export class DraggableNode implements IBaseNodeType {
    private draggable = true;
    private node: TreeNode;
    // private readonly dragNodeAction: DragNodeAction = new DragNodeAction();
    private dropNodeEvent: Promise<{ sourceNodeId: number, destinationNodeId: number }>;
    private dropNodeEventResolve: (value: { sourceNodeId: number, destinationNodeId: number } | PromiseLike<{ sourceNodeId: number, destinationNodeId: number }>) => void;
    private dropNodeEventOutput: (sourceNodeId: number, destinationNodeId: number) => void;

    // constructor(@inject(DI_LIST.dragNodeAction) private readonly dragNodeAction: DragNodeAction) { }

    initDraggableNode(node: TreeNode, dropNodeEventOutput: (sourceNodeId: number, destinationNodeId: number) => void) {
        console.log('DraggableNode init', node);
        // console.log('dragNodeAction', this.dragNodeAction);
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
        console.log('initDropNodeEvent');
        this.dropNodeEvent = new Promise<{ sourceNodeId: number, destinationNodeId: number }>((resolve) => {
            console.log('inside dropNodeEvent Promise begin', this.node);
            this.dropNodeEventResolve = resolve;
            console.log('this.dropNodeEventResolve', this.dropNodeEventResolve);
            console.log('inside dropNodeEvent Promise end');
        });
        this.dropNodeEvent.then((resolve) => {
            console.log('dropNodeEvent then');
            this.dropNodeEventOutput(resolve.sourceNodeId, resolve.destinationNodeId);
            this.initDropNodeEvent();
        });
    }

    private enableDraggable() {
        this.node.nodeDOM.draggable = true;
    }

    private addDragStartCallback() {
        this.node.nodeDOM.addEventListener('dragstart', (event: Event) => {
            console.log('dragstart', 'this.node', this.node);
            console.log('dragstart', 'this.dropNodeEvent', this.dropNodeEvent);
            console.log('dragstart', 'this.dropNodeEventResolve', this.dropNodeEventResolve);
            this.node.dragInProgress = true;
            // const nodeData: IDragNodeData = {
            //     id: this.node.id,
            //     image: this.node.image,
            //     link: this.node.link,
            //     meta: this.node.meta,
            //     text: this.node.text,
            //     parentId: this.node.parentId,
            //     children: this.node.children,
            //     connStyle: this.node.connStyle,
            //     stackChildren: this.node.stackChildren,
            //     stackParentId: this.node.stackParentId,
            //     stackParent: this.node.stackParent,
            //     leftNeighborId: this.node.leftNeighborId,
            //     rightNeighborId: this.node.rightNeighborId,
            //     collapsable: this.node.collapsable,
            //     collapsed: this.node.collapsed
            // };
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
            console.log('addDropCallback begin', sourceNodeId, this.node.id);
            if (sourceNodeId !== null && sourceNodeId !== this.node.id) {
                console.log('source node id', sourceNodeId);
                console.log('destination node', this.node.id);
                // this.dragNodeAction.handleDrodNode(sourceNode, this.node);
                // console.log('destination node', this.node.nodeDOM.innerHTML);
                // this.dropNodeEvent(true);
                console.log('dropNodeEventResolve', this.dropNodeEventResolve);
                console.log('this.dropNodeEvent', this.dropNodeEvent);
                this.dropNodeEventResolve({ sourceNodeId: sourceNodeId, destinationNodeId: this.node.id });
            }
            console.log('addDropCallback end');
        });
    }

    private addDragendCallback() {
        this.node.nodeDOM.addEventListener('dragend', () => {
            this.node.dragInProgress = false;
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
}