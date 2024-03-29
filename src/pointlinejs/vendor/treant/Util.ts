import { injectable } from 'inversify';
import $ from 'jquery';
import { ElementWithSupportIE } from './Treant';

@injectable()
export class UTIL {
  private readonly hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Directly updates, recursively/deeply, the first object with all properties in the second object
   * @param {object} applyTo
   * @param {object} applyFrom
   * @return {object}
   */
  inheritAttrs(
    applyTo: Record<string, object>,
    applyFrom: Record<string, object>
  ) {
    for (var attr in applyFrom) {
      if (applyFrom.hasOwnProperty(attr)) {
        if (
          typeof applyTo[attr] === 'object' &&
          typeof applyFrom[attr] === 'object' &&
          typeof applyFrom[attr] !== 'function'
        ) {
          this.inheritAttrs(
            applyTo[attr] as Record<string, object>,
            applyFrom[attr] as Record<string, object>
          );
        } else if (typeof applyFrom[attr] === 'object' && this.hasOwnProperty.call(applyFrom, attr)) {
          applyTo[attr] = applyFrom[attr];
        }
      }
    }
    return applyTo;
  }

  /**
   * Returns a new object by merging the two supplied objects
   * @deprecated
   * @param {object} obj1
   * @param {object} obj2
   * @returns {object}
   */
  createMerge(obj1: any, obj2: any) {
    var newObj = {};
    if (obj1) {
      this.inheritAttrs(newObj, this.cloneObj(obj1));
    }
    if (obj2) {
      this.inheritAttrs(newObj, obj2);
    }
    return newObj;
  }

  /**
   * Takes any number of arguments
   * @returns {*}
   */
  extend(...args: any) {
    if (typeof $ !== 'undefined') {
      Array.prototype.unshift.apply(args, [true, {}]);
      return $.extend.apply($, args);
    } else {
      return this.createMerge.apply(this, args);
    }
  }

  // /**
  //  * @param {object} obj
  //  * @returns {*}
  //  */
  cloneObj(obj: any) {
    if (Object(obj) !== obj) {
      return obj;
    }
    var res = new (obj as { constructor: new () => object }).constructor();
    for (var key in obj) {
      if (typeof obj === 'object' && obj.hasOwnProperty(key)) {
        (res as Record<string, object>)[key] = this.cloneObj(
          (obj as Record<string, object>)[key] as Record<string, object>
        );
      }
    }
    return res;
  }

  // /**
  //  * @param {Element} el
  //  * @param {string} eventType
  //  * @param {function} handler
  //  */
  addEvent(el: Element, eventType: string, handler: (event: Event) => void) {
    if ($) {
      $(el).on(eventType + '.treant', handler);
    } else if (el.addEventListener) {
      // DOM Level 2 browsers
      el.addEventListener(eventType, handler, false);
    } else if ((el as ElementWithSupportIE)['attachEvent']) {
      // IE <= 8
      let elementInOldIE = el as ElementWithSupportIE;
      elementInOldIE.attachEvent('on' + eventType, handler);
    } else {
      // ancient browsers
      (el as any)['on' + eventType] = handler;
    }
  }

  // /**
  //  * @param {string} selector
  //  * @param {boolean} raw
  //  * @param {Element} parentEl
  //  * @returns {Element|jQuery}
  //  */
  findEl(selector: string, raw: boolean, parentEl?: Element): Element | JQuery {
    const element = parentEl || window.document;

    if ($) {
      var $element = $(selector, parentEl);
      return raw ? $element.get(0) : $element;
    } else {
      // todo: getElementsByName()
      // todo: getElementsByTagName()
      // todo: getElementsByTagNameNS()
      if (selector.charAt(0) === '#') {
        return (element as Document).getElementById(selector.substring(1));
      } else if (selector.charAt(0) === '.') {
        var oElements = element.getElementsByClassName(selector.substring(1));
        return oElements.length ? oElements[0] : null;
      }

      throw new Error('Unknown container element');
    }
  }

  getOuterHeight(element: ElementWithSupportIE) {
    var nRoundingCompensation = 1;
    if (typeof element.getBoundingClientRect === 'function') {
      return element.getBoundingClientRect().height;
    } else if ($) {
      return Math.ceil($(element).outerHeight()) + nRoundingCompensation;
    } else {
      return Math.ceil(
        element.clientHeight +
        (this.getStyle(element, 'border-top-width', true) as number) +
        (this.getStyle(element, 'border-bottom-width', true) as number) +
        (this.getStyle(element, 'padding-top', true) as number) +
        (this.getStyle(element, 'padding-bottom', true) as number) +
        nRoundingCompensation
      );
    }
  }

  getOuterWidth(element: ElementWithSupportIE) {
    var nRoundingCompensation = 1;
    if (typeof element.getBoundingClientRect === 'function') {
      return element.getBoundingClientRect().width;
    } else if ($) {
      return Math.ceil($(element).outerWidth()) + nRoundingCompensation;
    } else {
      return Math.ceil(
        element.clientWidth +
        (this.getStyle(element, 'border-left-width', true) as number) +
        (this.getStyle(element, 'border-right-width', true) as number) +
        (this.getStyle(element, 'padding-left', true) as number) +
        (this.getStyle(element, 'padding-right', true) as number) +
        nRoundingCompensation
      );
    }
  }

  getStyle(element: ElementWithSupportIE, strCssRule: string, asInt: boolean) {
    var strValue = '';
    if (document.defaultView && document.defaultView.getComputedStyle) {
      strValue = document.defaultView
        .getComputedStyle(element, '')
        .getPropertyValue(strCssRule);
    } else if (element.currentStyle) {
      strCssRule = strCssRule.replace(
        /\-(\w)/g,
        function (strMatch: string, p1: string) {
          return p1.toUpperCase();
        }
      );
      strValue = element.currentStyle[strCssRule];
    }
    //Number(elem.style.width.replace(/[^\d\.\-]/g, ''));
    return asInt ? parseFloat(strValue) : strValue;
  }

  addClass(element: HTMLElement, cssClass: string) {
    if ($) {
      $(element).addClass(cssClass);
    } else {
      if (!this.hasClass(element, cssClass)) {
        if (element.classList) {
          element.classList.add(cssClass);
        } else {
          element.className += ' ' + cssClass;
        }
      }
    }
  }

  hasClass(element: HTMLElement, my_class: string) {
    return (
      (' ' + element.className + ' ')
        .replace(/[\n\t]/g, ' ')
        .indexOf(' ' + my_class + ' ') > -1
    );
  }

  toggleClass(element: Element, cls: string, apply: boolean) {
    if ($) {
      $(element).toggleClass(cls, apply);
    } else {
      if (apply) {
        //element.className += " "+cls;
        element.classList.add(cls);
      } else {
        element.classList.remove(cls);
      }
    }
  }

  setDimensions(element: HTMLElement, width: number, height: number) {
    if ($) {
      $(element).width(width).height(height);
    } else {
      element.style.width = width + 'px';
      element.style.height = height + 'px';
    }
  }

  isjQueryAvailable() {
    return typeof $ !== 'undefined' && $;
  }
}
