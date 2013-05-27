# (c) Nelen & Schuurmans.  GPL licensed, see LICENSE.rst.
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from __future__ import print_function

from django.utils.translation import ugettext as _
# from django.core.urlresolvers import reverse
from lizard_map.views import MapView
# from lizard_ui.views import UiView
from lizard_ui.layout import Action
# check this
from django.views.generic.base import View
from django.http import HttpResponse
#from django.utils import simplejson as json
import requests


class ElevationProfile(MapView):
    """Elevation Profile tmp stub"""
    template_name = 'lizard_elevationprofile/elevationprofile.html'
    page_title = _('Elevation Profile')
    profiledata = _('profile data')

    @property
    def content_actions(self):
        """Add default-location-zoom."""
        actions = super(ElevationProfile, self).content_actions
        activate_elevationprofile = Action(
            name='',
            description=_('Draw a line to select an elevation profile'),
            url="javascript:void(null)",
            icon='icon-bar-chart',
            klass='map-elevationprofile')
        actions.insert(0, activate_elevationprofile)

        return actions


class ElevationData(View):
    """Get request bounds and linestring, respond json"""
    def get(self, request, *args, **kwargs):
        #parse srs of map, only get the number
        mapsrs = request.GET.get('srs').split(':')[-1]
        wkt_geom = request.GET.get('geom')
        # TODO: here the request to gislib / gislib service
        url = 'http://localhost:5000/rasterinfo/profile'
        params = {'srs': mapsrs, 'geom': wkt_geom}
        r = requests.get(url, params=params)
        elevation_profile = r.text
        #print(elevation_profile)
        return HttpResponse(elevation_profile, content_type='application/json')
