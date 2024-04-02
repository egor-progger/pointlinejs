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

import './styles/Treant.css';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import { JSONconfig } from './JSONConfig';
import { TreeStore } from './TreeStore';
import { inject, injectable } from 'inversify';
import { DI_LIST } from '../../InjectableList';
import 'reflect-metadata';
import { Tree } from './Tree';
import { NodeDB } from './NodeDB';
import { RaphaelAttributes } from 'raphael';
import { TreeNode } from './TreeNode';

export type ElementWithSupportIE = Element & {
  currentStyle?: Record<string, string>;
  attachEvent: (eventType: string, handler: (event: Event) => void) => void;
};

export type Coordinate = { x: number; y: number };

export type CallbackFunction = {
  onCreateNode: (
    treeNode: TreeNode,
    treeNodeDom: HTMLAnchorElement | HTMLDivElement
  ) => void;
  onCreateNodeCollapseSwitch: (
    treeNode: TreeNode,
    treeNodeDom: HTMLAnchorElement | HTMLDivElement,
    switchDom: HTMLAnchorElement | HTMLDivElement
  ) => void;
  onAfterAddNode: (
    newTreeNode: TreeNode,
    parentTreeNode: TreeNode,
    nodeStructure: Partial<NodeInterface>
  ) => void;
  onBeforeAddNode: (
    parentTreeNode: TreeNode,
    nodeStructure: Partial<NodeInterface>
  ) => void;
  onAfterPositionNode: (
    treeNode: TreeNode,
    nodeDbIndex: number,
    containerCenter: Coordinate,
    treeCenter: Coordinate
  ) => void;
  onBeforePositionNode: (
    treeNode: TreeNode,
    nodeDbIndex: number,
    containerCenter: Coordinate,
    treeCenter: Coordinate
  ) => void;
  onToggleCollapseFinished: (treeNode: TreeNode, bIsCollapsed: boolean) => void;
  onAfterClickCollapseSwitch: (
    nodeSwitch: Element | JQuery,
    event: Event
  ) => void;
  onBeforeClickCollapseSwitch: (
    nodeSwitch: Element | JQuery,
    event: Event
  ) => void | boolean;
  onTreeLoaded: (rootTreeNode: TreeNode) => void;
};

/**
 * This property specifies the position of the root node, and the orientation of its children which depend on it.
 */
export type RootOrientationType = 'NORTH' | 'EAST' | 'WEST' | 'SOUTH';

/**
 * Specifies the vertical alignment of nodes on the same level. Is one node has
 * a bigger height than the others, the ones with the smaller height should be properly vertical aligned.
 */
export type NodeAlignType = 'CENTER' | 'TOP' | 'BOTTOM';

/**
 * If the chart container is smaller than the chart content a scrollbar will be shown.
 * There are tree possibilities. Use a native browser scrollbar,
 * use a fancy jquery powered scrollbar or don't use scrollbar at all with the "None" property.
 */
export type ScrollbarType = 'resize' | 'native' | 'fancy' | 'None';

export type RaphaelAttributesExtended = Partial<RaphaelAttributes> & {
  'arrow-start'?: string;
};

export type ConnectorTypeValues = 'curve' | 'bCurve' | 'step' | 'straight';

export type ConnectorType = {
  /**
   * type defines which type of connector line should be drawn between a parent node and its children. Several possibilities are available, their appearance is the following:
   * 
   * ![connector-types](/documentation/images/connector-types.png)
   */
  type: ConnectorTypeValues;
  /**
   * style parameter requires you to define an object.
   * Its definition can be found at [RaphaelJS documentation](https://dmitrybaranovskiy.github.io/raphael/reference.html#Element.attr) under possible parameters section. 
   */
  style: RaphaelAttributesExtended;
  /**
   * stackIndent is the property which will be applied to stacked children. #TODO: add link to stackChildren
   */
  stackIndent: number;
};

export type NodeType = {
  /**
   * A string can be entered under HTMLclass. That class will be given to each node in the cart along with the default .node class. 
   */
  HTMLclass: string;
  /**
   * drawLineThrough accepts a boolean. If set to true, each node will have a connector line drawn through it. 
   */
  drawLineThrough: boolean;
  /**
   * A collapsable option enables the node to interactively collapse its children. A collapse switch is added to the node. (jQuery required) 
   */
  collapsable: boolean;
  /**
   * If you are planning of making a lot of \<a\> nodes then here is the possibility to assign target="_blank" to each of those nodes in one blow.
   */
  link: { target: '_self' };
};

export type AnimationType = {
  /**
   * How the chart animates can be fully customised. Here, animation speed and animation functions can be set. jQuery is required in oreder for animations to work. 
   */
  nodeSpeed: number;
  /**
   * nodeAnimation accepts one of [jquery.easing functions](http://easings.net/).
   * [jquery.easing plugin](https://github.com/gdsmith/jquery.easing) needs to be included.  
   */
  nodeAnimation: string;
  connectorsSpeed: number;
  /**
   * connectorsAnimation accepts one of [Raphael.easing_formulas](https://dmitrybaranovskiy.github.io/raphael/reference.html#Raphael.easing_formulas)
   * or CSS format: cubic‐bezier(XX, XX, XX, XX) 
   * **Performance Hint**: In order to animate nodes with hardware-accelerated transitions use [jquery.transition.js](https://github.com/louisremi/jquery.transition.js/) plugin 
   */
  connectorsAnimation: string;
};

export interface ChartInterface {
  /**
   * A string that identifies a HTML element that will contain the
   * organizational chart (nodes and connections).
   * A string should be specified as a jQuery ID selector (ex: "#some-element-id") 
   */
  container: string;
  /**
   * Detailed usage and examples coming soon.
   */
  callback: Partial<CallbackFunction>;
  rootOrientation: RootOrientationType;
  nodeAlign: NodeAlignType;
  /**
   * The levelSeparation property defines the separation between chart levels.
   */
  levelSeparation: number;
  /**
   * The siblingSeparation property defines the separation between two sibling on the same level.
   */
  siblingSeparation: number;
  /**
   * The siblingSeparation property defines the separation between two neighbor branches of the organizational chart.
   */
  subTeeSeparation: number;
  /**
   * The root node can be hidden by defining this as true.
   * Root node should still be defined in the chart structure but it won't be shown.
   */
  hideRootNode: boolean;
  /**
   * Every chart can be animated uppon initialization if this option is set to true.
   * For more animation options see {@link ChartInterface.animation | chart configanimation}. (jQuery required)
   */
  animateOnInit: boolean;
  /**
   * This option indicates a number of miliseconds before an init animation is triggered.
   */
  animateOnInitDelay: number;
  scrollbar: ScrollbarType;
  /**
   * If the scrollbar is shown, this defines the padding between the chart structure and the chart container. 
   */
  padding: number;
  connectors: Partial<ConnectorType>;
  node: Partial<NodeType>;
  animation: AnimationType;
  maxDepth: number;
}

/**
 * A text property can be given to each node. Here you can describe the content of a node in detail.
 * For each text property a <p> tag will be created inside the node container.
 * Corresponding HTML classes will be given to each created tag so they can be styled what ever way you like.
 * If you pass an object instead off a string, an <a> tag will be created instead of <p> tag.
 * ```
 * node = {
 *   parent: some_parent,
 *   text: {
 *    name: "Simple node",
 *    title: "One of kind",
 *    desc: "A basic example",
 *    data-foo: " data Attribute for node",
 *    contact: {
 *      val: "contact me",
 *      href: "http://twitter.com/",
 *      target: "_self"
 *    }
 *   }
 * }
 * ```
 */
export type NodeText = {
  name: string | Record<string, string>;
  title: string | Record<string, string>;
  desc: string | Record<string, string>;
  contact: string | Record<string, string>;
  data: string;
};

/**
 * By default, each node is created as an absolute positioned \<div\> element. By defining a link property, a node is rendered as an <a> element instead.
 */
export type NodeLink = {
  href: string;
  target: string;
};

export interface NodeInterface {
  text: Partial<NodeText>;
  link: Partial<NodeLink>;
  /**
   * An image can be inserted into a node container. 
   * A relative or absolute path to target image needs to be set as image parameter.
   * The <img> is inserted before the text properties. 
   */
  image: string;
  /**
   * A custom HTML structure can be inserted into a node container.
   * A HTML string needs to be specified in order for this to work.
   * Another usage of this property is to pass a jQuery ID selector.
   * In that case, an element with a given id is found and its copy is used as node structure.
   * Suffix "-copy" is added to the id of the node element. 
   */
  innerHTML: string;
  /**
   * If a certain node has children, a childrenDropLevel can be defined on it.
   * That property specifies how many levels deeper than normal should children be positioned. 
   */
  childrenDropLevel: number;
  /**
   * A pseudo property allows the creation of invisible nodes with no content.
   * Such nodes can have children and all the other desired properties,
   * the only thing to keep in mind is that such nodes have NO content. 
   */
  pseudo: boolean;
  /**
   * Although all the nodes inherit the connectors property from the chart config, it can be overridden for a single node by redefining it under node config.
   * See chart {@link ConnectorType | config connectors} for more documentation. 
   */
  connectors: ConnectorType;
  /**
   * Each node can be meade collapsable. (jQuery required)
   * See chart config {@link NodeType.collapsable | node.collapsable} for more documentation. 
   */
  collapsable: boolean;
  /**
   * This option can be set to true, if so, effected node is initially collapsed. That node is also considered as collapsable. (jQuery required) 
   */
  collapsed: boolean;
  /**
   * If specified, all the nodes inherit the HTMLclass from config.node.HTMLclass. But with this property, it is possible to give extra classes to individual nodes.
   * See chart config {@link NodeType.HTMLclass | node.HTMLclass} for more documentation. 
   */
  HTMLclass: string;
  /**
   * A custom HTML id attribute can be given to each node element by defineing an id property. 
   */
  HTMLid: string;
  /**
   * stackChildren property can be set to true.
   * If so the children of the target node will be positioned one beneath the other instead of side by side.
   * This propery won't take affect if the node has grandchildren. When set, the appearance is the following:
   * 
   * ![connector-types](/documentation/images/stack-children.png) 
   * 
   */
  stackChildren: boolean;
  /**
   * The inherited property can be overridden or set by defining this property.
   * See chart config {@link NodeType.drawLineThrough | node.drawLineThrough}  for more documentation. 
   */
  drawLineThrough: boolean;
  children: Partial<NodeInterface>[];
  meta: object;
  position: string;
  _json_id: number;
  parent: Partial<NodeInterface>;
}

export type ChartStructure = {
  chart: Partial<ChartInterface>;
  nodeStructure: Partial<NodeInterface>;
};

export type ChartConfigType =
  | Array<Partial<ChartInterface> | Partial<NodeInterface>>
  | ChartStructure;

/**
 * Chart constructor.
 */
@injectable()
export class Treant {
  private jsonConfig: ChartStructure;
  private tree: Promise<Tree> | null = null;

  constructor(
    @inject(DI_LIST.jsonConfig) private jsonConfigService: JSONconfig,
    @inject(DI_LIST.treeStore) private treeStore: TreeStore,
    @inject(DI_LIST.nodeDB) private nodeDB: NodeDB
  ) { }

  destroy() {
    this.tree.then((tree) => this.treeStore.destroy(tree.id));
  }

  init(
    jsonConfig: ChartConfigType,
    callback?: (tree: Tree) => void,
    jQuery?: JQueryStatic
  ): Promise<Tree> {
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
    return Promise.all([this.tree, this.nodeDB.nodeDBState.dbReady]).then(
      ([tree, dbReady]) => {
        if (dbReady) {
          return tree.positionTree(callback);
        }
        return null;
      }
    );
  }
}
