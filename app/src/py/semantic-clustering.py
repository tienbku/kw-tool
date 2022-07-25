import sys
import json
import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer('all-mpnet-base-v2', cache_folder='/tmp/.cache')


def get_clusters(keywords, dist):
  corpus_embeddings = embedder.encode(keywords)
  corpus_embeddings = corpus_embeddings / np.linalg.norm(corpus_embeddings, axis=1, keepdims=True)

  threshold = 0.10
  linkage = 'average'
  affinity = 'cosine'
  if dist == 'sub':
    threshold = 0.10
    affinity = 'cosine'
    linkage = 'average'
  elif dist == 'super':
    threshold = 0.20
    affinity = 'cosine'
    linkage = 'average'
  elif dist == 'cat':
    threshold = 0.35  # 25 so far
    affinity = 'cosine'
    linkage = 'average'

  clustering_model = AgglomerativeClustering(n_clusters=None, affinity=affinity, linkage=linkage, distance_threshold=threshold)
  clustering_model.fit(corpus_embeddings)
  cluster_assignment = clustering_model.labels_

  clustered_sentences = {}
  for sentence_id, cluster_id in enumerate(cluster_assignment):
    if cluster_id not in clustered_sentences:
      clustered_sentences[cluster_id] = []
    clustered_sentences[cluster_id].append(keywords[sentence_id])

  clusters_dict = dict()
  clusters_list = list(clustered_sentences.values())
  for cluster in clusters_list:
    if dist != 'super' and (len(cluster)) == 1:
      continue
    clusters_dict[cluster[0]] = cluster

  return clusters_dict


if __name__ == "__main__":
  filepath = sys.argv[1]
  with open(filepath, "r") as f:
    data = json.load(f)

  _dist = data['data']['dist']
  _keywords_json = data['data']['keywords']
  clusters = get_clusters(_keywords_json, _dist)
  print(json.dumps(dict(clusters=clusters)))
