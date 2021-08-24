import PropTypes from 'prop-types';
import { Component } from 'react';
import { commands, get_id } from '../registry';

/**
 * A widget which displays items as a canonical menu.
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash
 * import dash_lumino_components as dlc
 * 
 * command_open = dlc.Command(id="com:openwidget", label="Open", icon="fa fa-plus")
 */
class Command extends Component {

    constructor(props) {
        super(props);

        commands.addCommand(get_id(props), {
            label: props.label,
            iconClass: props.icon,
            execute: () => {
                this.props.setProps({
                    n_called: this.props.n_called + 1,
                    n_called_timestamp: Date.now(),
                });

            }
        });

    }

    render() {
        return "";
    }

}

Command.defaultProps = {
    n_called: 0,
    n_called_timestamp: -1,
};


/**
 * @typedef
 * @enum {}
 */
Command.propTypes = {
    /**
     * The id of the command
     * @type {string}
     */
    id: PropTypes.string,

    /**
     * The label of the command
     * @type {string}
     */
    label: PropTypes.string,


    /**
     * The icon of the command (a cass class name)
     * @type {string}
     */
    icon: PropTypes.string,

    /**
     * Number of times the command was called
     * @type {number}
     */

    n_called: PropTypes.number,
    /**
     * Last time that command was called.
     * @type {number}
     */
    n_called_timestamp: PropTypes.number,

    /**
     * Dash-assigned callback that gets fired when the value changes.
     * @private 
     */
    setProps: PropTypes.func,


};

/**
 * @private
 */
export default Command;