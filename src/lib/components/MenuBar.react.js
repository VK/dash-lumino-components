import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    MenuBar as l_MenuBar
} from '@lumino/widgets';

/**
 * A widget which displays menus as a canonical menu bar.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/menubar.html}
 * @hideconstructor
 * 
 * @example
 * //Python:
 * import dash
 * import dash_lumino_components as dlc
 * 
 * menuBar = dlc.MenuBar([
 *     dlc.Menu([
 *         dlc.Command(id="com:openwidget", label="Open", icon="fa fa-plus"),
 *     ], id="exampleMenu", title="Example")
 * ], 'menuBar')
 */
class MenuBar extends DashLuminoComponent {

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

/**
 * @typedef
 * @enum {}
 */
MenuBar.propTypes = {
    /**
     * ID of the widget
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * An array of the menus (dlc.Menu)
     * @type {Menu[]}
     */
    children: PropTypes.node
};

/**
 * @private
 */
export default MenuBar;