import PropTypes from 'prop-types';
import { Component } from 'react';
import { commands } from '../registry';

/**
 * A widget which displays items as a canonical menu.
 */
export default class Command extends Component {

    constructor(props) {
        super(props);

        commands.addCommand(props.id, {
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

Command.propTypes = {
    /**
     * The id of the command
     */
    id: PropTypes.string,

    /**
     * The label of the command
     */
    label: PropTypes.string,


    /**
     * The icon of the command (a cass class name)
     */
    icon: PropTypes.string,

    /**
     * Number of times the command was called
     */
    n_called: PropTypes.number,
    /**
     * Last time that command was called.
     */
    n_called_timestamp: PropTypes.number,

    /**
     * Dash-assigned callback that gets fired when the value changes.
     */
    setProps: PropTypes.func,


};
