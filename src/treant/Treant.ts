/*
 * Treant-js
 *
 * (c) 2013 Fran Peručić
 * Treant-js may be freely distributed under the MIT license.
 * For all details and documentation:
 * http://fperucic.github.io/treant-js
 *
 * Treant is an open-source JavaScipt library for visualization of tree diagrams.
 * It implements the node positioning algorithm of John Q. Walker II "Positioning nodes for General Trees".
 *
 * References:
 * Emilio Cortegoso Lobato: ECOTree.js v1.0 (October 26th, 2006)
 *
 * Contributors:
 * Fran Peručić, https://github.com/fperucic
 * Dave Goodchild, https://github.com/dlgoodchild
 */

import "./styles/Treant.css";
import '../../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import { JSONconfig } from "./JSONConfig";
import { TreeStore } from "./TreeStore";
import { inject, injectable } from "inversify";
import { DI_LIST } from "../pointlinejs/InjectableList";
import "reflect-metadata";
import { Tree } from "./Tree";
import { NodeDB } from "./NodeDB";
import { RaphaelAttributes } from "raphael";
import { TreeNode } from "./TreeNode";

export type ElementWithSupportIE = Element & { currentStyle?: string, attachEvent: (eventType: string, handler: (event: Event) => void) => void };

export type Coordinate = { x: number, y: number };

export type CallbackFunction = {
  onCreateNode: (treeNode: TreeNode, treeNodeDom: any) => void,
  onCreateNodeCollapseSwitch: (
    treeNode: TreeNode,
    treeNodeDom: HTMLAnchorElement | HTMLDivElement,
    switchDom: HTMLAnchorElement | HTMLDivElement
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

export type RootOrientationType = 'NORTH' | 'EAST' | 'WEST' | 'SOUTH';

export type NodeAlignType = 'CENTER' | 'TOP' | 'BOTTOM';

export type ScrollbarType = 'resize' | 'native' | 'fancy' | 'None';

export type ConnectorType = { type: 'curve' | 'bCurve' | 'step' | 'straight', style: Partial<RaphaelAttributes>, stackIndent: number };

export type NodeType = { HTMLclass: string, drawLineThrough: boolean, collapsable: boolean, link: { target: '_self' } };

export type AnimationType = {
  nodeSpeed: number,
  nodeAnimation: string;
  connectorsSpeed: number,
  connectorsAnimation: string
};

export interface ChartInterface {
  container: string;
  callback: Partial<CallbackFunction>;
  rootOrientation: RootOrientationType;
  nodeAlign: NodeAlignType;
  levelSeparation: number;
  siblingSeparation: number;
  subTeeSeparation: number;
  hideRootNode: boolean;
  animateOnInit: boolean;
  animateOnInitDelay: number;
  scrollbar: ScrollbarType;
  padding: number;
  connectors: Partial<ConnectorType>;
  node: Partial<NodeType>;
  animation: AnimationType;
  maxDepth: number;
}

export type NodeText = {
  name: string | Record<string, string>;
  title: string | Record<string, string>;
  desc: string | Record<string, string>;
  contact: string | Record<string, string>;
  data: string;
};

export type NodeLink = {
  href: string,
  target: string
};

export interface NodeInterface {
  text: Partial<NodeText>,
  link: Partial<NodeLink>,
  image: string;
  innerHTML: string;
  childrenDropLevel: number;
  pseudo: boolean;
  connectors: ConnectorType;
  collapsable: boolean;
  collapsed: boolean;
  HTMLclass: string;
  HTMLid: string;
  stackChildren: boolean;
  drawLineThrough: boolean;
  children: Partial<NodeInterface>[];
  meta: object;
  position: string;
  _json_id: number;
  parent: Partial<NodeInterface>;
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
  jsonConfig: ChartStructure;

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
