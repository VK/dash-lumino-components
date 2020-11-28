import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'
import { components } from '../registry.js';

import {
    TabPanel as l_TabPanel
} from '@lumino/widgets';

/**
 * A widget which combines a TabBar and a StackedPanel.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/tabpanel.html}
 * 
 * This is a simple panel which handles the common case of a tab bar placed
 * next to a content area. The selected tab controls the widget which is
 * shown in the content area.
 * For use cases which require more control than is provided by this panel,
 * the TabBar widget may be used independently.
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash
 * import dash_lumino_components as dlc
 * import dash_html_components as html
 * import dash_bootstrap_components as dbc
 * 
 * tabPanel = dlc.TabPanel(
 *     [
 *         dlc.Panel(
 *             html.Div([
 *                 dbc.Button("Open Plot",
 *                            id="button2",
 *                            style={"width": "100%"})
 *             ]),
 *             id="tab-panel-A"
 *             label="Plots",
 *             icon="fa fa-bar-chart")
 *     ],
 *     id='tab-panel-left')
 */
class TabPanel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new TabPanel
        let luminoComponent = super.register(new l_TabPanel({
            tabPlacement: props.tabPlacement,
            tabsMovable: props.tabsMovable,
        }), props.addToDom);

        // set additional properties
        luminoComponent.tabBar.allowDeselect = props.allowDeselect;
        if (props.allowDeselect) {
            // if the user is allow to deselect items, panel should hide if nothing is selected
            // this is handeled by the _onTabIndexChanged callback
            luminoComponent.currentChanged.connect(
                this._onTabIndexChanged,
                this
            );
        }


        /*
                console.log(components[this.props.id]);
                let tabBar = components[this.props.id].lumino.tabBar;
                let stackedPanel = components[this.props.id].lumino.stackedPanel;
        
                console.log(tabBar);
                console.log(stackedPanel);
        */


        // we need to update the tabpanel width once the user resizes the window
        let that = this;
        let st_panel = luminoComponent.stackedPanel;
        luminoComponent.stackedPanel.onResize = (msg) => {

            const { setProps } = that.props;
            let rel_sizes = st_panel.parent.relativeSizes();
            let idx = st_panel.parent.widgets.indexOf(st_panel);

            if (idx != -1) {
                setProps({ width: rel_sizes[idx] * window.innerWidth });
            }
        };



        //add the children of the component to the widgets of the panel
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterLuminoChildCreation(el, (target, child) => {
                    target.lumino.addWidget(child.lumino);
                    target.lumino.currentIndex = target.dash.props.currentIndex;
                });
            })
        }

    }

    /**
     * this callback hids the stackedpanel if no tab is selected
     * to make everything seamless, the resizing is handeled here
     * @private
     */
    _onTabIndexChanged() {
        if (components[this.id] == null)
            return;

        let tabBar = components[this.id].lumino.tabBar;
        let stackedPanel = components[this.id].lumino.stackedPanel;

        if (tabBar != null && stackedPanel != null) {

            let { setProps } = components[this.id].dash.props;
            setProps({ currentIndex: tabBar.currentIndex });

            if (tabBar.currentIndex == -1) {
                let sizes = stackedPanel.parent.relativeSizes();
                stackedPanel.hide();
            } else {
                stackedPanel.show();
            }
            components[stackedPanel.parent.id].dash.updateSizes();
        } else {
            return;
        }
    }


    render() {
        if (components[this.id]) {
            components[this.id].lumino.currentIndex = this.props.currentIndex;
        }
        return super.render();
    }

}

TabPanel.defaultProps = {
    tabPlacement: 'top',
    tabsMovable: false,
    allowDeselect: false,
    addToDom: false,
    width: 250,
    currentIndex: -1
};

/**
 * @typedef
 * @enum {}
 */
TabPanel.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * the placement of the tab bar relative to the content. ("left" | "right" | "top" | "bottom")
     * @type {string}
     */
    tabPlacement: PropTypes.string,

    /**
     * whether the tabs are movable by the user
     * @type {boolean}
     */
    tabsMovable: PropTypes.bool,

    /**
     * bool if all tabs can be deselected
     * @type {boolean}
     */
    allowDeselect: PropTypes.bool,

    /**
     * the default width or height of the tab panel content
     * @type {number}
     */
    width: PropTypes.number,

    /**
     * bool if the object has to be added to the dom directly
     * @type {boolean}
     */
    addToDom: PropTypes.bool,

    /**
     * The widgets
     * @type {Panel[]}
     */
    children: PropTypes.node,

    /**
     * Get the index of the currently selected tab. It will be -1 if no tab is selected.
     * @type {number}
     */
    currentIndex: PropTypes.number,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     * @private
     */
    setProps: PropTypes.func
};


/**
 * @private
 */
export default TabPanel;