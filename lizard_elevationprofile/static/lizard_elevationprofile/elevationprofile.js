// jslint configuration; btw: don't put a space before 'jslint' below.
/*jslint browser: true, devel: true, sloppy: true */
/*global $, OpenLayers, map*/

// TODO: order of functions and vars

(function () {
    // function to draw elevation graph with flot jquery plugin
    var drawElevationGraph = function (elevationData) {
        // TODO: hmm, maybe just kill the first popup since we only have one?
        for (var existingPopup in map.popups) {
            map.removePopup(map.popups[existingPopup]);
        }
        var options,
            graphHTML = '<div id="elevation-profile" style="width:400px;height:200px">Graph</div>',
            popup = new OpenLayers.Popup.FramedCloud(
                "Elevation Profile",
                map.getLonLatFromPixel((map.getControlsByClass("OpenLayers.Control.MousePosition")[0]).lastXy),
                null,
                graphHTML,
                null,
                true
            );
        map.addPopup(popup);
        //var plotOptions = {x-axis: {position: "top"}};
        //var plotOptions = {x-axis: "" };
        var plotOptions = '';
        // TODO: hardcoded 'profile': ugly
        $.plot($("#elevation-profile"), elevationData['profile'], plotOptions);
    };

    // function to setup DrawLineControl and add to OpenLayers map
    var setupDrawLineControl = function () {
        var lineLayer = new OpenLayers.Layer.Vector("Profile layer", {displayInLayerSwitcher: false}),
            drawLineControl = new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path, {handlerOptions: {maxVertices: 2}});
        map.addLayer(lineLayer);

        lineLayer.events.on({
            featureadded: function (event) {
                var geometry = event.feature.geometry,
                    mapSrs = map.getProjection(),
                    url = 'elevationdata/'; // TODO: hardcoded shizzle
                wktGeometry = geometry.toString();
                requestData = "&geom=" + wktGeometry +
                              "&srs=" + mapSrs;
                $.get(url, requestData, drawElevationGraph);
            }
        });

        return drawLineControl;
          
    };

    // draw line for elevation profile and get data from server
    // TODO: destroy features on finish
    var actionElevationProfile = function () {
        var drawLineControl = map.getControlsByClass('OpenLayers.Control.DrawFeature')[0];

        if (drawLineControl === undefined) {
            drawLineControl = setupDrawLineControl();
        }
         
        if (drawLineControl.active) {
            drawLineControl.layer.destroyFeatures();
            drawLineControl.deactivate();
            map.removeControl(drawLineControl);
            map.removeLayer(drawLineControl.layer);
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
        setUpElevationProfile();
    });
}());
