lizard-elevationprofile
==========================================

Client side elevation profile tool for raster layers. Adds a button to the main toolbar. Clicking the button let's you draw a line in the map. When the line is finished the tool sends the linestring and projection to the raster server.

Set ``RASTERINFO_SERVER_URL = http://<rasterserverurl>`` in settings.py

Prerequisites
-------------
**NOTE:** You need to setup a server accepting linestrings and returning an array with [x, value] pairs. You can use the _rasterinfo_ blueprint of https://github.com/nens/threedi-wms
