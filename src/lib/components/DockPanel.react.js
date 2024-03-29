import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    DockPanel as l_DockPanel, Widget
} from '@lumino/widgets';
import { components, props_id } from '../registry.js';
import { any, none } from 'ramda';



/**
 * A widget which provides a flexible docking area for widgets.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/dockpanel.html}
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash
 * import dash_lumino_components as dlc
 * 
 * dock = dlc.DockPanel([
 *     dlc.Widget(
 *         "Example Content",
 *         id="initial-widget",
 *         title="Hallo",
 *         icon="fa fa-folder-open",
 *         closable=True)
 * ], id="dock-panel")
 */
class DockPanel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new BoxPanel
        super.register(new l_DockPanel({
            mode: props.mode,
            spacing: props.spacing
        }), props.addToDom);

        this.added_ids = [];
        this.id = this.props.id;

        components[this.props.id].lumino.layoutModified.connect(() => {
            this.updateLayout();
        }, this);
    }



    /**
     * Handle lumnino widget events like lumino:deleted, lumino:activated
     * Note: There seem to be some probelms with removing dash components!
     * Currently only the dom elements are moved back to their initial position
     * and the lumino component is deleted. In the future we want to clean up
     * the children of the dock also here!
     * @param {*} msg 
     * @ignore
     */
    handleWidgetEvent(msg) {
        const widgetid = msg.srcElement.id;
        const widget = components[widgetid];

        if (msg.type === "lumino:deleted") {
            super.move2Dash(widget);
        }

        const parentid = widget.lumino._parent.node.id;
        const that = components[parentid].dash;
        const { setProps } = that.props;

        setProps({
            widgetEvent: { id: widgetid, type: msg.type, timestamp: +new Date }
        });
    }




    /** 
     * Serialize the layout without widget instances
     */
    updateLayout() {
        let input = components[this.props.id].lumino.saveLayout();

        let layout = JSON.parse(JSON.stringify(input, (key, value) => {
            // Exclude widget details from serialization
            if (key === 'widgets') {
                return value.map((e) => e.node.id);
            }
            return value;
        }));

        const { setProps } = this.props;
        setTimeout(() => {
            setProps({
                layout: layout
            });
        }, 100);
    }

    /**
     * Function to load the layout back in
     * 
     * recursively replace the widgets in the components dictionary
     * @param {} newlayout 
     */
    loadLayout(newlayout) {

        newlayout = JSON.parse(JSON.stringify(newlayout));

        function updateWidgets(layout, components) {
            if (!layout || typeof layout !== 'object') {
                return; // Check if layout is null or not an object
            }

            if (Array.isArray(layout)) {
                layout.forEach(item => updateWidgets(item, components));
            } else {
                Object.keys(layout).forEach(key => {
                    if (Array.isArray(layout[key])) {
                        if (key === "widgets") {
                            
                            layout[key] = layout[key].map(widget => (components[widget] && components[widget].lumino) ? components[widget].lumino : null).filter(w => w !== null);
                        } else {
                            updateWidgets(layout[key], components);
                        }
                    } else if (typeof layout[key] === 'object') {
                        updateWidgets(layout[key], components);
                    }
                });
            }
        }

        updateWidgets(newlayout, components);

        components[this.props.id].lumino.restoreLayout(newlayout);
    }


    componentDidUpdate(prevProps) {
        // Check if the layout prop has changed
        if (this.props.layout !== prevProps.layout) {
            // Update the layout
            this.loadLayout(this.props.layout);
        }
    }

    render() {

        // add the children of the component also to the widget list of the lumino widget
        if (this.props.children) {

            let current_ids = [];
            super.parseChildrenToArray().forEach(el => {


                // check if react element has all important entries to be a widget
                if (el.props && el.props._dashprivate_layout && el.props._dashprivate_layout.props) {

                    // fill the list of current widgets
                    current_ids.push(props_id(el.props._dashprivate_layout));

                    //check if the widget is not yet registered
                    if (!this.added_ids.includes(props_id(el.props._dashprivate_layout))) {

                        super.applyAfterLuminoChildCreation(el, (target, child) => {
                            target.lumino.addWidget(child.lumino);
                            child.lumino.node.addEventListener('lumino:deleted', target.dash.handleWidgetEvent);
                            child.lumino.node.addEventListener('lumino:activated', target.dash.handleWidgetEvent);
                            target.lumino.selectWidget(child.lumino);

                        });
                        this.added_ids.push(props_id(el.props._dashprivate_layout));

                        const { setProps } = this.props;
                        setTimeout(() => {
                            setProps({
                                widgetEvent: {
                                    id: props_id(el.props._dashprivate_layout),
                                    type: "lumino:activated",
                                    timestamp: +new Date
                                }
                            });
                        }, 100)

                    }
                }

            });

            //check if we have widgets in the list, which need to be closed
            let widgets_to_delete = this.added_ids.filter(el => !current_ids.includes(el));

            //dispose all the components created for the widget
            widgets_to_delete.forEach(el => {
                components[el].lumino.dispose();
                delete components[el].lumino;
                delete components[el].dash;
                delete components[el].div;
                delete components[el];

                this.added_ids = this.added_ids.filter(id => id !== el);
            });


        } else {
            // if the children parameter is empty or unset, all open widgets have to be deleted
            this.added_ids.forEach(el => {
                components[el].lumino.dispose();
                delete components[el].lumino;
                delete components[el].dash;
                delete components[el].div;
                delete components[el];
            });
            this.added_ids = [];
        }


        return super.render();
    }

}

DockPanel.defaultProps = {
    mode: 'multiple-document',
    spacing: 4,
    addToDom: false,
};

/**
 * @typedef
 * @enum {}
 */
DockPanel.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * mode for the dock panel: ("single-document" | "multiple-document")
     * @type {string}
     */
    mode: PropTypes.string,

    /**
     * The spacing between the items in the panel.
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
     * @type {Widget[]}
     */
    children: PropTypes.node,


    /**
     * Widget events
     * @type {PropTypes.any}
     */
    widgetEvent: PropTypes.any,


    /**
     * Layout similar to DockPanel.ILayoutConfig (https://phosphorjs.github.io/phosphor/api/widgets/interfaces/docklayout.ilayoutconfig.html)
     * 
     * Examples:
     * * {"main": {"type": "tab-area", "widgets": ["initial-widget2", "initial-widget"], "currentIndex": 1}}
     * * {"main": {"type": "split-area", "orientation": "horizontal", "children": [{"type": "tab-area", "widgets": ["initial-widget2"], "currentIndex": 0}, {"type": "tab-area", "widgets": ["initial-widget"], "currentIndex": 0}], "sizes": [0.5, 0.5]}}
     * * {"main": {"type": "split-area", "orientation": "vertical", "children": [{"type": "tab-area", "widgets": ["initial-widget2"], "currentIndex": 0}, {"type": "tab-area", "widgets": ["initial-widget"], "currentIndex": 0}], "sizes": [0.5, 0.5]}}
     * 
     * Note! Use widget id in widget arrays!
     * 
     * @type {PropTypes.any}
     */
    layout: PropTypes.any,


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
export default DockPanel;
