import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'
import { commands } from '../registry';

import {
    Menu as l_Menu
} from '@lumino/widgets';

/**
 * A widget which displays items as a canonical menu.
 * 
 * https://jupyterlab.github.io/lumino/widgets/classes/menu.html
 */
export default class Menu extends DashLuminoComponent {

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

Menu.propTypes = {

    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string.isRequired,

    /**
     * The title of the menu
     */
    title: PropTypes.string,

    /**
     * The icon class of the menu
     */
    iconClass: PropTypes.string,

    /**
     * An array of the menu items (dlc.Command | dlc.Menu | dlc.Separator)
     */
    children: PropTypes.node,
};
