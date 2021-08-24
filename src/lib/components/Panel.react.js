import { Fragment } from 'react';
import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'
import { get_id } from '../registry.js';

import {
    Panel as l_Panel
} from '@lumino/widgets';

/**
 * A simple and convenient panel widget class.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/panel.html}
 * 
 * This class is suitable to directly display a collection of dash widgets.
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash_lumino_components as dlc
 * import dash_html_components as html
 * 
 * panelA = dlc.Panel(
 *     id="panelA",
 *     children=html.Div("Content"),
 *     label="Test",
 *     icon="fa fa-plus")
 * 
 * panelB = dlc.Panel(
 *     [
 *         html.Div("Content")
 *     ],
 *     id="panelB",
 *     label="Test",
 *     icon="fa fa-plus")
 */
class Panel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new Panel
        let luminoComponent = super.register(new l_Panel(), props.addToDom);

        // set properties
        luminoComponent.title.label = props.label;
        luminoComponent.title.iconClass = props.icon;

        // the component will initially be renderd in an hidden container,
        // then it's moved to the right dom location of lumino
        this.containerName = get_id(props) + "-container";

        // add the children of the component to the widgets of the panel
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterDomCreation(el, this.containerName, (target, child) => {
                    target.div = child;
                    try {
                        target.lumino.node.appendChild(child.children[0]);
                    } catch (error) {
                    }
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

Panel.defaultProps = {
    addToDom: false,
};

/**
 * @typedef
 * @enum {}
 */
Panel.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * The label of the panel
     * @type {string}
     */
    label: PropTypes.string,


    /**
     * The icon of the panel (a cass class name)
     * @type {string}
     */
    icon: PropTypes.string,

    /**
     * bool if the object has to be added to the dom directly
     * @type {boolean}
     */
    addToDom: PropTypes.bool,

    /**
     * The widgets
     * @type {Object | Array<Object>}
     */
    children: PropTypes.node
};

/**
 * @private
 */
export default Panel;