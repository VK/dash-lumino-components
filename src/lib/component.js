import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { components, get_uuid } from './registry.js';
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


    move2Dash(comp) {
        comp.div.appendChild(comp.lumino.node)
    }

    move2Lumino(comp) {
        comp.lumino.node.appendChild(comp.div.children[0])
    }

    /**
     * Register a new lumino component in the regirstry
     * @param {*} luminoComponent 
     * @param {*} attachToDom
     */
    register(luminoComponent, attachToDom = false, resize = true) {
        this.luminoComponent = luminoComponent;

        // create an unique id if not available
        this.id = (this.props.id || this.props.id != undefined) ? this.props.id : get_uuid();

        // set the same id to the lumino component
        luminoComponent.id = this.id;

        // call the update if the window resizes
        if (resize) {
            window.addEventListener("resize", function () {
                luminoComponent.update();
            });
        }

        //create an entry in the registry
        components[this.id] = {
            "dash": this,
            "lumino": luminoComponent,
            "div": undefined
        }

        // add the component to the dom is usually needed for the
        // first DashLuminoComponent
        if (attachToDom) {
            this.attachToDom();
        }

        return luminoComponent;
    }


    /**
     * Attach the lumino component to the document body
     */
    attachToDom() {
        l_Widget.attach(this.luminoComponent, document.body);
    }

    /**
     * Wait untiul the dash lumino component is created and then apply the custom function
     * This is usually used to create the lumino objects hierarchy, like widgets in panels, ...
     * 
     * @param {*} reactComponent 
     * @param {*} func(target_component, child_component)
     */
    applyAfterLuminoChildCreation(reactComponent, func) {
        var i = 0;

        let target_component = components[this.id];

        function updateLoop() {
            setTimeout(function () {
                i++;
                let child_component = components[reactComponent.props._dashprivate_layout.props.id];
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



    /**
     * Wait untiul the dash html dom element is created and then apply the custom function
     * This is usually used to create the dash component and then move it into a lumino compoent
     * 
     * @param {*} reactComponent 
     * @param {*} containerName
     * @param {*} func(target_component, child_component)
     */
    applyAfterDomCreation(reactComponent, containerName, func) {
        var i = 0;

        let target_component = components[this.id];


        function updateLoop() {
            setTimeout(function () {
                i++;

                var dash_object = document.getElementById(containerName);

                if (dash_object && target_component) {
                    func(target_component, dash_object);
                    //components[this.props.id].div = dash_object.parentElement;
                    //lumino_object.appendChild(dash_object);
                    //dash_object.style = "";
                    //console.log("Info: created Panel " + props.id + " after " + (i * 10) + "ms");
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
    id: PropTypes.string.isRequired,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func
};
