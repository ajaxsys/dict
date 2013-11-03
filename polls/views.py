from django.http import HttpResponse
from django.http import HttpResponseRedirect

#from django.template import RequestContext, loader
from django.shortcuts import render, get_object_or_404

from django.core.urlresolvers import reverse
from django.views import generic 

from polls.models import Poll,Choice


class IndexView(generic.ListView):
	template_name = 'polls/index.html'
	# For ListView, the automatically generated context variable is poll_list. 
	# To override this we provide the context_object_name attribute
	context_object_name = 'latest_poll_list'

	def get_queryset(self):
		"""Return the last five published polls."""
		return Poll.objects.order_by('-pub_date')[:5]




class DetailView(generic.DetailView):
	# By default, the DetailView generic view uses a template called <app name>/<model name>_detail.html
	# For DetailView the poll variable is provided automatically. since we are using a Django model (Poll)
	model = Poll
	template_name = 'polls/detail.html'

class ResultsView(generic.DetailView):
	model = Poll
	template_name = 'polls/result.html'


def vote(request, poll_id):
	#return HttpResponse("You're voting on poll %s." % poll_id)
	p = get_object_or_404(Poll, pk=poll_id)
	try:
		selected_choice = p.choice_set.get(pk=request.POST['choice'])
	except (KeyError, Choice.DoesNotExist):
		return render(request, 'polls/detail.html', {
			'poll': p,
			'error_message': "You didn't select any choice."
		})
	else:
		selected_choice.votes += 1
		selected_choice.save()
		# Always return an HttpResponseRedirect after successfully dealing
	        # with POST data. This prevents data from being posted twice if a
	        # user hits the Back button.
		#
		# Rather than a normal HttpResponse.
		# This tip is not specific to Django,
		# it's just good Web development practice.

		# reverse: This function helps avoid having to hardcode a URL in the view function.
		# like `{% url 'polls:vote' poll.id %}` in templates files
		return HttpResponseRedirect( reverse('polls:results', args=(p.id,)) )






