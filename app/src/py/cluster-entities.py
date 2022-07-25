import sys
import json
import operator
from functools import reduce
from urllib import parse, request
from google.cloud import language_v1
from google.cloud.language_v1.types import Entity, EncodingType, Document


def find(element, _json):
  try:
    return reduce(operator.getitem, element.split('.'), _json)
  except KeyError:
    pass
  return ''


def analyze_text_entities(text):
  items = []
  client = language_v1.LanguageServiceClient()
  doc = Document(
    content=".\n".join(text),
    type=Document.Type.PLAIN_TEXT,
  )
  response = client.analyze_entities(document=doc, encoding_type=EncodingType.UTF8)

  for entity in response.entities:
    results = dict(
      name=entity.name,
      salience=f"{entity.salience:.1%}",
      type=Entity.Type(entity.type).name,
      mid=entity.metadata.get("mid", ""),
      wikipedia_url=entity.metadata.get("wikipedia_url", ""),
    )
    items.append(results['name'])

  return items


def get_wikipedia_urls(items, key):
  item_dicts = []

  for item in list(set(items)):
    item_dict = {
      'name': item,
    }

    service_url = 'https://kgsearch.googleapis.com/v1/entities:search'
    params = {
      'key': key,
      'limit': 10,
      'query': item,
      'indent': True,
    }
    url = service_url + '?' + parse.urlencode(params)
    response = json.loads(request.urlopen(url).read())

    found = []
    for element in response['itemListElement']:
      w = find('result.detailedDescription.url', element)
      if w:
        found.append(dict(
          id=element['result']['@id'],
          score=element['resultScore'],
          name=element['result']['name'],
          url=find('result.url', element),
          wiki=find('result.detailedDescription.url', element),
        ))

    if len(found) > 0:
      found.sort(key=operator.itemgetter('score'), reverse=True)
      item_dict['mid'] = found[0].get('id', '')
      item_dict['url'] = found[0].get('url', '')
      item_dict['entity'] = found[0].get('name', '')
      item_dict['wikipedia'] = found[0].get('wiki', '')

    item_dicts.append(item_dict)

  return item_dicts


if __name__ == "__main__":
  filepath = sys.argv[1]
  with open(filepath, "r") as f:
    data = json.load(f)

  _key = data['data']['key']
  _keywords = data['data']['keywords']
  _items = analyze_text_entities(_keywords)
  _with_entities = get_wikipedia_urls(_items, _key)
  print(json.dumps(dict(entities=_with_entities)))
