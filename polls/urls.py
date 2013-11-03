# coding=UTF-8

from django.conf.urls import patterns, url

from polls import views

urlpatterns = patterns('',
	# ex: /polls/
	url(r'^$', views.IndexView.as_view(), name='index'),

	# ex: /polls/5/
	# The DetailView generic view expects the primary key value captured from the URL to be called "pk", 
	# so we’ve changed poll_id to pk for the generic views.
	url(r'^specifics/(?P<pk>\d+)/$', views.DetailView.as_view(), name='detail'),

	# ex: /polls/5/results/
	url(r'^specifics/(?P<pk>\d+)/results/$', views.ResultsView.as_view(), name='results'),

	# ex: /polls/5/vote/
	url(r'^specifics/(?P<poll_id>\d+)/vote/$', views.vote, name='vote'),

)


