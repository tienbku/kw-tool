import sys
import json
import nltk
import spacy

nltk.download('wordnet')
nlp = spacy.load("en_core_web_lg")


def find_verbs(kws):
  modifiers = []

  for kw in kws:
    doc = nlp(kw)

    for token in doc:
      dep = token.dep_
      pos = token.pos_
      lemma = token.lemma_
      if pos == "VERB" and dep == "ROOT":
        modifiers.append(lemma)

  return list(set(modifiers))


if __name__ == "__main__":
  filepath = sys.argv[1]
  with open(filepath, "r") as f:
    data = json.load(f)

  keywords = data['keywords']
  verbs = list(set(find_verbs(keywords)))

  print(json.dumps(dict(verbs=verbs)))
