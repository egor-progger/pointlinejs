import { ImageLoader } from "@treantjs/ImageLoader";
import { DI_LIST } from "@treantjs/InjectableList";
import { JSONconfig } from "@treantjs/JSONConfig";
import { NodeDB, NodeDBState } from "@treantjs/NodeDB";
import { ChartConfigType, Treant } from "@treantjs/Treant";
import { Tree } from "@treantjs/Tree";
import { TreeNode } from "@treantjs/TreeNode";
import { TreeStore } from "@treantjs/TreeStore";
import { UTIL } from "@treantjs/Util";
import { Container } from "inversify";
import "reflect-metadata";
window.jQuery = window.$ = require('jquery');
require('jquery.easing');

export class GraphJS {
    private treant: Treant;
    private chartConfig: ChartConfigType;

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
        this.treant.init(this.chartConfig);
    }
}