# Sprint 2 Requirements
## Requirement 7
The workflow starts with an input for author name. Then, the PythonSource calls the coauthor 
API with the given author name. The API returns a list of the author's coauthors. Next, the 
PythonSource iterates through the coauthors to get the second-level coauthors. Lastly, it outputs 
all the coauthors, both first and second-level.

To show the coauthor network, the client side of our web app calls the API to get all the coauthors 
together with the given author and their relationships. The authors are also separated by group, 
with the given author as group 1, first-level authors as group 2 and second-level as group 3 to 
distinguish them in the graph. With the returned data, the web app draws the collaboration network 
using D3's force directed graph, with the author's names as labels.
## Requirement 12
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
## Requirement 13
The workflow starts with three string inputs, channel, start_year and end_year. The PythonSource 
calls the map/channel API to get the titles and locations of the publications published in the 
given channel within the specified time frame.

To show the distribution of publications on a map. The client side of the web application gets 
the response from the map/channel API and mark them on a map using the Google Map API. Each marker 
represents a publication published in the given publication channel within the given time frame in 
years.
