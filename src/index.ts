

import { ui } from './ui'

async function init() {
    if ((<any>window).stream) {
        // clean up streams
        
        // let trackArr = (<any>window).stream.getTracks()
        
    }
    ui.init()
}

init()