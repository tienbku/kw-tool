import re
import sys
import nltk
import json
import string
from nltk.corpus import stopwords
from collections import defaultdict
from shared import shared_stopwords
from gensim.models.phrases import Phrases

nltk.download('punkt')
nltk.download('stopwords')

WINDOW = 5
MIN_COUNT_BI = 5
MIN_COUNT_TRI = 2
MIN_COUNT_PHRASES = 10
PUNCT = list(string.punctuation)

STOP_WORDS = set(list(stopwords.words('english')) + shared_stopwords)

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


def get_ngrams(corpus: str):
    sentences_list = nltk.sent_tokenize(corpus)

    sentences_words = []
    for sent in sentences_list:
        clean_words = []
        clean_sent = fix_contractions(sent)
        words = nltk.word_tokenize(clean_sent)
        for w in words:
            if w in STOP_WORDS:
                continue
            if w and len(w) > 1 and not w.isdigit() and w not in PUNCT:
                clean_words.append(w)
        if len(clean_words) > 1:
            sentences_words.append(clean_words)

    bigram = Phrases(sentences_words, min_count=MIN_COUNT_BI, threshold=0.1, connector_words=STOP_WORDS)
    trigram = Phrases(bigram[sentences_words], min_count=MIN_COUNT_TRI, threshold=0.1, connector_words=STOP_WORDS)
    popular = most_frequent_words(trigram, sentences_words, 100, 1, 3)

    all_words = []
    for pop in popular:
        if pop not in STOP_WORDS:
            all_words.append(pop)
            if pop not in STOP_WORDS:
                all_words.append(pop)

    passed = []
    phrases = []

    for _s in sentences_words:
        _x = trigram[_s]
        for phrase in _x:
            phrases.append(phrase)

    phrases = list(set(phrases))

    for phrase in phrases:
        clean_phrase = phrase.replace('_', ' ')
        count = sum(1 for _ in re.finditer(r'\b%s\b' % re.escape(clean_phrase), corpus))
        if count > MIN_COUNT_PHRASES and len(clean_phrase) > 2:
            passed.append(phrase)

    return list(set(all_words + passed))


if __name__ == "__main__":
    filepath = sys.argv[1]
    with open(filepath, "r") as f:
        data = json.load(f)

    _corpus = data['data'].lower()
    all_tokens = get_ngrams(_corpus)

    print(json.dumps(dict(ngrams=all_tokens)))
