from django.db import models

# Create your models here.

class Dict(models.Model):
    #word_id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=200, db_index=True)
    # 100kb
    explain = models.TextField(max_length=102400)
    # 1kb
    reference = models.TextField(max_length=1024)
    
    def __unicode__(self):
        return self.word

    class Meta:
            abstract = True


# http://ejje.weblio.jp/ - Support en2jp jp2en
class Weblio(Dict): pass
class Weblios(Dict): pass
# http://e-words.jp/ - IT words
class Ewords(Dict): pass 
# http://ja.wiktionary.org/ - Wiki words
class Wiktionary(Dict): pass

