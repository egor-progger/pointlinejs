import { inject, injectable } from "inversify";
import { TreeNode } from "./TreeNode";
import { DI_LIST } from "../pointlinejs/InjectableList";
import { UTIL } from "./Util";
import "reflect-metadata";

/**
 * ImageLoader is used for determining if all the images from the Tree are loaded.
 * Node size (width, height) can be correctly determined only when all inner images are loaded
 */

@injectable()
export class ImageLoader {
  loading: string[] = [];

  constructor(@inject(DI_LIST.util) public util: UTIL) {
    return this.reset();
  }

  init() {
    return this.reset();
  }

  /**
   * @returns {ImageLoader}
   */
  reset() {
    this.loading = [];
    return this;
  }

  /**
   * @param {TreeNode} node
   * @returns {ImageLoader}
   */
  processNode(node: TreeNode) {
    var aImages = node.nodeDOM.getElementsByTagName("img");

    var i = aImages.length;
    while (i--) {
      this.create(node, aImages[i]);
    }
    return this;
  }

  /**
   * @returns {ImageLoader}
   */
  removeAll(img_src: string) {
    var i = this.loading.length;
    while (i--) {
      if (this.loading[i] === img_src) {
        this.loading.splice(i, 1);
      }
    }
    return this;
  }

  /**
   * @param {TreeNode} node
   * @param {Element} image
   * @returns {*}
   */
  create(node: TreeNode, image: HTMLImageElement) {
    var self = this,
      source = image.src;

    function imgTrigger() {
      self.removeAll(source);
      node.width = node.nodeDOM.offsetWidth;
      node.height = node.nodeDOM.offsetHeight;
    }

    if (image.src.indexOf("data:") !== 0) {
      this.loading.push(source);

      if (image.complete) {
        return imgTrigger();
      }

      this.util.addEvent(image, "load", imgTrigger);
      this.util.addEvent(image, "error", imgTrigger); // handle broken url-s

      // load event is not fired for cached images, force the load event
      image.src +=
        (image.src.indexOf("?") > 0 ? "&" : "?") + new Date().getTime();
    } else {
      imgTrigger();
    }
  }

  /**
   * @returns {boolean}
   */
  isNotLoading() {
    return this.loading.length === 0;
  }
}
