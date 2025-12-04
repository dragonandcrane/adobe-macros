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
    // moving boards requires absolute coord system, store to revert after
    const coordSys = app.coordinateSystem;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    const config = getConfig();

    var doc = app.activeDocument;
    var artboards = doc.artboards;

    // move all artboards to left temporarily to clear space
    const leftShift = totalWidth(artboards) + 72;
    for (var i = 0; i < artboards.length; i++) {
        artboards.setActiveArtboardIndex(i);
        offsetBy(artboards[i], -leftShift, 0);
    }

    // move artboards into arrangement
    var currX = 0;
    var currY = 0;
    const abWidth = new UnitValue(config.settings.width, config.settings.unit).as("px");
    const abHeight = new UnitValue(config.settings.height, config.settings.unit).as("px");
    const abSpace = new UnitValue(config.settings.space, config.settings.unit).as("px");
    var abIndex = 0;
    for (var j = 0; j < config.rows.length; j++) {
        for (var i = 0; i < config.rows[j].length; i++) {
            artboards.setActiveArtboardIndex(abIndex);
            moveTo(artboards[abIndex], currX, currY);
            currX += abWidth + abSpace;
            abIndex++;
        }
        currX = 0;
        currY -= abHeight + abSpace;
    }

    // revert coord sys to original state
    app.coordinateSystem = coordSys;
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

function moveTo(artboard, newX, newY) {
    const abRect = artboard.artboardRect;
    offsetBy(artboard, newX-abRect[0], newY-abRect[1]);
}
function offsetBy(artboard, offX, offY) {
    // move objects
    doc.selectObjectsOnActiveArtboard();
    for (var i = 0; i < app.selection.length; i ++) {
        var pos = app.selection[i].position;
        app.selection[i].position = [pos[0] + offX, pos[1] + offY];
    }
    // move artboard
    const oldRect = artboard.artboardRect;
    artboard.artboardRect = [oldRect[0]+offX, oldRect[1]+offY, oldRect[2]+offX, oldRect[3]+offY];
}
