import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { components } from './registry.js';
import { is } from 'ramda';

import {
    Widget as l_Widget
} from '@lumino/widgets';

/**
 * A base component used for all other Dash Lumino Components
 */
export default class DashLuminoComponent extends Component {

    constructor(props) {
        super(props);

    }

    /**
     * Register a new lumino component in the regirstry
     * @param {*} luminoComponent 
     */
    register(luminoComponent) {
        this.luminoComponent = luminoComponent;

        luminoComponent.id = this.props.id;

        components[this.props.id] = {
            "dash": this,
            "lumino": luminoComponent,
            "div": undefined
        }

        console.log(components);

        return luminoComponent;
    }


    /**
     * Attach the lumino component to the document body
     */
    attachToDom() {
        l_Widget.attach(this.luminoComponent, document.body);
        components[this.props.id]["div"] = this.luminoComponent.node;
        console.log(components);
    }

    /**
     * Wait untiul the dash lumino component is created and then apply the custom function
     * This is usually used to create the lumino objects hierarchy, like widgets in panels, ...
     * 
     * @param {*} dashComponent 
     * @param {*} func(target_component, child_component)
     */
    applyAfterCreation(dashComponent, func) {
        var i = 0;
        console.log("applyAfterCreation");

        let target_component = components[this.props.id];



        function updateLoop() {
            setTimeout(function () {
                i++;
                let child_component = components[dashComponent.props._dashprivate_layout.props.id];
                if (target_component && child_component) {
                    func(target_component, child_component);
                } else if (i < 50) {
                    updateLoop();
                } else {
                    console.log("Warning: applyAfterCreation timed out!");
                }
            }, 10)
        }

        updateLoop();
    }


    parseChildrenToArray() {
        if (this.props.children && !is(Array, this.props.children)) {
            // if props.children contains just one single element, it gets passed as an object
            // instead of an array - so we put in in a array ourselves!
            return [this.props.children];
        }
        return this.props.children;
    }


    render() {
        return (<Fragment>{this.props.children}</Fragment>);
    }
}

DashLuminoComponent.defaultProps = {
};

DashLuminoComponent.propTypes = {
    /**
     * ID of the widget
     */
    id: PropTypes.string,
};
