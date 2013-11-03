from django.contrib import admin
from polls.models import Poll,Choice

#admin.site.register(Poll)
#admin.site.register(Choice)

class ChoiceInline(admin.StackedInline):
#class ChoiceInline(admin.TabularInline):
	model = Choice
	extra = 3

class PollAdmin(admin.ModelAdmin):
	#default use str() of each object
	list_display  = ('question', 'pub_date', 'was_published_recently')
	list_filter   = ['pub_date']
	search_fields = ['question']
	date_hierarchy = 'pub_date'

	#fields = ['pub_date', 'question']
	fieldsets = [
			('Date informations', {'fields': ['pub_date'], 'classes':['collapse']}),
			('Security Question', {'fields': ['question']}),
	]
	inlines = [ChoiceInline]


admin.site.register(Poll, PollAdmin)
