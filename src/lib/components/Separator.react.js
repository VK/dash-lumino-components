import PropTypes from 'prop-types';
import { Component } from 'react';

/**
 * A dummy widget to create a seperation in menus.  
 * This is actually not a component of lumino.
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash
 * import dash_lumino_components as dlc
 * 
 * menu = dlc.Menu([
 *     dlc.Command(id="com:openwidget", label="Open", icon="fa fa-plus"),
 *     dlc.Separator(),
 *     dlc.Command(id="com:closeall", label="Close All", icon="fa fa-minus")
 * ], id="openMenu", title="File")
 */
class Separator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return "";
    }
}

Separator.defaultProps = {};

/**
 * @typedef
 * @enum {}
 */
Separator.propTypes = {
    /**
     * The id of the separator
     * @type {string}
     */
    id: PropTypes.string,
};

/**
 * @private
 */
export default Separator;