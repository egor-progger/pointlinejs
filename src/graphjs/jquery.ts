
import $ from 'jquery';
// import * as easing from 'jquery.easing';
// const jQuery = require('jquery');
// console.log(jQuery);
// require('jquery.easing')(jQuery);

// window['jQuery'] = $;

class jQueryWithPlugins {
    private jqueryInstance: JQueryStatic = $;
    constructor() {
        console.log(`jQuery constructor`);
        console.log(this.jqueryInstance);
        console.log(window.jQuery);
        // easing();
    }
    get instance() {
        return this.jqueryInstance;
    }
}

// declare var jQuery = new jQueryWithPlugins().instance;

export const jquery = new jQueryWithPlugins().instance;
module.exports = { jquery }