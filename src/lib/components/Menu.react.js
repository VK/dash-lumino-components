import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'
import { commands } from '../registry';

import {
    Menu as l_Menu
} from '@lumino/widgets';

/**
 * A widget which displays items as a canonical menu.  
 * {@link https://jupyterlab.github.io/lumino/widgets/classes/menu.html}
 * @hideconstructor
 * 
 * @example
 * import dash_lumino_components as dlc
 * 
 * dlc.Menu([
 *    dlc.Command(id="com:openwidget", label="Open", icon="fa fa-plus"),
 *    dlc.Separator(),
 *    dlc.Menu([
 *       dlc.Command(id="com:closeall", label="Close All", icon="fa fa-minus"),
 *       dlc.Command(id="com:closeone", label="Close One", icon="fa fa-minus"),
 *    ], id="extraMenu", title="Extra")
 * ], id="openMenu", title="Widgets")
 */
class Menu extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new Menu
        let menu = super.register(new l_Menu({ commands }));

        // set the properties
        menu.title.label = props.title;
        menu.title.iconClass = props.iconClass;


        // handle all children
        if (this.props.children) {
            super.parseChildrenToArray().forEach(reactElement => {
                const el = reactElement.props._dashprivate_layout;

                if (el.namespace === "dash_lumino_components") {
                    if (el.type === "Command") {
                        menu.addItem({ command: el.props.id });
                    }
                    if (el.type === "Separator") {
                        menu.addItem({ type: 'separator' });
                    }
                    if (el.type === "Menu") {
                        super.applyAfterLuminoChildCreation(reactElement, (target, child) => {
                            target.lumino.addItem({ type: 'submenu', submenu: child.lumino });
                        });
                    }
                }
            })
        }



    }


    render() {
        return super.render();
    }

}

Menu.defaultProps = {
};

/**
 * @typedef
 * @enum {}
 */
Menu.propTypes = {

    /**
     * The ID used to identify this component in Dash callbacks.
     * @type {string}
     */
    id: PropTypes.string.isRequired,

    /**
     * The title of the menu
     * @type {string}
     */
    title: PropTypes.string,

    /**
     * The icon class of the menu
     * @type {string}
     */
    iconClass: PropTypes.string,

    /**
     * An array of the menu items (dlc.Command | dlc.Menu | dlc.Separator)
     * @type {Array<Command, Menu, Separator>}
     */
    children: PropTypes.node,
};

/**
 * @private
 */
export default Menu;