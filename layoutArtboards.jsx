//@include 'json2.js';


//  main
$.writeln('app starting')

// if no file open then NOOP
if (app.homeScreenVisible) {
    $.writeln('No open file')
    Error.runtimeError(9999, 'No open file');
}
layoutArtboards();
$.writeln('done');


function layoutArtboards() {
    var config = getConfig();
    $.writeln(config['settings']['width']);


    var artboards = app.activeDocument.artboards;
    moveAsideArtboards(config, doc.artboards);
    layoutArtboards(config, doc.artboards);
    
    for (var i = 0; i < artboards.length; i++) {
        // $.writeln(artboards[i]);
        // processArtboard(doc.artboards[i]);
    }
    // var artboard = doc.artboards[1];
    processArtboard(doc.artboards[1]);
}

function getConfig() {
    const projDir = app.activeDocument.fullName.parent.fsName;
    const configPath = projDir + '/artboards.json';
    var configFile = new File(configPath);
    configFile.open('r');
    var config = JSON.parse(configFile.read());
    return config;
}

function moveAsideArtboards(config, artboards) {
    // determine max right edge of all artboards
    var max_right;
    //  move all artboards left by that much + space
    // for ...
    // var rect = artboard.artboardRect
    // moveTo(rect, rect[0] - max_right - new Units(space).as(px), rect[1])
}
function layoutArtboards(config, artboards) {

}

function processArtboard(artboard) {
    $.writeln(artboard.name);
    var oldRect = artboard.artboardRect;


    // var newRect = convertArtboardRect(oldRect);
    var newRect = moveTo(oldRect, 0, 0);
    artboard.artboardRect = newRect;
}

function convertArtboardRect(oldRect) {
    var offset = [-10, +15, -10, +15];
    // var ret = oldRect + offset;
    // return ret;
    var newRect = [oldRect[0] + offset[0], oldRect[1] + offset[1], oldRect[2] + offset[2], oldRect[3] + offset[3]];
    return newRect;
}
function moveTo(oldRect, newX, newY) {
    var width = oldRect[2] - oldRect[0];
    var height = oldRect[3] - oldRect[1];
    var newRect = [newX, newY, newY + width, newY + height];
    return newRect;
}
function offsetBy(oldRect, offX, offY) {
    var newRect = moveTo(oldRect, oldRect[0] + offX, oldRect[1] + offY);
    return newRect;
}
