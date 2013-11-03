import urllib2
import re
import logging
import conf

from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import Http404

#from django.template import RequestContext, loader
from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse

from dict.models import Weblio,Weblios,Wiktionary,Ewords



logger = logging.getLogger('dict')
#If read/write to DB
DB_MODE = True


def index(request):
    context = {}
    return render(request, 'dict/index.html', context)

def query_proxy(request):
    # TODO Get dictionary list & user settings from DB
    context = {}
    return render(request, 'dict/proxy.html', context)

def query(request, dict_type, key):
    key = cleanKey(key)

    word = getWordFromDB(dict_type, key)
    if word is not None:
        logger.info( "Read key `%s` from local DB: %s", key, dict_type )
    else:
        # Get from internet
        word = fetchURL(dict_type, key)
        if word is not None :
            saveWordToDB(dict_type, word)
        else:
            #raise Http404
            word = {'word': key,'explain': 'Not found', 'reference':'local&internet'}

    context = { 
        'dict_type': dict_type, 
        'dict' : word
    }
    return render(request, 'dict/query.html', context)

def cleanKey(key):
    newKey = key.lower().strip()
    if key != newKey:
        logger.info("Change key FROM:"+key+" TO:"+newKey)

    return key.lower().strip()


def fetchURL(dict_type, key):
    logger.info( "Fetch %s from internet. (%s)", key, dict_type)

    #fetchUrls = FetchURL.objects.filter(dict_name=dict_type).order_by('-level')
    fetchUrls = conf.fetch_urls(dict_type)
    if fetchUrls is None :
        return None

    hdr = {
        'User-Agent': '',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset': 'utf-8,ISO-8859-1,shift-JIS;q=0.7,*;q=0.3',
        'Accept-Encoding': 'none',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive'
    }

    fetchKey = urllib2.quote(key.encode('utf-8'))
    for fetchUrl in fetchUrls:
        # Change UA
        hdr['User-Agent']=fetchUrl['ua']
        # Get URL
        url = fetchUrl['fetch_url'].replace('#key#',fetchKey)
        logger.info( "Fetching url: " + url )
        req = urllib2.Request(url, headers=hdr)

        try:
            response = urllib2.urlopen(req)
            html = response.read()
            #logger.debug( "html: \n" + html )
            if html is not None:
                return {
                    'word': key,
                    #'explain': toJSStr(html),
                    'explain': html,
                    'reference': url
                }
        except urllib2.HTTPError, e:
            logger.error("********ERROR******** \n" + e.fp.read() + "\n********ERROR********")
            continue
        except (Http404):
            logger.error("HTTP ERROR 404")
            continue
    return None

def getWordFromDB(dict_type,key) :
    if not DB_MODE : 
        return None
    try:
        if isTable(dict_type, Weblio) :
            #word = get_object_or_404(Weblio, word=key)
            return Weblio.objects.get(word=key)
        elif isTable(dict_type, Weblios) :
            #word = get_object_or_404(Weblio, word=key)
            return Weblios.objects.get(word=key)
        elif isTable(dict_type, Ewords) :
            #word = get_object_or_404(Ewords, word=key)
            return Ewords.objects.get(word=key)
        elif isTable(dict_type, Wiktionary) :
            #word = get_object_or_404(Ewords, word=key)
            return Wiktionary.objects.get(word=key)
    except (Weblio.DoesNotExist, Weblios.DoesNotExist, Ewords.DoesNotExist, Wiktionary.DoesNotExist):
        return None


def saveWordToDB(dict_type, record):
    if not DB_MODE : 
        return None
    # record is dictionary in python
    logger.info( "Save to DB:" + dict_type + ". word:" + record['word'])
    if isTable(dict_type, Weblio) :
        obj = Weblio(word=record['word'], explain=record['explain'], reference=record['reference'])
    elif isTable(dict_type, Weblios) :
        obj = Weblios(word=record['word'], explain=record['explain'], reference=record['reference'])
    elif isTable(dict_type, Ewords) :
        obj = Ewords(record.word, record.explain, record.reference)
    elif isTable(dict_type, Wiktionary) :
        obj = Wiktionary(record.word, record.explain, record.reference)
    obj.save()

def isTable(table_name, clazz):
    return table_name.lower() == clazz.__name__.lower()

def toJSStr(str) :
    str = re.sub(r'\\','\\\\',str)
    str = re.sub(r'\n','\\n',str)
    str = re.sub(r'"','\\"',str)
    str = re.sub(r'\t','\\t',str)
    return str


