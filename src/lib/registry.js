import {
    CommandRegistry
} from '@lumino/commands';

import {
    Panel as l_Panel,
} from '@lumino/widgets';


/**
 * the internal command registry of lumino
 */
var commands = new CommandRegistry();



export { commands };