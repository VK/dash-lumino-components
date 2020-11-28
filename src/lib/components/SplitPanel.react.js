import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'
import { components } from '../registry.js';

import {
    SplitPanel as l_SplitPanel,
    Panel as l_Panel,
    DockPanel,
    TabPanel,
    BoxPanel,
    Panel
} from '@lumino/widgets';

/**
 * A panel which arranges its widgets into resizable sections.   
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/splitpanel.html}
 * @hideconstructor
 * 
 * @example
 * import dash_lumino_components as dlc
 * 
 * dlc.SplitPanel([
 *    dlc.TabPanel([], id="tab-panel"),
 *    dlc.DockPanel([], id="dock-panel")
 * ], id="split-panel")
 */
class SplitPanel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new SplitPanel
        let luminoComponent = super.register(new l_SplitPanel({
            alignment: props.alignment,
            orientation: props.orientation,
            spacing: props.spacing
        }), props.addToDom, false);

        // do a special resize to keep the size of the fixed
        // side panels at the same size
        let that = this;
        window.addEventListener("resize", function () {
            luminoComponent.update();
            that.updateSizes();
        });

        // add the children of the component to the widgets of the panel
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterLuminoChildCreation(el, (target, child) => {



                    let tabBar = child.lumino.tabBar;
                    let stackedPanel = child.lumino.stackedPanel;
                    let tabPlacement = child.lumino.tabPlacement;
                    if (tabBar && stackedPanel && tabPlacement &&
                        (tabPlacement === "left" || tabPlacement === "right")) {

                        // add ids to the special items of the TabPanel
                        stackedPanel.id = child.dash.props.id + "-stackedPanel";
                        tabBar.id = child.dash.props.id + "-tabBar";

                        // add the content panel directly
                        target.lumino.addWidget(stackedPanel);


                        //create an extra panel for the tabbar
                        const tabBarContainer = new l_Panel();
                        tabBarContainer.addClass('tabBarContainer');
                        tabBarContainer.addWidget(tabBar);
                        tabBar.addClass('lm-SideBar');
                        tabBar.addClass('lm-mod-' + tabPlacement);

                        //store the original component order
                        let oldWidgets = new Array(...target.lumino.parent.widgets);

                        //add the tabbar panel to the parent container
                        target.lumino.parent.addWidget(tabBarContainer);

                        //if the tabpanel is placed on the left, we can enshure this
                        // by adding all old panels again
                        if (tabPlacement === "left") {
                            oldWidgets.forEach(el => {
                                target.lumino.parent.addWidget(el);
                            })
                        }

                    } else {
                        // in all other cases just add the lumino widget to the container
                        target.lumino.addWidget(child.lumino);
                    }
                });
            })
        }

    }


    /**
     * Redistribute the sizes if the total size chanches. Panel sizes of split panes are
     * taken from the width parameter, if they are not hidden.
     * Panels with undefined width are equally spread.
     * @private
     */
    updateSizes() {

        let w = components[this.id].lumino.widgets.map(el => {
            if (el.isHidden) {
                return 0;
            } else {
                return components[el.id.replace("-stackedPanel", "")].dash.props.width;
            }
        })
        let sum_w = sum_w = w.reduce((a, c) => Number.isFinite(c) ? a + c : a, 0);
        let count_undef = w.reduce((a, c) => Number.isFinite(c) ? a : a + 1, 0);
        let replaceSize = (components[this.id].dash.props.orientation === 'horizontal') ? (window.innerWidth - sum_w) / count_undef : (window.innerHeight - sum_w) / count_undef;
        replaceSize = Math.max(replaceSize, 100);
        let sizes = w.map(el => Number.isFinite(el) ? el : replaceSize);

        components[this.id].lumino.setRelativeSizes(sizes);
    }


    render() {
        return super.render();
    }

}

SplitPanel.defaultProps = {
    alignment: 'start',
    orientation: 'horizontal',
    spacing: 0,
    addToDom: false,
};

/**
 * @typedef
 * @enum {}
 */
SplitPanel.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * the content alignment of the layout ("start" | "center" | "end" | "justify")
     * @type {string}
     */
    alignment: PropTypes.string,

    /**
      * a type alias for a split layout orientation ("horizontal" | "vertical")
      * @type {string}
      */
    orientation: PropTypes.string,

    /**
     * The spacing between items in the layout
     * @type {number}
     */
    spacing: PropTypes.number,

    /**
     * bool if the object has to be added to the dom directly
     * @type {boolean}
     */
    addToDom: PropTypes.bool,

    /**
     * The widgets
     * @type {Array<DockPanel, TabPanel, BoxPanel, Panel>}
     */
    children: PropTypes.node
};


/**
 * @private
 */
export default SplitPanel;