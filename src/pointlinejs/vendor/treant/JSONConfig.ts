// #############################################
// Makes a JSON chart config out of Array config
// #############################################

import { injectable } from 'inversify';
import { ChartInterface, ChartStructure, NodeInterface } from './Treant';

@injectable()
export class JSONconfig {
  private json_id = 1;
  private jsonStructure: ChartStructure;

  make(configArray: Array<Partial<ChartInterface> | Partial<NodeInterface>>) {
    var i = configArray.length,
      node;

    this.jsonStructure = {
      chart: null,
      nodeStructure: null,
    };
    //fist loop: find config, find root;
    while (i--) {
      node = configArray[i];
      if (node.hasOwnProperty('container')) {
        this.jsonStructure.chart = node;
        continue;
      }

      if (!node.hasOwnProperty('parent') && !node.hasOwnProperty('container')) {
        this.jsonStructure.nodeStructure = node as Partial<NodeInterface>;
        (node as Partial<NodeInterface>)._json_id = 0;
      }
    }

    this.findChildren(configArray);

    return this.jsonStructure;
  }

  private findChildren(nodes: Partial<ChartInterface | NodeInterface>[]) {
    var parents = [0]; // start with a a root node

    while (parents.length) {
      const parentId: number = parents.pop() as number;
      const parent = this.findNode(this.jsonStructure.nodeStructure, parentId);
      var i = 0,
        len = nodes.length,
        children = [];

      for (; i < len; i++) {
        var node = nodes[i];
        if ((node as Partial<NodeInterface>)['parent']) {
          const nodeValue = node as NodeInterface;
          if (nodeValue.parent && nodeValue.parent._json_id === parentId) {
            // skip config and root nodes

            nodeValue._json_id = this.getID();

            delete nodeValue.parent;

            children.push(node);
            parents.push(nodeValue._json_id);
          }
        }
      }

      if (children.length) {
        parent.children = children as Partial<NodeInterface>[];
      }
    }
  }

  private findNode(
    node: Partial<NodeInterface>,
    nodeId: number
  ): Partial<NodeInterface> {
    var childrenLen, found;

    if (node._json_id === nodeId) {
      return node;
    } else if (node.children) {
      childrenLen = node.children.length;
      while (childrenLen--) {
        found = this.findNode(node.children[childrenLen], nodeId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private getID() {
    return this.json_id++;
  }
}
