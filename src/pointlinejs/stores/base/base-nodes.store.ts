import { injectable } from "inversify";

export interface IBaseNodeType { nodeId: number };

@injectable()
export abstract class BaseNodesStore<T extends IBaseNodeType> {
    readonly nodes: T[] = [];

    constructor() { }

    addNode(node: T) {
        this.nodes.push(node);
    }

    findNodeById(id: number): T {
        return this.nodes.find((item) => {
            return item.nodeId === id;
        });
    }

    findNodeIndexById(id: number): number {
        return this.nodes.findIndex((item) => {
            return item.nodeId === id;
        });
    }
}