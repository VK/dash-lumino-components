import {
    CommandRegistry
} from '@lumino/commands';

import {
    Panel as l_Panel,
} from '@lumino/widgets';
import { string } from 'prop-types';


/**
 * the internal command registry of lumino
 */
var commands = new CommandRegistry();


/**
 * A dictionary of all Dash Lumino components
 */
var components = new Object();

/**
 * Lookup for the unique identifiers
 */
var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
/**
 * Create a new unique identifer
 */
function get_uuid() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}


function get_id(props) {
    if (props.id.constructor == Object) {
        return props.id["type"] + "-" + props.id["index"];
    } else {
        return props.id;
    }
}

function props_id(a) {
    return get_id(a.props);
}

export { commands, components, get_uuid, props_id, get_id };