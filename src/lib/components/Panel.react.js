import { Fragment } from 'react';
import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    Panel as l_Panel
} from '@lumino/widgets';

/**
 * A simple and convenient panel widget class.
 * 
 * https://jupyterlab.github.io/lumino/widgets/classes/panel.html
 * 
 * This class is suitable as a base class for implementing a variety
 * of convenience panel widgets, but can also be used directly with
 * CSS to arrange a collection of widgets.
 */
export default class Panel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new Panel
        let luminoComponent = super.register(new l_Panel(), props.addToDom);

        // set properties
        luminoComponent.title.label = props.label;
        luminoComponent.title.iconClass = props.icon;

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

Panel.defaultProps = {
    addToDom: false,
};

Panel.propTypes = {
    /**
     * ID of the widget
     */
    id: PropTypes.string.isRequired,

    /**
     * The label of the panel
     */
    label: PropTypes.string,


    /**
     * The icon of the panel (a cass class name)
     */
    icon: PropTypes.string,

    /**
     * bool if the object has to be added to the dom directly
     */
    addToDom: PropTypes.bool,

    /**
     * The widgets
     */
    children: PropTypes.node
};
