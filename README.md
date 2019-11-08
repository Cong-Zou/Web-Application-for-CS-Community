# 18656-Fall-2019-Team7
## Sprint 2

### Requirement 1
This requirement asks to show the evolution of topics for a given journal in a given year range. To test this requirement, first start by navigating to the "AdvReq1" folder under workflows and open the vistrails file. Here you will need to provide 3 inputs: Journal, Year1 (Start), and Year2 (End). For testing purpose, use the following configuration
	Year1: 2014
	Year2: 2016
	Journal: IEEE Trans. Services Computing
You will then get a dictionary showing the top 20 keywords for each year.
Following this, navigate to this query in the web client and enter the same data. You will find 3 pie charts giving a visual of the keywords over these years.

### Requirement 4
This requirement need to categorize papers, input startYear and endYear(both included).
For example: 2010, 2010 will return all papers published in 2010
And the papers will be categorized into predefined categories.(based on the top topics)

### Requirement 5
This is similar with the requirement 4, we can provide more restriction, for example, the keyword and channel name.
2010, 2010, collect, ICWS will return all papers published in ICWS in 2010 and contain keyword "collect".

### Requirement 6
This requirement asks to provide a path between two authors. This requiremnt is implemented solely in vistrails. To test, open the "AdvReq6" workflow folder and open the vistrails file. For testing purposes, use the following use cases:
	Use Case 1:
		Author1: Chi-Feng Chen
		Author2: Kun-Che Hsu
	Use Case 2:
		Author1: Sajib Mistry
		Author2: Sea Ling

### Requirement 7
The workflow starts with an input for author name. Then, the PythonSource calls the coauthor 
API with the given author name. The API returns a list of the author's coauthors. Next, the 
PythonSource iterates through the coauthors to get the second-level coauthors. Lastly, it outputs 
all the coauthors, both first and second-level.

To show the coauthor network, the client side of our web app calls the API to get all the coauthors 
together with the given author and their relationships. The authors are also separated by group, 
with the given author as group 1, first-level authors as group 2 and second-level as group 3 to 
distinguish them in the graph. With the returned data, the web app draws the collaboration network 
using D3's force directed graph, with the author's names as labels.

### Requirement 8
Input some keywords(split by ,) and k number(default is 10), it will generate the top k papers and their authors.


### Requirement 9
The requirement aims to input a major publication channel (a journal or a conference) and output the
list of the top 20 cited papers in that channel.
The corresponding api channel/top20 which takes the channel as parameters has been built first, 
and then we call it in the vistrail workflow tool. 
The workflow has one input string called channel and outputs a list of tuples which consists of top 20
cited papers' title and citation counts.


### Requirement 10
The requirement aims to input a major publication channel (a journal or a conference) and year frame,
then output the list of the top 10 cited papers in that channel in that year.
The corresponding api channel/yeartop10 which takes the channel and the year as parameters has been built first, 
and then we call it in the vistrail workflow tool. 
The workflow has two input strings called channel and year, and then outputs a list of tuples which consists of top 10
cited papers' title and citation counts.

### Requirement 11
The requirement aims to input a search paper and give the recommendations on the papers people also visit.
We could assume that citation relationship connects two papers in the similar domains, so that the citation one can be 
the recommended ones.
The corresponding api paper/related which takes the paper title as parameters has been built first, 
and then we call it in the vistrail workflow tool. 
The workflow has one input string called title, and then outputs a list of papers which have close relationships with
the target paper.

### Requirement 12
The workflow has two string inputs, country and keywords. The PythonSource takes in the inputs 
and makes an API request to get the publications related to the keywords from the specified 
country. The API returns a list of publications, each with the publication title, the 
latitude and longitude of the institution where majority of the publication's authors are from.

In our web application, the client side gets the list of publication locations from the API 
and marks them on a map using the Google Map API. Each marker represents a publication related 
to the given topic from the given country. If you hover over the marker, you can see the title
of the publication.

The latitude, longitude and country information are collected by the GeoCodeCollector in 
data/author/src/main/java. The collector iterates through all the publications. For each 
publication, it gets all the authors' affiliations and use the most common affiliation as 
the address. Then, it calls the Google Geocode API to get the country, latitude and longitude 
of the address. Lastly, it stores the location information to the publication node in Noe4j.
### Requirement 13
The workflow starts with three string inputs, channel, start_year and end_year. The PythonSource 
calls the map/channel API to get the titles and locations of the publications published in the 
given channel within the specified time frame.

To show the distribution of publications on a map. The client side of the web application gets 
the response from the map/channel API and mark them on a map using the Google Map API. Each marker 
represents a publication published in the given publication channel within the given time frame in 
years.

### Requirement 4.1
Please see pdf file "Sprint2-Req4.1" in top level directory.