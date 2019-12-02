## To Collect Author Information:

Before Running the Author Data Collector:
1. Create a virtual environment in the `author` directory:
`virtualenv diwd`
2. Activate the virtual environment:
`source diwd/bin/activate`
3. Install scholarly.py:
`pip install --upgrade pip`
`pip install scholarly`

Then, Run the `main()` method of AuthorDataCollector.java to collect the author data. Make sure you have the correct database credentials.

## To Collect Location Information:
1. Set the `API_KEY` in GoogleGeoCode.java to your own Google API key. Make sure Geocode API is enabled in your GCP console.
2. Run the main() method of GeoCodeCollector.java to collect geographic information of papers and store them in DB.