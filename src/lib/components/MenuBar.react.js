import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

/**
 * A widget which provides a flexible docking area for widgets. The namespace for the DockPanel class statics.
 */
export default class MenuBar extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (<Fragment>{this.props.children}</Fragment>);
    }
}

MenuBar.defaultProps = {
};

MenuBar.propTypes = {
    /**
     * ID of the widget
     */
    id: PropTypes.string,

    /**
     * The menus
     */
    children: PropTypes.node
};
