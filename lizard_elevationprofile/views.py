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
from django.utils import simplejson as json

# from lizard_elevationprofile import models


# class TodoView(UiView):
#     """Simple view without a map."""
#     template_name = 'lizard_elevationprofile/todo.html'
#     page_title = _('TODO view')


# class Todo2View(MapView):
#     """Simple view with a map."""
#     template_name = 'lizard_elevationprofile/todo2.html'
#     page_title = _('TODO 2 view')

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
            name=_('Elevation-Profile'),
            description=_('Draw a line to select an elevation profile'),
            url="javascript:void(null)",
            icon='icon-star-empty',
            klass='map-elevationprofile')
        actions.insert(0, activate_elevationprofile)

        return actions

class ElevationData(View):
    """Get request bounds and linestring, respond json"""
    def get(self, request, *args, **kwargs):
        data_raw = request.GET.items()
        bounds = json.loads(request.GET.get('bounds'))
        wkt_geom = request.GET.get('geom')
        mapSrs = request.GET.get('srs')
        # TODO: here the request to gislib, get elevation data for linestring
        elevation_profile = [[[1, bounds['left']], [2, bounds['right']], [3, bounds['left']]]]
        data_json = json.dumps(wkt_geom)
        data_json = json.dumps(elevation_profile)
        return HttpResponse(data_json, content_type='application/json')
