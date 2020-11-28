import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    MenuBar as l_MenuBar
} from '@lumino/widgets';

/**
 * A widget which displays menus as a canonical menu bar.
 * 
 * https://jupyterlab.github.io/lumino/widgets/classes/menubar.html
 */
export default class MenuBar extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new MenuBar
        super.register(new l_MenuBar, true);

        // add the children of the component to the menus of the MenuBar
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterLuminoChildCreation(el, (target, child) => {
                    target.lumino.addMenu(child.lumino);
                });
            })
        }

    }


    render() {
        return super.render();
    }

}

MenuBar.defaultProps = {
};

MenuBar.propTypes = {
    /**
     * ID of the widget
     */
    id: PropTypes.string.isRequired,

    /**
     * An array of the menus (dlc.Menu)
     */
    children: PropTypes.node
};
