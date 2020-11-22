import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    MenuBar as l_MenuBar
} from '@lumino/widgets';

/**
 * A widget which provides a flexible docking area for widgets. The namespace for the DockPanel class statics.
 */
export default class MenuBar extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new MenuBar
        super.register(new l_MenuBar);

        // the menubar is always added to the dom directly
        super.attachToDom();

        // add the children of the component to the menus of the MenuBar
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterCreation(el, (target, child) => {
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
    id: PropTypes.string,

    /**
     * The menus
     */
    children: PropTypes.node
};
