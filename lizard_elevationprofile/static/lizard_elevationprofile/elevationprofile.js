// jslint configuration; btw: don't put a space before 'jslint' below.
/*jslint browser: true, devel: true, sloppy: true */
/*global $, OpenLayers, map*/

// TODO: order of functions and vars

(function () {

    // function to draw elevation graph with flot jquery plugin
    var drawElevationGraph = function (elevationData) {
        console.log('drawing graph');
        console.log(map.getZoom());
        console.log(elevationData);
        // TODO: hmm, maybe just kill the first popup since we only have one?
        for (var existingPopup in map.popups) {
            map.removePopup(map.popups[existingPopup]);
        }
        var options,
            graphHTML = '<div id="elevation-profile" style="width:400px;height:200px">Graph</div>',
            popup = new OpenLayers.Popup.FramedCloud(
                "Graph Popup",
                map.getLonLatFromPixel((map.getControlsByClass("OpenLayers.Control.MousePosition")[0]).lastXy),
                null,
                graphHTML,
                null,
                true
            );
        map.addPopup(popup);
        options = '';
        $.plot($("#elevation-profile"), elevationData, options);
    };

    // function to setup DrawLineControl and add to OpenLayers map
    var setupDrawLineControl = function () {
        var lineLayer = new OpenLayers.Layer.Vector("profile layer", {displayinlayerswitcher: false}),
            drawLineControl = new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path, {handlerOptions: {maxVertices: 2}});
        console.log(drawLineControl.handlerOptions);
        map.addLayer(lineLayer);

        lineLayer.events.on({
            featureadded: function (event) {
                var geometry = event.feature.geometry,
                    mapSrs = map.getProjection(),
                    url = 'elevationdata/'; // TODO: hardcoded shizzle
                wktGeometry = geometry.toString();
                console.log(mapSrs);
                requestData = "&geom=" + wktGeometry +
                              "&srs=" + mapSrs;
                // TODO: maybe we can already send the map bounds on zoom / move to preload data from pyramid?
                $.get(url, requestData, drawElevationGraph);
            }
        });

        return drawLineControl;
          
    };

    // draw line for elevation profile and get data from server
    // TODO: ff deze shizzle checken want hier gebeurt veel
    // TODO: destroy features on finish
    var actionElevationProfile = function () {
        console.log('elevation profile clicked');

        // get drawLineControl, if not exists setup drawLineControl
        var controlAndLayer,
            lineLayer = map.getLayersByName('profile layer')[0],
            drawLineControl = map.getControlsByClass('OpenLayers.Control.DrawFeature')[0];

        if (drawLineControl === undefined) {
            drawLineControl = setupDrawLineControl();
        }
         
        console.log('drawLineControl: ' + drawLineControl.active);
        if (drawLineControl.active) {
            // TODO: only destroys features for first lineLayer
            lineLayer.destroyFeatures();
            drawLineControl.deactivate();
            map.removeControl(drawLineControl);
            $(this).removeClass('active');
            $(this).children('i').removeClass('icon-2x');
        } else {
            map.addControl(drawLineControl);
            map.addControl(new OpenLayers.Control.MousePosition());
            drawLineControl.activate();
            $(this).addClass('active');
            $(this).children('i').addClass('icon-2x');
        }
    };

    //switch on elevation profile when button is clicked
    function setUpElevationProfile() {
        $('.map-elevationprofile').on("click", actionElevationProfile);
    }

    $(document).ready(function () {
        console.log('ready to go');
        setUpElevationProfile();
    });
}());
