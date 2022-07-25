import rbo
import nltk

nltk.download('punkt')
nltk.download('stopwords')

print('nltk', nltk.__version__)
print('\n')
print('rbo', rbo is not None)
print('\n')
print('stop words', len(nltk.corpus.stopwords.words('english')))
