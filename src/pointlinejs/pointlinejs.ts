/*
 * PointlineJS
 *
 * (c) 2023-2025 Egor Fedoseev
 * PointlineJS may be freely distributed under the MIT license.
 *
 * PointlineJS is an open-source JavaScript library for visualization of tree diagrams.
 *
 * Author:
 * Egor Fedoseev, https://github.com/egor-progger/pointlinejs
 */

import { ImageLoader } from './vendor/treant/ImageLoader';
import { DI_LIST } from './InjectableList';
import { JSONconfig } from './vendor/treant/JSONConfig';
import { NodeDB, NodeDBState } from './vendor/treant/NodeDB';
import { ChartConfigType, NodeInterface, NodeText, Treant } from './vendor/treant/Treant';
import { Tree } from './vendor/treant/Tree';
import { TreeNode } from './vendor/treant/TreeNode';
import { TreeStore } from './vendor/treant/TreeStore';
import { UTIL } from './vendor/treant/Util';
import { PointlineActions } from './components/pointline-actions';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
// import { UpdateNodeData } from './update/interfaces/update-node';
import { Selection } from './selection/selection';
window.jQuery = window.$ = require('jquery');
require('jquery.easing');

@injectable()
export class PointlineJS {
  private treant: Treant;
  /**
   * @deprecated Array<Partial<ChartInterface> | Partial<NodeInterface>>
   * use ChartStructure type
   */
  private chartConfig: ChartConfigType;
  private tree: Tree;
  private actionsId: string;
  private actions: PointlineActions;

  constructor(chartConfig: ChartConfigType, actionsId?: string) {
    const container = new Container();
    container.bind(DI_LIST.pointlineJS).to(PointlineJS).inSingletonScope();
    container.bind(DI_LIST.treeStore).to(TreeStore).inSingletonScope();
    container.bind(DI_LIST.util).to(UTIL).inSingletonScope();
    container.bind(DI_LIST.imageLoader).to(ImageLoader).inSingletonScope();
    container.bind(DI_LIST.nodeDB).to(NodeDB).inSingletonScope();
    container.bind(DI_LIST.nodeDBState).to(NodeDBState).inSingletonScope();
    container.bind(DI_LIST.jsonConfig).to(JSONconfig).inSingletonScope();
    container.bind(DI_LIST.treeNode).to(TreeNode);
    container.bind(DI_LIST.tree).to(Tree);
    container.bind(DI_LIST.treant).to(Treant);
    container.bind(DI_LIST.selection).to(Selection)
    container.bind(DI_LIST.pointlineActions).to(PointlineActions);
    this.treant = container.get<Treant>(DI_LIST.treant);
    this.actions = container.get<PointlineActions>(DI_LIST.pointlineActions);
    this.chartConfig = chartConfig;
    this.actionsId = actionsId;
  }

  async draw() {
    const tree = await this.treant.init(this.chartConfig);
    if (tree) {
      this.tree = tree;
      if (this.actionsId) {
        const treePositioned = await tree.treePositioned;
        if (treePositioned) {
          this.actions.init(this.actionsId, this);
        }
      }
    }
  }


  /**
   * 
   * @returns {Tree}
   */
  getTree() {
    return this.tree;
  }

  destroy() {
    this.treant.destroy();
  }

  reload() {
    this.tree.reload();
  }

  resetActions() {
    this.actions.init(this.actionsId, this);
  }

  /**
   * 
   * @returns {ChartStructure}
   */

  exportTreeToJSON() {
    return this.treant.exportTreeToJSON();
  }

  /**
   * 
   * @param {selectedEl} HTMLElement
   * @param {nodeStructure} Partial<NodeInterface>
   * @returns {Promise<Partial<NodeInterface>>}
   */

  async addParentNode(selectedEl: HTMLElement, nodeStructure: Partial<NodeInterface>): Promise<Partial<NodeInterface>> {
    const tree = this.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
      var nodeTree = nodeDb[key];
      if (nodeTree.text.name == selectedEl.textContent) {
        const addedNode = await tree.addParentForNode(nodeTree, nodeStructure);
        this.reload();
        this.resetActions();
        return addedNode;
      }
    }
    return null;
  }

  /**
   * 
   * @param {selectedEl} HTMLElement
   * @param {nodeStructure} Partial<NodeInterface>
   * @returns {Promise<Partial<NodeInterface>>}
   */

  async addChildToNode(selectedEl: HTMLElement, nodeStructure: Partial<NodeInterface>): Promise<Partial<NodeInterface>> {
    const tree = this.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
      var nodeTree = nodeDb[key];
      if (nodeTree.text.name == selectedEl.textContent) {
        const selectedNodeTree = nodeTree;
        const addedNode = await tree.addChildToNode(selectedNodeTree, nodeStructure);
        this.reload();
        this.resetActions();
        return addedNode;
      }
    }
    return null;
  }

  async removeSelectedNode(selectedEl: HTMLElement): Promise<Partial<NodeInterface>> {
    const tree = this.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
      var nodeTree = nodeDb[key];
      if (nodeTree.text.name == selectedEl.textContent) {
        const addedNode = await tree.removeNode(nodeTree);
        this.reload();
        this.resetActions();
        return addedNode;
      }
    }
    return null;
  }

  /**
   * 
   * @param selectedEl 
   * @param data 
   * @returns {Promise<Partial<NodeInterface>>}
   */
  async updateSeletedNodeData(
    data: Partial<NodeText>
  ): Promise<Partial<NodeInterface>> {
    const selectedEl = this.actions.selectedElement;
    const tree = this.getTree();
    const nodeDb = tree.getNodeDb().db;
    for (var key in nodeDb) {
      var nodeTree = nodeDb[key];
      if (nodeTree.text.name == selectedEl.textContent) {
        const selectedNodeTree = nodeTree;
        const updatedNode = await tree.updateNode(selectedNodeTree, data);
        this.reload();
        this.resetActions();
        return updatedNode;
      }
    }
    return null;
  }

  /**
   * @description scroll to center of tree
   */
  positionToCenterOfTree(): void {
    const chartConfig = this.treant.getJsonConfig();
    const container = document.querySelector(chartConfig.chart.container);
    container.scrollLeft = container.scrollWidth / 2 - container.clientWidth / 2;
  }
}
