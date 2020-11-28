import PropTypes from 'prop-types';
import DashLuminoComponent from '../component.js'

import {
    BoxPanel as l_BoxPanel
} from '@lumino/widgets';

/**
 * A panel which arranges its widgets in a single row or column.
 * 
 * https://jupyterlab.github.io/lumino/widgets/classes/boxpanel.html
 */
export default class BoxPanel extends DashLuminoComponent {

    constructor(props) {
        super(props);

        // register a new BoxPanel
        super.register(new l_BoxPanel({
            alignment: props.alignment,
            direction: props.direction,
            spacing: props.spacing
        }), props.addToDom);

        // add the children of the component to the widgets of the panel
        if (this.props.children) {
            super.parseChildrenToArray().forEach(el => {
                super.applyAfterLuminoChildCreation(el, (target, child) => {
                    target.lumino.addWidget(child.lumino);
                });
            })
        }

    }


    render() {
        return super.render();
    }

}

BoxPanel.defaultProps = {
    alignment: 'start',
    direction: 'left-to-right',
    spacing: 0,
    addToDom: false,
};

BoxPanel.propTypes = {
    /**
     * ID of the widget
     */
    id: PropTypes.string.isRequired,

    /**
     * the content alignment of the layout ("start" | "center" | "end" | "justify")
     */
    alignment: PropTypes.string,

    /**
      * a type alias for a box layout direction ("left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top")
      */
    direction: PropTypes.string,

    /**
     * The spacing between items in the layout
     */
    spacing: PropTypes.number,

    /**
     * bool if the object has to be added to the dom directly
     */
    addToDom: PropTypes.bool,

    /**
     * The widgets
     */
    children: PropTypes.node
};
