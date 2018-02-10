from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import csv
import json
analyser = SentimentIntensityAnalyzer()
def main():


	file2 = open('alltweetswsentiment.json', 'a')
	
	with open('data/alltweets.json', 'rU') as f:
		for line in f:

			j_content = json.loads(line)
			#print j_content
			text = j_content['text'].encode("utf-8")
			compound = print_sentiment_scores(text)
			j_content['sentiment_score'] = compound

			json.dump(j_content, file2)



			


def print_sentiment_scores(sentence):
    snt = analyser.polarity_scores(sentence)

    #print("{:-<40} {}".format(sentence, str(snt)))
    #print snt['compound']
    return snt['compound']


if __name__ == "__main__":
	main()