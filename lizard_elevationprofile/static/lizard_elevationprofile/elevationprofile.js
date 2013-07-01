// jslint configuration; btw: don't put a space before 'jslint' below.
/*jslint browser: true, devel: true, sloppy: true, vars: true, es5: true */
/*global $, OpenLayers, map*/

(function () {

    var q = null, popup = null, modifiedSwitch = false;

    /** Setup elevation profile graph div
     */
    var $el = $('<div class="flot-graph-canvas"></div>')
		.css({
			position: 'absolute',
			top:0, bottom:0, left:0, right:0
        })
		.appendTo("#elevation-profile-content");

    /** Show tooltip with contents for mouse x, y (hover or click)
     */

    function showToolTip(x, y, contents) {
        $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y - 25,
            left: x + 5,
            "z-index": "9999",
            border: "none",
            padding: "2px",
            "background-color": "#eee",
            opacity: 0.70
        }).appendTo("body").fadeIn(200);
    }

    /** Draw elevation graph in popup with Flot jQuery plugin
     */
    var drawElevationGraph = function (elevationData) {
        q = null; // reset pointer to ajax request

        // TODO: hardcoded 'profile': ugly
        var elevationSeries = [{data: elevationData.profile}];
        var plotOptions = {
            label: "Height",
            //lines: {
                //fill: true,
                //fillColor: {
                //    colors: [
                //        {opacity: 0.8},
                //        {opacity: 0.1}
                //    ]
              //  }
            //},
            grid: {clickable: true, hoverable: true}
        };

		$el.empty();
        $.plot($el, elevationSeries, plotOptions);



        // Bind hover event
        var previousPoint = null;
		// FIX element for plothover
        $el.bind("plothover", function (event, pos, item) {
            if (item) {
                if (previousPoint !== item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2);
                    var y = item.datapoint[1].toFixed(2);
                    showToolTip(item.pageX, item.pageY, y + " m.");
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };

    /** Callback handler to get elevation data for drawn line
     */
    var getElevationData = function (event) {
        var geometry = event.feature.geometry; // profile line
        var mapSrs = map.getProjection(); // map projection
        var url = '/elevationdata/'; // TODO: hardcoded shizzle
        var wktGeometry = geometry.toString();
        var requestData = "&geom=" + wktGeometry +
                      "&srs=" + mapSrs;

        if (q !== null) {
            //q.abort(); // TODO: this doesn't function properly yet
            q = null;
        }
        q = $.get(url, requestData, drawElevationGraph);
    };

    /** Setup DrawLineControl and add to global OpenLayers map object
     */
    var setupDrawLineControl = function () {
        var defaultStyle = new OpenLayers.Style({
            'strokeWidth': 3,
            'strokeColor': "#ff0000"
        });
        var tempStyle = new OpenLayers.Style({
            'strokeDashstyle': 'dash',
            'strokeColor': "#ff0000"
        });
        var styleMap = new OpenLayers.StyleMap({
            'default': defaultStyle,
            'temporary': tempStyle
        });
        var lineLayer = new OpenLayers.Layer.Vector(
            "Profile layer",
            {
                displayInLayerSwitcher: false,
                styleMap: styleMap
            }
        );

        /* Custom path handler to draw *live* profiles
         */
        var customHandler = new OpenLayers.Class(OpenLayers.Handler.Path, {
            addPoint: function (pixel) {
                OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments);

                if (!modifiedSwitch) {
					lineLayer.removeAllFeatures();
                    lineLayer.events.on({sketchmodified: getElevationData});
                    modifiedSwitch = !modifiedSwitch;
                }

            }
        });

        var drawLineControl = new OpenLayers.Control.DrawFeature(
            lineLayer,
            OpenLayers.Handler.Path, // default OL Path handler
            //customHandler,         // custom handler to enable live updating
            {
                handlerOptions: {maxVertices: 2},
            }
        );

        map.addLayer(lineLayer);
        lineLayer.setZIndex(1100);

        // register featureadded event on lineLayer
        lineLayer.events.on({
            featureadded: getElevationData,
            sketchcomplete: function () {
                lineLayer.events.un({sketchmodified: getElevationData});
                modifiedSwitch = !modifiedSwitch;
            },
        });

        return drawLineControl;
    };

    // draw line for elevation profile and get data from server
    var toggleElevationProfile = function () {
        var drawLineControl = map.getControlsByClass('OpenLayers.Control.DrawFeature')[0];

        if (drawLineControl === undefined) {
            drawLineControl = setupDrawLineControl();
        }

        if (drawLineControl.active) {
            drawLineControl.layer.destroyFeatures();
            drawLineControl.deactivate();
            map.removeControl(drawLineControl);

            // save Z indices
            var layer2zindex = [];
            for (var i=0; i<map.layers.length; i++) {
                var layer = map.layers[i];
                layer2zindex.push([layer, layer.getZIndex()]);
            }

            map.removeLayer(drawLineControl.layer);

            // restore Z indices
            for (var j=0; j<layer2zindex.length; j++) {
                var layer = layer2zindex[j][0];
                for (var i=0; i<map.layers.length; i++) {
                    var layer2 = map.layers[i];
                    if (layer === layer2) {
                        layer2.setZIndex(parseInt(layer2zindex[j][1]));
                        break;
                    }
                }
            }
        } else {
            map.addControl(drawLineControl);
            map.addControl(new OpenLayers.Control.MousePosition());
            drawLineControl.activate();
        }
    };
	var activateElevationProfile = function (event) {
		if (event.relatedTarget && event.relatedTarget.id === "elevation-profile-action"){
			// switched to other tab
			toggleElevationProfile();
		}

		if (event.target.id === "elevation-profile-action"){
			// switched to elevation profile tab
			toggleElevationProfile();
		}
	}


    function setUpElevationProfile() {
		$('#box-awesome a[data-toggle="tab"]').on("show", activateElevationProfile);

    }

    $(document).ready(function () {
        setUpElevationProfile();
    });
}());
