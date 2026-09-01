import { ConnectorType, NodeLink, NodeText } from "@pointlinejs/vendor/treant/Treant";

export interface IDragNodeData {
    id: number;
    text: Partial<NodeText>;
    image: string;
    meta: object;
    link: NodeLink;
    parentId: number;
    children: number[];
    connStyle: Partial<ConnectorType>;
    stackChildren: number[];
    stackParentId: number;
    stackParent: boolean;
    leftNeighborId: number | null;
    rightNeighborId: number | null;
    collapsable: boolean;
    collapsed: boolean;
}