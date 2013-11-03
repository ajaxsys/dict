# coding=UTF-8

from django.conf.urls import patterns, url

from dict import views

urlpatterns = patterns('',
        # ex: /dict/
        url(r'^$', views.index, name='index'),
        # ex: /dict/query
        url(r'^(?P<dict_type>weblio(|s)|wiktionary|ewords)/(?P<key>[^\/]+)/$', views.query, name='query'),
)
