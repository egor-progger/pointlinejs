import { TreeNode } from "@pointlinejs/vendor/treant/TreeNode";
import { injectable } from "inversify";

@injectable()
export class DraggableNode {
    private draggable = true;

    constructor(private node: TreeNode) {
        this.node = node;
        if (this.draggable) {
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
        this.node.nodeDOM.addEventListener('dragstart', (event: DragEvent) => {
            console.log('this.node dragsrart', this.node);
            event.dataTransfer.setData('text/plain', this.node.id.toString())
        })
    }

    private allowDragOver() {
        this.node.nodeDOM.addEventListener('dragover', (event) => event.preventDefault());
    }

    private addDropCallback() {
        this.node.nodeDOM.addEventListener('drop', (event: DragEvent) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("text");
            console.log('drop data', data);
        });
    }

    private disableDraggable() {
        this.node.nodeDOM.draggable = false;
    }
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