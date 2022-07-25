import re
import sys
import nltk
import json
import string
from nltk.corpus import stopwords
from gensim.models.phrases import Phrases

nltk.download('punkt')
nltk.download('stopwords')

MIN = 3
MIN_COUNT_BI = 3
MIN_COUNT_TRI = 2
PUNCT = list(string.punctuation)

BASE_STOP_WORDS = ["the", "it", "they", "that", "this", "those", "your", "we", "you", "their", "them", "these", "an"]
_STOP_WORDS = set(list(stopwords.words('english')) + BASE_STOP_WORDS)
ALLOWED = ["can"]

STOP_WORDS = []
for s in _STOP_WORDS:
  if s not in ALLOWED:
    STOP_WORDS.append(s)

CONTRACTIONS = {
    "ain't": "am not",
    "aren't": "are not",
    "can't": "cannot",
    "can't've": "cannot have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he had",
    "he'd've": "he would have",
    "he'll": "he will",
    "he'll've": "he will have",
    "he's": "he is",
    "how'd": "how did",
    "how'd'y": "how do you",
    "how'll": "how will",
    "how's": "how is",
    "i'd": "i had",
    "i'd've": "i would have",
    "i'll": "i will",
    "i'll've": "i will have",
    "i'm": "i am",
    "i've": "i have",
    "isn't": "is not",
    "it'd": "it had",
    "it'd've": "it would have",
    "it'll": "it will",
    "it'll've": "iit will have",
    "it's": "it is",
    "let's": "let us",
    "ma'am": "madam",
    "mayn't": "may not",
    "might've": "might have",
    "mightn't": "might not",
    "mightn't've": "might not have",
    "must've": "must have",
    "mustn't": "must not",
    "mustn't've": "must not have",
    "needn't": "need not",
    "needn't've": "need not have",
    "o'clock": "of the clock",
    "oughtn't": "ought not",
    "oughtn't've": "ought not have",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "shan't've": "shall not have",
    "she'd": "she had",
    "she'd've": "she would have",
    "she'll": "she will",
    "she'll've": "she will have",
    "she's": "she is",
    "should've": "should have",
    "shouldn't": "should not",
    "shouldn't've": "should not have",
    "so've": "so have",
    "so's": "so is",
    "that'd": "that had",
    "that'd've": "that would have",
    "that's": "that is",
    "there'd": "there had",
    "there'd've": "there would have",
    "there's": "there is",
    "they'd": "they had",
    "they'd've": "they would have",
    "they'll": "they will",
    "they'll've": "they will have",
    "they're": "they are",
    "they've": "they have",
    "to've": "to have",
    "wasn't": "was not",
    "we'd": "we had",
    "we'd've": "we would have",
    "we'll": "we will",
    "we'll've": "we will have",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",
    "what'll've": "what will have",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "when's": "when is",
    "when've": "when have",
    "where'd": "where did",
    "where's": "where is",
    "where've": "where have",
    "who'll": "who will",
    "who'll've": "who will have",
    "who's": "who is",
    "who've": "who have",
    "why's": "why is",
    "why've": "why have",
    "will've": "will have",
    "won't": "will not",
    "won't've": "will not have",
    "would've": "would have",
    "wouldn't": "would not",
    "wouldn't've": "would not have",
    "y'all": "you all",
    "y'all'd": "you all would",
    "y'all'd've": "you all would have",
    "y'all're": "you all are",
    "y'all've": "you all have",
    "you'd": "you had",
    "you'd've": "you would have",
    "you'll": "you will",
    "you'll've": "you will have",
    "you're": "you are",
    "you've": "you have",
}


def fix_contractions(text: str):
    for com, replace in CONTRACTIONS.items():
        text = text.replace(com, replace)

    return text


def get_ngrams(corpus: str):
    _sentences_list = nltk.sent_tokenize(".\n".join(corpus.split("\n")))

    sentences_list = []
    for s in _sentences_list:
      clean_sent = re.sub(r'[^a-z\d\s-]', '', s)
      sentences_list.append(clean_sent)

    sentences_words = []
    for sent in sentences_list:
      clean_words = []
      clean_sent = fix_contractions(sent)
      words = nltk.word_tokenize(clean_sent)
      for w in words:
        if w and len(w) > 1 and not w.isdigit() and w not in PUNCT:
          clean_words.append(w)
      if len(clean_words) > 2:
        sentences_words.append(clean_words)

    bigrams = Phrases(sentences_words, min_count=MIN_COUNT_BI, threshold=1, connector_words=STOP_WORDS)
    trigrams = Phrases(bigrams[sentences_words], min_count=MIN_COUNT_TRI, threshold=1, connector_words=STOP_WORDS)

    uniq_ngrams = dict()
    for sent in sentences_words:
      words = trigrams[sent]
      for word in words:
        if word not in uniq_ngrams:
          uniq_ngrams[word] = 0
        uniq_ngrams[word] += 1

    ngrams = []
    for key, value in uniq_ngrams.items():
      if value >= MIN:
        ngrams.append(key)

    return list(set(ngrams))


if __name__ == "__main__":
    filepath = sys.argv[1]
    with open(filepath, "r") as f:
        data = json.load(f)

    sentences_json = data['data']
    _sentences = [sentence + '.' for sentence in sentences_json]
    _corpus = "\n".join(_sentences)
    tokens = get_ngrams(_corpus)
    all_tokens = list(set(tokens))

    print(json.dumps(dict(ngrams=all_tokens)))
