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
import { Container } from 'inversify';
import 'reflect-metadata';
window.jQuery = window.$ = require('jquery');
require('jquery.easing');

export class PointlineJS {
  private treant: Treant;
  private chartConfig: ChartConfigType;
  private tree: Promise<Tree>;

  constructor(chartConfig: ChartConfigType) {
    const container = new Container();
    container.bind(DI_LIST.treeStore).to(TreeStore).inSingletonScope();
    container.bind(DI_LIST.util).to(UTIL).inSingletonScope();
    container.bind(DI_LIST.imageLoader).to(ImageLoader).inSingletonScope();
    container.bind(DI_LIST.nodeDB).to(NodeDB).inSingletonScope();
    container.bind(DI_LIST.nodeDBState).to(NodeDBState).inSingletonScope();
    container.bind(DI_LIST.jsonConfig).to(JSONconfig).inSingletonScope();
    container.bind(DI_LIST.treeNode).to(TreeNode);
    container.bind(DI_LIST.tree).to(Tree);
    container.bind(DI_LIST.treant).to(Treant);
    this.treant = container.get<Treant>(DI_LIST.treant);
    this.chartConfig = chartConfig;
  }

  draw() {
    this.tree = this.treant.init(this.chartConfig);
  }

  getTree() {
    return this.tree;
  }

  destroy() {
    this.treant.destroy();
  }

  async reload() {
    (await this.tree).reload();
  }
}
