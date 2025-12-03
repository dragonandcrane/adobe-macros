//@include 'json2.js';

//  main
$.writeln('app starting')

// if no file open then NOOP
if (app.homeScreenVisible) {
    $.writeln('No open file')
    Error.runtimeError(9999, 'No open file');
}
app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
layoutArtboards();
$.writeln('done');


function layoutArtboards() {
    const config = getConfig();

    var artboards = app.activeDocument.artboards;

    // move all artboards to left temporarily to clear space
    var leftShift = totalWidth(artboards) + 72;
    for (var i = 0; i < artboards.length; i++) {
        var tmpRect = offsetBy(artboards[i].artboardRect, -leftShift, 0);
        // TODO: select contents before moving artboard
        artboards[i].artboardRect = tmpRect;
        // TODO: center contents to artboard after moving
    }

    // move artboards into arrangement
    var currX = 0;
    var currY = 0;
    const artboardWidth = new UnitValue(config.settings.width, config.settings.unit).as("px");
    const artboardHeight = new UnitValue(config.settings.height, config.settings.unit).as("px");
    const artboardSpace = new UnitValue(config.settings.space, config.settings.unit).as("px");
    var k = 0;
    for (var j = 0; j < config.rows.length; j++) {
        for (var i = 0; i < config.rows[j].length; i++) {
            // TODO: select contents before moving artboard
            var placedRect = moveTo(artboards[k].artboardRect, currX, currY);
            artboards[k].artboardRect = placedRect;
            // TODO: center contents to artboard after moving
            currX += artboardWidth + artboardSpace;
            k++;
        }
        currX = 0;
        currY -= artboardHeight + artboardSpace;
    }
    $.writeln('layoutArtboards done')
}

function getConfig() {
    const projDir = app.activeDocument.fullName.parent.fsName;
    const configPath = projDir + '/artboards.json';
    var configFile = new File(configPath);
    configFile.open('r');
    var config = JSON.parse(configFile.read());
    return config;
}

function totalWidth(artboards) {
    var minX = 0;
    var maxX = 0;
    for (var i = 0; i < artboards.length; i++) {
        var rect = artboards[i].artboardRect;
        minX = Math.min(minX, rect[0]);
        maxX = Math.max(maxX, rect[2]);
    }
    return maxX - minX;
}

function moveTo(oldRect, newX, newY) {
    var width = oldRect[2] - oldRect[0];
    var height = oldRect[3] - oldRect[1];
    var newRect = [newX, newY, newX + width, newY + height];
    return newRect;
}
function offsetBy(oldRect, offX, offY) {
    var newRect = moveTo(oldRect, oldRect[0] + offX, oldRect[1] + offY);
    return newRect;
}
