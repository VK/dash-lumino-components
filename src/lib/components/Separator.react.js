import PropTypes from 'prop-types';
import { Component } from 'react';
import { commands } from '../registry';

/**
 * A dummy widget to create a seperation in menus
 */
export default class Separator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return "";
    }
}

Separator.defaultProps = {};

Separator.propTypes = {
    /**
     * The id of the command
     */
    id: PropTypes.string,
};
