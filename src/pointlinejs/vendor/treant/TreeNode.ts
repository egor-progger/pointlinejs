/**
 * TreeNode constructor.
 * @param {object} nodeStructure
 * @param {number} id
 * @param {number} parentId
 * @param {Tree} tree
 * @param {number} stackParentId
 * @constructor
 */

import { injectable } from 'inversify';
import { UTIL } from './Util';
import { Tree } from './Tree';
import $ from 'jquery';
import {
  ConnectorType,
  Coordinate,
  NodeInterface,
  NodeLink,
  NodeText,
  RaphaelAttributesExtended,
} from './Treant';
import { RaphaelPath } from 'raphael';
import { CollapsableNode } from '@pointlinejs/components/nodes/collapsable-node';
import { Tooltip } from '@pointlinejs/tooltip';

export type RaphaelPathExtended = RaphaelPath<'SVG' | 'VML'> & {
  hidden?: boolean;
};

export type TreeNodeDom = HTMLAnchorElement | HTMLDivElement;

@injectable()
export class TreeNode {
  private util: UTIL = new UTIL();
  private parentId: number;
  private image: string;
  private link: NodeLink;
  private collapsable: boolean;
  private collapsed: boolean;
  private nodeInnerHTML: string;
  private nodeHTMLclass: string;
  private nodeHTMLid: number;
  private lineThroughMe: RaphaelPathExtended;
  private hidden: boolean;
  private CONFIG = {
    nodeHTMLclass: 'node',
  };
  private tooltip: Tooltip;

  id: number;
  text: Partial<NodeText>;
  prelim: number;
  modifier: number;
  leftNeighborId: number | null;
  rightNeighborId: number | null;
  stackParentId: number;
  stackParent: boolean = undefined;
  pseudo: boolean;
  connStyle: Partial<ConnectorType>;
  connector: RaphaelPathExtended;
  drawLineThrough: boolean;
  children: number[];
  width: number;
  height: number;
  X: number;
  Y: number;
  nodeDOM: TreeNodeDom;
  positioned: boolean;
  stackChildren: number[];
  style: CSSStyleDeclaration;
  treeId: number;
  meta: object;

  constructor(private tree: Tree) { }

  init(
    nodeStructure: Partial<NodeInterface> | 'pseudo',
    id: number,
    parentId: number,
    tree: Tree,
    stackParentId: number | null
  ) {
    return this.reset(nodeStructure, id, parentId, tree, stackParentId);
  }

  /**
   * @param {object} nodeStructure
   * @param {number} id
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @returns {TreeNode}
   */
  private reset(
    nodeStructure: Partial<NodeInterface> | 'pseudo',
    id: number,
    parentId: number,
    tree: Tree,
    stackParentId: number | null
  ) {
    this.id = id;
    this.parentId = parentId;
    this.treeId = tree.id;

    this.prelim = 0;
    this.modifier = 0;
    this.leftNeighborId = null;

    this.stackParentId = stackParentId;

    // pseudo node is a node with width=height=0, it is invisible, but necessary for the correct positioning of the tree
    this.pseudo = nodeStructure === 'pseudo' || nodeStructure['pseudo']; // todo: surely if nodeStructure is a scalar then the rest will error:

    if (typeof this.pseudo === 'undefined' || this.pseudo !== false) {
      const nodeStructureValue = nodeStructure as Partial<NodeInterface>;
      this.meta = nodeStructureValue.meta || {};
      this.image = nodeStructureValue.image || null;

      this.connStyle = this.util.createMerge(
        tree.CONFIG.connectors,
        nodeStructureValue.connectors
      );

      this.drawLineThrough =
        nodeStructureValue.drawLineThrough === false
          ? false
          : nodeStructureValue.drawLineThrough ||
          tree.CONFIG.node.drawLineThrough;

      this.collapsable =
        nodeStructureValue.collapsable === false
          ? false
          : nodeStructureValue.collapsable || tree.CONFIG.node.collapsable;
      this.collapsed = nodeStructureValue.collapsed;

      this.text = nodeStructureValue.text;

      if (nodeStructureValue.tooltip) {
        this.tooltip = new Tooltip(nodeStructureValue.tooltip);
      }

      // '.node' DIV
      this.nodeInnerHTML = nodeStructureValue.innerHTML;
      this.nodeHTMLclass =
        (tree.CONFIG.node.HTMLclass ? tree.CONFIG.node.HTMLclass : '') + // globally defined class for the nodex
        (nodeStructureValue.HTMLclass
          ? ' ' + nodeStructureValue.HTMLclass
          : ''); // + specific node class

      this.nodeHTMLid = parseInt(nodeStructureValue.HTMLid, 10);
    }

    this.link = this.util.createMerge(
      tree.CONFIG.node.link,
      nodeStructure.link
    ) as NodeLink;
    this.connector = null;

    this.children = [];
    return this;
  }

  /**
   * @returns {object}
   */
  private getTreeConfig() {
    return this.getTree().CONFIG;
  }

  /**
   * @returns {NodeDB}
   */
  private getTreeNodeDb() {
    return this.getTree().getNodeDb();
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  private lookupNode(nodeId: number) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * @returns {Tree}
   */
  private getTree() {
    return this.tree;
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  private dbGet(nodeId: number) {
    return this.getTreeNodeDb().get(nodeId);
  }

  /**
   * Returns the width of the node
   * @returns {float}
   */
  size() {
    const orientation = this.getTreeConfig().rootOrientation;

    if (this.pseudo) {
      // prevents separating the subtrees
      return -1 * this.getTreeConfig().subTeeSeparation;
    }

    if (orientation === 'NORTH' || orientation === 'SOUTH') {
      return this.width;
    } else if (orientation === 'WEST' || orientation === 'EAST') {
      return this.height;
    }
    return 0;
  }

  /**
   * @returns {number}
   */
  childrenCount() {
    return this.collapsed || !this.children ? 0 : this.children.length;
  }

  /**
   * @param {number} index
   * @returns {TreeNode}
   */
  childAt(index: number): TreeNode {
    return this.dbGet(this.children[index]);
  }

  /**
   * @returns {TreeNode}
   */
  firstChild() {
    return this.childAt(0);
  }

  /**
   * @returns {TreeNode}
   */
  lastChild(): TreeNode {
    return this.childAt(this.children.length - 1);
  }

  /**
   * @returns {TreeNode}
   */
  parent() {
    return this.lookupNode(this.parentId);
  }

  /**
   * @returns {TreeNode}
   */
  leftNeighbor() {
    if (this.leftNeighborId) {
      return this.lookupNode(this.leftNeighborId);
    }
    return null;
  }

  /**
   * @returns {TreeNode}
   */
  rightNeighbor() {
    if (this.rightNeighborId) {
      return this.lookupNode(this.rightNeighborId);
    }
    return null;
  }

  /**
   * @returns {TreeNode}
   */
  leftSibling() {
    const leftNeighbor = this.leftNeighbor();
    if (leftNeighbor && leftNeighbor.parentId === this.parentId) {
      return leftNeighbor;
    }
    return null;
  }

  /**
   * @returns {TreeNode}
   */
  rightSibling() {
    var rightNeighbor = this.rightNeighbor();

    if (rightNeighbor && rightNeighbor.parentId === this.parentId) {
      return rightNeighbor;
    }
    return null;
  }

  /**
   * @returns {number}
   */
  childrenCenter() {
    var first = this.firstChild(),
      last = this.lastChild();
    return first.prelim + (last.prelim - first.prelim + last.size()) / 2;
  }

  /**
   * Find out if one of the node ancestors is collapsed
   * @returns {*}
   */
  collapsedParent(): TreeNode | boolean {
    var parent = this.parent();
    if (!parent) {
      return false;
    }
    if (parent.collapsed) {
      return parent;
    }
    return parent.collapsedParent();
  }

  /**
   * Returns the leftmost child at specific level, (initial level = 0)
   * @param level
   * @param depth
   * @returns {*}
   */
  leftMost(level: number, depth: number): TreeNode | null {
    if (level >= depth) {
      return this;
    }
    if (this.childrenCount() === 0) {
      return null;
    }

    for (var i = 0, n = this.childrenCount(); i < n; i++) {
      var leftmostDescendant = this.childAt(i).leftMost(level + 1, depth);
      if (leftmostDescendant) {
        return leftmostDescendant;
      }
    }
    return null;
  }

  // returns start or the end point of the connector line, origin is upper-left
  connectorPoint(startPoint: boolean) {
    let orient = this.getTree().CONFIG.rootOrientation;
    const point: Coordinate = { x: 0, y: 0 };

    if (this.stackParentId) {
      // return different end point if node is a stacked child
      if (orient === 'NORTH' || orient === 'SOUTH') {
        orient = 'WEST';
      } else if (orient === 'EAST' || orient === 'WEST') {
        orient = 'NORTH';
      }
    }

    // if pseudo, a virtual center is used
    if (orient === 'NORTH') {
      point.x = this.pseudo
        ? this.X - this.getTree().CONFIG.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y + this.height : this.Y;
    } else if (orient === 'SOUTH') {
      point.x = this.pseudo
        ? this.X - this.getTree().CONFIG.subTeeSeparation / 2
        : this.X + this.width / 2;
      point.y = startPoint ? this.Y : this.Y + this.height;
    } else if (orient === 'EAST') {
      point.x = startPoint ? this.X : this.X + this.width;
      point.y = this.pseudo
        ? this.Y - this.getTree().CONFIG.subTeeSeparation / 2
        : this.Y + this.height / 2;
    } else if (orient === 'WEST') {
      point.x = startPoint ? this.X + this.width : this.X;
      point.y = this.pseudo
        ? this.Y - this.getTree().CONFIG.subTeeSeparation / 2
        : this.Y + this.height / 2;
    }
    return point;
  }

  /**
   * @returns {string}
   */
  private pathStringThrough() {
    // get the geometry of a path going through the node
    var startPoint = this.connectorPoint(true),
      endPoint = this.connectorPoint(false);

    return [
      'M',
      startPoint.x + ',' + startPoint.y,
      'L',
      endPoint.x + ',' + endPoint.y,
    ].join(' ');
  }

  /**
   * @param {Coordinate} hidePoint
   */
  drawLineThroughMe(hidePoint?: Coordinate): void {
    // hidepoint se proslijedjuje ako je node sakriven zbog collapsed
    var pathString = hidePoint
      ? this.getTree().getPointPathString(hidePoint)
      : this.pathStringThrough();

    this.lineThroughMe =
      this.lineThroughMe || this.getTree()._R.path(pathString);

    const line_style: RaphaelAttributesExtended = this.util.cloneObj(
      this.connStyle.style
    );

    delete line_style['arrow-start'];
    delete line_style['arrow-end'];

    this.lineThroughMe.attr(line_style);

    if (hidePoint) {
      this.lineThroughMe.hide();
      this.lineThroughMe.hidden = true;
    }
  }

  private addSwitchEvent(nodeSwitch: Element | JQuery) {
    const self = this;
    this.util.addEvent(
      nodeSwitch as Element,
      'click',
      (e: Event): void | boolean => {
        if (
          self
            .getTreeConfig()
            .callback.onBeforeClickCollapseSwitch.apply(self, [
              nodeSwitch,
              e,
            ]) === false
        ) {
          return false;
        }

        self.toggleCollapse();

        self
          .getTreeConfig()
          .callback.onAfterClickCollapseSwitch.apply(self, [nodeSwitch, e]);
      }
    );
  }

  /**
   * @returns {TreeNode}
   */
  collapse() {
    if (!this.collapsed) {
      this.toggleCollapse();
    }
    return this;
  }

  /**
   * @returns {TreeNode}
   */
  expand() {
    if (this.collapsed) {
      this.toggleCollapse();
    }
    return this;
  }

  /**
   * @returns {TreeNode}
   */
  toggleCollapse() {
    const oTree = this.getTree();

    if (!oTree.inAnimation) {
      oTree.inAnimation = true;

      this.collapsed = !this.collapsed; // toggle the collapse at each click
      this.util.toggleClass(this.nodeDOM, CollapsableNode.collapsedClass, this.collapsed);

      oTree.positionTree();

      var self = this;

      setTimeout(
        (oTree) => {
          // set the flag after the animation
          oTree.inAnimation = false;
          oTree.CONFIG.callback.onToggleCollapseFinished.apply(oTree, [
            self,
            self.collapsed,
          ]);
        },
        oTree.CONFIG.animation.nodeSpeed >
          oTree.CONFIG.animation.connectorsSpeed
          ? oTree.CONFIG.animation.nodeSpeed
          : oTree.CONFIG.animation.connectorsSpeed,
        oTree
      );
    }
    return this;
  }

  hide(collapse_to_point?: Coordinate) {
    var bCurrentState = this.hidden;
    this.hidden = true;

    this.nodeDOM.style.overflow = 'hidden';

    var tree = this.getTree(),
      config = this.getTreeConfig(),
      oNewState: JQueryCssProperties = {
        opacity: '0',
      };

    if (collapse_to_point) {
      oNewState['left'] = collapse_to_point.x.toString();
      oNewState['top'] = collapse_to_point.y.toString();
    }

    // if parent was hidden in initial configuration, position the node behind the parent without animations
    if (!this.positioned || bCurrentState) {
      this.nodeDOM.style.visibility = 'hidden';
      if ($) {
        $(this.nodeDOM).css(oNewState);
      } else {
        this.nodeDOM.style.left = oNewState['left'] + 'px';
        this.nodeDOM.style.top = oNewState['top'] + 'px';
      }
      this.positioned = true;
    } else {
      // todo: fix flashy bug when a node is manually hidden and tree.redraw is called.
      if ($) {
        $(this.nodeDOM).animate(
          oNewState,
          config.animation.nodeSpeed,
          config.animation.nodeAnimation,
          function (this: TreeNodeDom) {
            this.style.visibility = 'hidden';
          }
        );
      } else {
        this.nodeDOM.style.transition =
          'all ' + config.animation.nodeSpeed + 'ms ease';
        this.nodeDOM.style.transitionProperty = 'opacity, left, top';
        this.nodeDOM.style.opacity = oNewState['opacity'].toString();
        this.nodeDOM.style.left = oNewState['left'] + 'px';
        this.nodeDOM.style.top = oNewState['top'] + 'px';
        this.nodeDOM.style.visibility = 'hidden';
      }
    }

    // animate the line through node if the line exists
    if (this.lineThroughMe) {
      var new_path = tree.getPointPathString(collapse_to_point);
      if (bCurrentState) {
        // update without animations
        this.lineThroughMe.attr({ path: new_path });
      } else {
        // update with animations
        tree.animatePath(
          this.lineThroughMe,
          tree.getPointPathString(collapse_to_point)
        );
      }
    }

    return this;
  }

  /**
   * @returns {TreeNode}
   */
  hideConnector() {
    var oTree = this.getTree();
    var oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 0 },
        oTree.CONFIG.animation.connectorsSpeed,
        oTree.CONFIG.animation.connectorsAnimation
      );
    }
    return this;
  }

  show() {
    this.hidden = false;

    this.nodeDOM.style.visibility = 'visible';

    var oNewState = {
      left: this.X,
      top: this.Y,
      opacity: 1,
    };
    const config = this.getTreeConfig();

    // // if the node was hidden, update opacity and position
    if ($) {
      $(this.nodeDOM).animate(
        oNewState,
        config.animation.nodeSpeed,
        config.animation.nodeAnimation,
        function (this: TreeNodeDom) {
          // $.animate applies "overflow:hidden" to the node, remove it to avoid visual problems
          this.style.overflow = '';
        }
      );
    } else {
      this.nodeDOM.style.transition =
        'all ' + config.animation.nodeSpeed + 'ms ease';
      this.nodeDOM.style.transitionProperty = 'opacity, left, top';
      this.nodeDOM.style.left = oNewState.left + 'px';
      this.nodeDOM.style.top = oNewState.top + 'px';
      this.nodeDOM.style.opacity = oNewState.opacity.toString();
      this.nodeDOM.style.overflow = '';
    }

    if (this.lineThroughMe) {
      this.getTree().animatePath(this.lineThroughMe, this.pathStringThrough());
    }

    return this;
  }

  /**
   * @returns {TreeNode}
   */
  showConnector() {
    var oTree = this.getTree();
    var oPath = oTree.connectionStore[this.id];
    if (oPath) {
      oPath.animate(
        { opacity: 1 },
        oTree.CONFIG.animation.connectorsSpeed,
        oTree.CONFIG.animation.connectorsAnimation
      );
    }
    return this;
  }

  /**
   * Build a node from the 'text' and 'img' property and return with it.
   *
   * The node will contain all the fields that present under the 'text' property
   * Each field will refer to a css class with name defined as node-{$property_name}
   *
   * Example:
   * The definition:
   *
   *   text: {
   *     desc: "some description",
   *     paragraph: "some text"
   *   }
   *
   * will generate the following elements:
   *
   *   <p class="node-desc">some description</p>
   *   <p class="node-paragraph">some text</p>
   *
   * @Returns the configured node
   */
  private buildNodeFromText(node: TreeNodeDom) {
    // IMAGE
    if (this.image) {
      const image = document.createElement('img');
      image.src = this.image;
      node.appendChild(image);
    }

    // TEXT
    if (this.text) {
      for (var key in this.text) {
        const keyTyped = key as keyof typeof this.text;
        // adding DATA Attributes to the node
        if (key.startsWith('data-')) {
          node.setAttribute(key, this.text[keyTyped] as string);
        } else {
          let textValue;
          let href;
          let target;
          let val;
          if (typeof this.text[keyTyped] === 'object') {
            textValue = this.text[keyTyped] as Record<string, string>;
            href = textValue['href'];
            target = textValue['target'];
            val = textValue['val'];
          } else {
            textValue = this.text[keyTyped] as string;
          }

          var textElement = document.createElement(
            href ? 'a' : 'p'
          ) as HTMLAnchorElement;

          // make an <a> element if required
          if (href) {
            textElement.href = href;
            if (target) {
              textElement.target = target;
            }
          }

          textElement.className = 'node-' + key;
          textElement.appendChild(
            document.createTextNode(
              val
                ? val
                : textValue instanceof Object
                  ? "'val' param missing!"
                  : (this.text[keyTyped] as string)
            )
          );

          node.appendChild(textElement);
        }
      }
    }
    return node;
  }

  /**
   * Build a node from  'nodeInnerHTML' property that defines an existing HTML element, referenced by it's id, e.g: #someElement
   * Change the text in the passed node to 'Wrong ID selector' if the referenced element does ot exist,
   * return with a cloned and configured node otherwise
   *
   * @Returns node the configured node
   */
  private buildNodeFromHtml(node: TreeNodeDom) {
    // get some element by ID and clone its structure into a node
    if (this.nodeInnerHTML.charAt(0) === '#') {
      var elem = document.getElementById(this.nodeInnerHTML.substring(1));
      if (elem) {
        if (node instanceof HTMLAnchorElement) {
          node = elem.cloneNode(true) as HTMLAnchorElement;
        }
        if (node instanceof HTMLDivElement) {
          node = elem.cloneNode(true) as HTMLDivElement;
        }
        node.id += '-clone';
        node.className += ' node';
      } else {
        node.innerHTML = '<b> Wrong ID selector </b>';
      }
    } else {
      // insert your custom HTML into a node
      node.innerHTML = this.nodeInnerHTML;
    }
    return node;
  }

  /**
   * @param {Tree} tree
   */
  createGeometry(tree: Tree) {
    if (this.id === 0 && tree.CONFIG.hideRootNode) {
      this.width = 0;
      this.height = 0;
      return;
    }

    var drawArea = tree.drawArea;
    /////////// CREATE NODE //////////////
    let node: TreeNodeDom = document.createElement(
      this.link.href && !this.collapsable ? 'a' : 'div'
    );

    node.className = !this.pseudo ? this.CONFIG.nodeHTMLclass : 'pseudo';
    if (this.nodeHTMLclass && !this.pseudo) {
      node.className += ' ' + this.nodeHTMLclass;
    }

    const id = this.nodeHTMLid
      ? this.nodeHTMLid.toString()
      : this.id.toString();
    node.setAttribute('id', id);

    if (this.link.href && node instanceof HTMLAnchorElement) {
      node.href = this.link.href;
      node.target = this.link.target;
    }

    if ($) {
      $(node).data('treenode', this);
    } else {
      node.setAttribute(
        'data',
        JSON.stringify({
          treenode: this,
        })
      );
    }

    /////////// BUILD NODE CONTENT //////////////
    if (!this.pseudo) {
      node = this.nodeInnerHTML
        ? this.buildNodeFromHtml(node)
        : this.buildNodeFromText(node);

      // handle collapse switch
      if (
        this.collapsed ||
        (this.collapsable && this.childrenCount() && !this.stackParentId)
      ) {
        this.createSwitchGeometry(tree, node);
      }
    }

    if (this.tooltip) {
      node.appendChild(this.tooltip);
    }
    // add tooltip end

    this.addClickEventForNode(node);
    this.addMouseoverEventForNode(node);
    this.addMouseoutEventForNode(node);

    tree.CONFIG.callback.onCreateNode.apply(tree, [this, node]);

    /////////// APPEND all //////////////
    drawArea.appendChild(node);
    this.width = node.offsetWidth;
    this.height = node.offsetHeight;

    this.nodeDOM = node;
    tree.imageLoader.processNode(this);
  }

  /**
   * @param {Tree} tree
   * @param {TreeNodeDom} nodeEl
   */
  public createSwitchGeometry(
    tree: Tree,
    nodeEl?: TreeNodeDom
  ) {
    const collapsableClassElement = CollapsableNode.collapsableClassElement;

    nodeEl = nodeEl || this.nodeDOM;
    if (nodeEl.className) {
      nodeEl.className += ` ${collapsableClassElement}`;
    } else {
      nodeEl.className = ` ${collapsableClassElement}`;
    }
    this.addSwitchEvent(nodeEl);

    tree.CONFIG.callback.onCreateNodeCollapseSwitch.apply(tree, [
      this,
      nodeEl,
    ]);
    return nodeEl;
  }

  /**
   * @param nodeElement 
   */
  private addClickEventForNode(nodeElement: Element | JQuery): void {
    const self = this;
    this.util.addEvent(
      nodeElement as Element,
      'click',
      (e: Event): void | boolean => {
        self
          .getTreeConfig()
          .callback.onClickNode?.apply(self, [nodeElement, e]);
      }
    );
  }

  /**
   * @param nodeElement 
   */
  private addMouseoverEventForNode(nodeElement: Element | JQuery): void {
    const self = this;
    this.util.addEvent(
      nodeElement as Element,
      'mouseover',
      (e: Event): void | boolean => {
        e.preventDefault();

        self
          .getTreeConfig()
          .callback.onMouseoverNode?.apply(self, [nodeElement, e]);
        if (this.tooltip) {
          this.tooltip.show(this.nodeDOM);
        }
      }
    );
  }

  /**
   * @param nodeElement 
   */
  private addMouseoutEventForNode(nodeElement: Element | JQuery): void {
    const self = this;
    this.util.addEvent(
      nodeElement as Element,
      'mouseout',
      (e: Event): void | boolean => {
        e.preventDefault();

        self
          .getTreeConfig()
          .callback.onMouseoutNode?.apply(self, [nodeElement, e]);
        if (this.tooltip) {
          this.tooltip.hide();
        }
      }
    );
  }
}
