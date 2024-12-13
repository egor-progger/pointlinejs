/*
 * PointlineJS
 *
 * (c) 2023 Egor Fedoseev
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
import { ChartConfigType, Treant } from './vendor/treant/Treant';
import { Tree } from './vendor/treant/Tree';
import { TreeNode } from './vendor/treant/TreeNode';
import { TreeStore } from './vendor/treant/TreeStore';
import { UTIL } from './vendor/treant/Util';
import { PointlineActions } from './components/pointline-actions';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
window.jQuery = window.$ = require('jquery');
require('jquery.easing');

@injectable()
export class PointlineJS {
  private treant: Treant;
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
    container.bind(DI_LIST.pointlineActions).to(PointlineActions);
    this.treant = container.get<Treant>(DI_LIST.treant);
    this.actions = container.get<PointlineActions>(DI_LIST.pointlineActions);
    this.chartConfig = chartConfig;
    this.actionsId = actionsId;
  }

  // private treePositionedCallback(tree: Tree) {
  //   console.log('treePositionedCallback');
  //   console.log(tree);
  //   // this.treePositionedResolve(true);
  // }

  async draw() {
    const tree = await this.treant.init(this.chartConfig);
    console.log('draw');
    console.log(tree);
    if (tree) {
      this.tree = tree;
      if (this.actionsId) {
        const treePositioned = await tree.treePositioned;
        if (treePositioned) {
          this.actions.init(this.actionsId, this);
        }
      }
    }
    console.log('draw');
    console.log(this.tree);
  }

  getTree() {
    console.log('getTree');
    console.log(this.tree);
    return this.tree;
  }

  destroy() {
    this.treant.destroy();
  }

  reload() {
    console.log('reload');
    this.tree.reload();
  }
}
