from django.contrib import admin

from dict.models import Weblio,Weblios,Wiktionary,Ewords;

admin.site.register(Weblio) # deprecated
admin.site.register(Weblios)
admin.site.register(Wiktionary)
admin.site.register(Ewords)

