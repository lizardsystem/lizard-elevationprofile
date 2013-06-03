lizard-elevationprofile
==========================================

Client side elevation profile tool for raster layers. Adds a button to the main toolbar. Clicking the button let's you draw a line in the map. When the line is finished the tool sends the linestring and projection to the raster server.

Set ``RASTERINFO_SERVER_URL = http://<rasterserverurl>`` in settings.py

Prerequisites
-------------
**NOTE:** You need to setup a server accepting linestrings and returning an array with [x, value] pairs. You can use the _rasterinfo_ blueprint of https://github.com/nens/threedi-wms


- Add a new jenkins job at
  http://buildbot.lizardsystem.nl/jenkins/view/djangoapps/newJob or
  http://buildbot.lizardsystem.nl/jenkins/view/libraries/newJob . Job name
  should be "lizard-elevationprofile", make the project a copy of the existing "lizard-wms"
  project (for django apps) or "nensskel" (for libraries). On the next page,
  change the "github project" to ``https://github.com/nens/lizard-elevationprofile/`` and
  "repository url" fields to ``git@github.com:nens/lizard-elevationprofile.git`` (you might
  need to replace "nens" with "lizardsystem"). The rest of the settings should
  be OK.
