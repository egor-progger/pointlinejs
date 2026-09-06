import { CollapsableNode } from "@pointlinejs/components/nodes/collapsable-node";
import { injectable } from "inversify";
import { BaseNodesStore } from "../base/base-nodes.store";

@injectable()
export class CollapsableNodesStore extends BaseNodesStore<CollapsableNode> {
}