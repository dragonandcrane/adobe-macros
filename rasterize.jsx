$.writeln('app starting')

// if no file open then NOOP
if (app.homeScreenVisible) {
    $.writeln('No open file')
    Error.runtimeError(9999, 'No open file');
}

var doc = app.activeDocument;
var opts = new RasterizeOptions();
opts.resolution = 300;
// opts.transparency = true;  // TODO: NOT WORKING!

// loop thru artboards
for (var i = 0; i < doc.artboards.length; i++) {
    doc.artboards.setActiveArtboardIndex(i);
    doc.selectObjectsOnActiveArtboard();

    for (var j = 0; j < selection.length; j++) {
        if (selection[j] instanceof RasterItem) {
            var preRaster = selection[j];
            var rasterName = preRaster.name;
            $.writeln(rasterName);
            var postRaster = doc.rasterize(preRaster, preRaster.visibleBounds, opts);
            postRaster.name = rasterName;
        }
    }
};
$.writeln('done');