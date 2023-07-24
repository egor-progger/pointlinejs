import "./styles/Treant.css";
import '../../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import { JSONconfig } from "./JSONConfig";
import { TreeStore } from "./TreeStore";
import { inject, injectable } from "inversify";
import { DI_LIST } from "./InjectableList";
import "reflect-metadata";
import { Tree } from "./Tree";
import { NodeDB } from "./NodeDB";
import { RaphaelAttributes } from "raphael";
import { TreeNode } from "./TreeNode";

export type Coordinate = { x: number, y: number };

export type CallbackFunction = {
  onCreateNode: (treeNode: TreeNode, treeNodeDom: any) => void,
  onCreateNodeCollapseSwitch: (
    treeNode: TreeNode,
    treeNodeDom: HTMLElement,
    switchDom: any
  ) => void,
  onAfterAddNode: (
    newTreeNode: TreeNode,
    parentTreeNode: TreeNode,
    nodeStructure: Partial<NodeInterface>
  ) => void,
  onBeforeAddNode: (parentTreeNode: TreeNode, nodeStructure: Partial<NodeInterface>) => void,
  onAfterPositionNode: (
    treeNode: TreeNode,
    nodeDbIndex: number,
    containerCenter: Coordinate,
    treeCenter: Coordinate
  ) => void,
  onBeforePositionNode: (
    treeNode: TreeNode,
    nodeDbIndex: number,
    containerCenter: Coordinate,
    treeCenter: Coordinate
  ) => void,
  onToggleCollapseFinished: (treeNode: TreeNode, bIsCollapsed: boolean) => void,
  onAfterClickCollapseSwitch: (nodeSwitch: Element | JQuery, event: Event) => void,
  onBeforeClickCollapseSwitch: (nodeSwitch: Element | JQuery, event: Event) => void,
  onTreeLoaded: (rootTreeNode: TreeNode) => void
}

export type rootOrientationType = 'NORTH' | 'EAST' | 'WEST' | 'SOUTH';

export type nodeAlignType = 'CENTER' | 'TOP' | 'BOTTOM';

export type scrollbarType = 'resize' | 'native' | 'fancy' | 'None';

export type connectorType = { type: 'curve' | 'bCurve' | 'step' | 'straight', style: Partial<RaphaelAttributes>, stackIndent: number };

export type nodeType = { HTMLclass: string, drawLineThrough: boolean, collapsable: boolean, link: { target: '_self' } };

export type animationType = {
  nodeSpeed: number,
  nodeAnimation: string;
  connectorsSpeed: number,
  connectorsAnimation: string
};

export interface ChartInterface {
  container: string;
  callback: Partial<CallbackFunction>;
  rootOrientation: rootOrientationType;
  nodeAlign: nodeAlignType;
  levelSeparation: number;
  siblingSeparation: number;
  subTeeSeparation: number;
  hideRootNode: boolean;
  animateOnInit: boolean;
  animateOnInitDelay: number;
  scrollbar: scrollbarType;
  padding: number;
  connectors: Partial<connectorType>;
  node: Partial<nodeType>;
  animation: animationType;
  maxDepth: number;
}

export type nodeText = {
  name: string | Record<string, string>;
  title: string | Record<string, string>;
  desc: string | Record<string, string>;
  contact: string | Record<string, string>;
  data: string;
};

export type nodeLink = {
  href: string,
  target: string
};

export interface NodeInterface {
  text: Partial<nodeText>,
  link: Partial<nodeLink>,
  image: string;
  innerHTML: string;
  childrenDropLevel: number;
  pseudo: boolean;
  connectors: connectorType;
  collapsable: boolean;
  collapsed: boolean;
  HTMLclass: string;
  HTMLid: string;
  stackChildren: boolean;
  drawLineThrough: boolean;
  children?: Partial<NodeInterface>[];
  meta: object;
}

export type ChartStructure = {
  chart: Partial<ChartInterface>,
  nodeStructure: Partial<NodeInterface>;
}

export type ChartConfigType = Array<Partial<ChartInterface> | Partial<NodeInterface>> | ChartStructure;

/**
 * Chart constructor.
 */
@injectable()
export class Treant {
  jsonConfig: ChartConfigType;

  tree: Promise<Tree> | null = null;

  constructor(
    @inject(DI_LIST.jsonConfig) public jsonConfigService: JSONconfig,
    @inject(DI_LIST.treeStore) public treeStore: TreeStore,
    @inject(DI_LIST.nodeDB) public nodeDB: NodeDB) { }

  destroy() {
    this.tree.then((tree) =>
      this.treeStore.destroy(tree.id)
    );
  }

  init(
    jsonConfig: ChartConfigType,
    callback?: (tree: Tree) => void,
    jQuery?: JQueryStatic
  ) {
    if (Array.isArray(jsonConfig)) {
      this.jsonConfig = this.jsonConfigService.make(jsonConfig);
    } else {
      this.jsonConfig = jsonConfig;
    }
    // optional
    if (jQuery) {
      $ = jQuery;
    }
    this.tree = new Promise((resolve, reject) =>
      setTimeout(() => resolve(this.treeStore.createTree(this.jsonConfig)), 200)
    );
    Promise.all([this.tree, this.nodeDB.nodeDBState.dbReady]).then(
      ([tree, dbReady]) => {
        if (dbReady) {
          tree.positionTree(callback);
        }
      }
    );
  }
}
