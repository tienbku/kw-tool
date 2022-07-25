import re
import nltk
import sys
import json
import spacy
from nltk.corpus import stopwords
from collections import defaultdict
from gensim.models.phrases import Phrases

nltk.download('stopwords')
nlp = spacy.load("en_core_web_lg")

BASE_STOP_WORDS = ["the", "it", "they", "that", "this", "those", "your", "we", "you", "their", "them", "these", "an"]
STOP_WORDS = set(list(stopwords.words('english')) + BASE_STOP_WORDS)
questions = [
  'how',
  'can',
  'when',
  'where',
  'what',
  'why',
  'is',
  'are',
  'does',
  'do',
  'will',
  'can',
  'could',
  'would',
  'should',
  'which',
  'who'
]
IGNORE = ["the", "a"]


def most_frequent_words(phraser, sents, num, min_word_len=0, max_word_len=100):
  word_freq = defaultdict(int)

  for s in phraser[sents]:
    for i in s:
      length = len(i.split("_"))
      if i.replace(" ", "_") not in STOP_WORDS and min_word_len <= length <= max_word_len:
        word_freq[i] += 1

  freq_words = []
  for k in sorted(word_freq, key=word_freq.get, reverse=True)[:num]:
    freq_words.append(k)

  return freq_words


def get_with_wildcards(kws, seed):
  modified_kws = []

  for kw in kws:
    doc = nlp(kw)
    modifiers = []
    for token in doc:
      dep = token.dep_
      pos = token.pos_
      text = token.text
      if dep in ["advcl", "acomp", "dobj", "ccomp", "pobj"] and text not in seed:
        modifiers.append(text)
      elif pos == "VERB" and dep == "ROOT"  and text not in seed:
        modifiers.append(text)

    clean_kw = kw
    for mod in modifiers:
      clean_kw = clean_kw.replace(mod, '*')

    modified_kws.append(clean_kw)

  return modified_kws


def get_with_double_wildcards(kws, seed):
  keywords = "\n".join(kws)
  keywords_sentences = [s.split(" ") for s in keywords.replace(seed, '<seed>').split("\n")]

  bigram = Phrases(keywords_sentences, min_count=3, threshold=0.1, connector_words=IGNORE)
  popular = most_frequent_words(bigram, keywords_sentences, 100, 1, 3)

  words = []
  for w in popular:
    count = len([kw for kw in keywords_sentences if w.replace('_', ' ') in " ".join(kw)])
    if count >= 3 and '<seed>' in w and '<seed>' != w:
      words.append(w)

  seeds = []
  for w in words:
    new_seed = w.replace('<seed', seed).replace('seed>', seed).replace('_', ' ').replace('<', ' ').replace('>', ' ')
    new_seed = re.sub(r'\s+', ' ', new_seed)
    seeds.append(new_seed.strip())
  seeds = list(set(seeds))

  new_queries = []
  for kw in keywords.split("\n"):
    for s in seeds:
      if s in kw:
        x = re.sub("\\b" + s + "\\b", "|%s|" % s, kw)
        if "|" in x:
          parts = x.split('|')
          if '' in parts:
            new_query = ''

            for p in parts:
              if p == '':
                new_query += '* '
              elif p != s:
                sub_parts = p.split(" ")
                if len(sub_parts) > 1:
                  new_query += p.split(" ")[0] + ' * '
                else:
                  new_query += p + ' '
              else:
                new_query += p + ' '

            new_query = re.sub(r'\s+', ' ', new_query)
            new_queries.append(new_query.strip())

  return list(set(new_queries))


if __name__ == "__main__":
  filepath = sys.argv[1]
  with open(filepath, "r") as f:
    data = json.load(f)

  json_obj = data['data']
  _seed = json_obj['seed']
  _keywords = json_obj['keywords']

  with_wildcards = get_with_wildcards(_keywords, _seed)
  with_double_wildcards = get_with_double_wildcards(_keywords, _seed)
  print(json.dumps(dict(keywords=list(set(with_wildcards + with_double_wildcards)))))
