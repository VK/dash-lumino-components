import { Fragment } from 'react';
import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    Widget as l_Widget
} from '@lumino/widgets';
import { components } from '../registry.js';


/**
 * Wrap the default Lumino Widget with an event once the widget is closed
 * @private
 */
class LuminoWidget extends l_Widget {

    constructor(props) {
        super(props)
    }

    onCloseRequest(msg) {
        const dom_element = document.getElementById(this.id);
        const event = new CustomEvent('lumino:deleted', { msg: msg, id: this.id });

        //Note: this might dissapear if widgets can be deleted from the DockPanel
        // children in the future!
        let { setProps } = components[this.id].dash.props;
        setProps({ deleted: true });


        dom_element.dispatchEvent(event);
        super.onCloseRequest(msg);
    }
};


/**
 * The base class of the lumino widget hierarchy.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/widget.html}
 * 
 * This class will typically be subclassed in order to create a useful
 * widget. However, it can be used directly to host externally created
 * content.
 * @hideconstructor
 * 
 * @example
 * import dash_lumino_components as dlc
 * 
 * dlc.DockPanel([
 *     dlc.Widget(
 *         "Content",
 *         id="test-widget",
 *         title="Title",
 *         icon="fa fa-folder-open",
 *         closable=True,
 *         caption="Hover label of the widget"
 *     )],
 *     id="dock-panel")
 */
class Widget extends DashLuminoComponent {


    constructor(props) {
        super(props);

        // register a new Panel
        let luminoComponent = super.register(new LuminoWidget({ node: document.createElement('div') }));

        // set properties
        luminoComponent.title.label = props.title;
        luminoComponent.title.closable = props.closable;
        luminoComponent.title.caption = props.caption;
        luminoComponent.title.iconClass = props.icon

        // the component will initially be renderd in an hidden container,
        // then it's moved to the right dom location of lumino
        this.containerName = props.id + "-container";


        // add the children of the component to the widgets of the panel
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterDomCreation(el, this.containerName, (target, child) => {
                    target.div = child;
                    target.lumino.node.appendChild(child.children[0]);
                });
            })
        }

    }


    render() {
        return (
            <div id={this.containerName} style={{
                visibility: 'hidden',
                height: 0,
                width: 0,
                minHeight: 0,
                minWidth: 0,
                margin: 0,
                padding: 0,
                maxHeight: 0,
                position: 'absolute'
            }}>
                <div className="lm-panel">
                    <Fragment>{this.props.children}</Fragment>
                </div>
            </div>
        );
    }

}

Widget.defaultProps = {
    closable: true,
    deleted: false
};

/**
 * @typedef
 * @enum {}
 */
Widget.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * The children of this component
     * @type {Object | Object[]}
     */
    children: PropTypes.node,

    /**
     * The title of the widget
     * @type {string}
     */
    title: PropTypes.string.isRequired,

    /**
     * Is the widget closable
     * @type {boolean}
     */
    closable: PropTypes.bool,

    /**
     * The long title of the widget
     * @type {string}
     */
    caption: PropTypes.string,

    /**
     * Is the widget deleted.
     * Note: In the future this might dissapear and the deleted widgets are
     * automatically removed from the dom.
     * @type {boolean}
     */
    deleted: PropTypes.bool,

    /**
     * The icon of the widget (a cass class name)
     * @type {string}
     */
    icon: PropTypes.string,

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
export default Widget;