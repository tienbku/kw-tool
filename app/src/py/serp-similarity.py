import sys
import json

MIN_COUNT = 7


def get_similarities(kws_serp):
  keywords = dict()

  already_seen = []

  for kw, kw_serp in kws_serp.items():
    keywords[kw] = {'high': []}

    if kw in already_seen:
      continue

    already_seen.append(kw)

    for kw_compare, kw_compare_serp in kws_serp.items():
      if kw == kw_compare or kw_compare in already_seen:
        continue

      in_both = []
      for kw_serp_item in kw_serp:
        if kw_serp_item in kw_compare_serp:
          in_both.append(kw_serp_item)

      if len(in_both) >= MIN_COUNT:
        already_seen.append(kw_compare)
        keywords[kw]['high'].append(kw_compare)

  return keywords


if __name__ == "__main__":
  filepath = sys.argv[1]
  with open(filepath, "r") as f:
    data = json.load(f)

  similarity = get_similarities(data['data'])

  finalSimilarity = dict()
  for keyw, kw_similarity in similarity.items():
    if len(kw_similarity['high']) > 0:
      finalSimilarity[keyw] = similarity[keyw]

  print(json.dumps(dict(similarity=similarity)))
