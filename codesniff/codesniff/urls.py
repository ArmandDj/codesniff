from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth.models import User
from app.models import Code, Score, CodeSmell
from rest_framework import routers, serializers, viewsets

# Url patterns
urlpatterns = patterns('',
    url(r'^app/', include('app.urls', namespace='app')),
    url(r'^admin/', include(admin.site.urls)),
)
