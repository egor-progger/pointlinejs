import { inject, injectable } from "inversify";
import { TreeNode } from "./TreeNode";
import { UTIL } from "./Util";
import { DI_LIST } from "../pointlinejs/InjectableList";
import { NodeInterface } from "./Treant";
import { Tree } from "./Tree";

@injectable()
export class NodeDBState {
  totalNodes: number;
  nodesWithHeightAndWidth: Set<number> = new Set();
  dbReadyResolve: (value: boolean | PromiseLike<boolean>) => void;
  dbReadyReject: (value: boolean | PromiseLike<boolean>) => void;
  dbReady: Promise<boolean> | null = new Promise((resolve, reject) => {
    this.dbReadyResolve = resolve;
    this.dbReadyReject = reject;
  });
}

@injectable()
export class NodeDB {
  protected util: UTIL = new UTIL();
  private db: TreeNode[] = [];

  constructor(@inject(DI_LIST.nodeDBState) public nodeDBState: NodeDBState) {
  }

  get size(): number {
    return this.db.length;
  }

  /**
 * NodeDB is used for storing the nodes. Each tree has its own NodeDB.
 * @param {object} nodeStructure
 * @param {Tree} tree
 * @constructor
 */
  init(nodeStructure: Partial<NodeInterface>, tree: Tree) {
    return this.reset(nodeStructure, tree);
  }

  /**
   * @param {object} node
   * @param {number} parentId
   */
  private iterateChildren(node: Partial<NodeInterface>, parentId: number, tree?: Tree) {
    var newNode = this.createNode(node, parentId, tree, null);

    if (node.children) {
      // pseudo node is used for descending children to the next level
      if (node.childrenDropLevel && node.childrenDropLevel > 0) {
        while (node.childrenDropLevel--) {
          // pseudo node needs to inherit the connection style from its parent for continuous connectors
          var connStyle = this.util.cloneObj(newNode.connStyle);
          newNode = this.createNode("pseudo", newNode.id, tree, null);
          newNode.connStyle = connStyle;
          newNode.children = [];
        }
      }

      var stack =
        node.stackChildren && !this.hasGrandChildren(node) ? newNode.id : null;

      // children are positioned on separate levels, one beneath the other
      if (stack !== null) {
        newNode.stackChildren = [];
      }

      for (var i = 0, len = node.children.length; i < len; i++) {
        if (stack !== null) {
          newNode = this.createNode(node.children[i], newNode.id, tree, stack);
          if (i + 1 < len) {
            // last node cant have children
            newNode.children = [];
          }
        } else {
          this.iterateChildren(node.children[i], newNode.id, tree);
        }
      }
    }
  }

  /**
   * @param {object} nodeStructure
   * @param {Tree} tree
   * @returns {NodeDB}
   */
  private reset(nodeStructure: Partial<NodeInterface>, tree: Tree) {
    this.db = [];

    if (tree.CONFIG.animateOnInit) {
      nodeStructure.collapsed = true;
    }

    this.iterateChildren(nodeStructure, -1, tree); // root node
    this.createGeometries(tree);
    return this;
  }

  /**
   * @param {Tree} tree
   * @returns {NodeDB}
   */
  private createGeometries(tree: Tree): NodeDB {
    var i = this.db.length;
    this.nodeDBState.totalNodes = this.db.length;
    const logTimeout = (nodeDb: TreeNode, nodeDBState: NodeDBState) => {
      nodeDBState.nodesWithHeightAndWidth.add(nodeDb.id);
      if (nodeDBState.totalNodes === nodeDBState.nodesWithHeightAndWidth.size) {
        this.nodeDBState.dbReadyResolve(true);
      }
    };

    while (i--) {
      this.get(i).createGeometry(tree);
      setTimeout(logTimeout, 100, this.get(i), this.nodeDBState);
    }
    return this;
  }

  /**
   * @param {number} nodeId
   * @returns {TreeNode}
   */
  get(nodeId: number): TreeNode {
    return this.db[nodeId]; // get TreeNode by ID
  }

  /**
   * @deprecated
   * @param {function} callback
   * @returns {NodeDB}
   */
  walk(callback: (node: TreeNode) => void) {
    var i = this.db.length;

    while (i--) {
      callback.apply(this, [this.get(i)]);
    }
    return this;
  }

  /**
   *
   * @param {object} nodeStructure
   * @param {number} parentId
   * @param {Tree} tree
   * @param {number} stackParentId
   * @returns {TreeNode}
   */
  private createNode(
    nodeStructure: Partial<NodeInterface> | 'pseudo',
    parentId: number,
    tree: Tree,
    stackParentId: number | null
  ) {
    const node = new TreeNode(tree).init(
      nodeStructure,
      this.db.length,
      parentId,
      tree,
      stackParentId
    );

    this.db.push(node);

    // skip root node (0)
    if (parentId >= 0) {
      var parent = this.get(parentId);

      // todo: refactor into separate private method
      if (typeof node.pseudo !== 'undefined' && node.pseudo === false) {
        const nodeStructureValue = nodeStructure as Partial<NodeInterface>;
        if (nodeStructureValue.position) {
          if (nodeStructureValue.position === "left") {
            parent.children.push(node.id);
          } else if (nodeStructureValue.position === "right") {
            parent.children.splice(0, 0, node.id);
          } else if (nodeStructureValue.position === "center") {
            parent.children.splice(
              Math.floor(parent.children.length / 2),
              0,
              node.id
            );
          } else {
            // edge case when there's only 1 child
            const position = parseInt(nodeStructureValue.position, 10);
            if (parent.children.length === 1 && position > 0) {
              parent.children.splice(0, 0, node.id);
            } else {
              parent.children.splice(
                Math.max(position, parent.children.length - 1),
                0,
                node.id
              );
            }
          }
        }
      } else {
        parent.children.push(node.id);
      }
    }

    if (stackParentId) {
      this.get(stackParentId).stackParent = true;
      this.get(stackParentId).stackChildren.push(node.id);
    }

    return node;
  }

  getMinMaxCoord(dim: 'X' | 'Y', parent: TreeNode, MinMax: { min: number, max: number }) {
    // used for getting the dimensions of the tree, dim = 'X' || 'Y'
    // looks for min and max (X and Y) within the set of nodes
    parent = parent || this.get(0);

    MinMax = MinMax || {
      // start with root node dimensions
      min: parent[dim],
      max: parent[dim] + (dim === "X" ? parent.width : parent.height),
    };

    var i = parent.childrenCount();

    while (i--) {
      var node = parent.childAt(i),
        maxTest = node[dim] + (dim === "X" ? node.width : node.height),
        minTest = node[dim];

      if (maxTest > MinMax.max) {
        MinMax.max = maxTest;
      }
      if (minTest < MinMax.min) {
        MinMax.min = minTest;
      }

      this.getMinMaxCoord(dim, node, MinMax);
    }
    return MinMax;
  }

  /**
   * @param {object} nodeStructure
   * @returns {boolean}
   */
  private hasGrandChildren(nodeStructure: Partial<NodeInterface>) {
    var i = nodeStructure.children.length;
    while (i--) {
      if (
        nodeStructure.children[i].children &&
        nodeStructure.children[i].children.length > 0
      ) {
        return true;
      }
    }
    return false;
  }
}
