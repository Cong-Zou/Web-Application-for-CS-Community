import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Scanner;

/**
 * Wrapper class for Google Geocode API,
 * used to get the latitude, longitude and country of an affiliation
 */
public class GoogleGeoCode {

    public GeoCode getGeoInfo(String affiliation) {
        String response = getGeoCodeAPIResponse(affiliation);
        return parseResponse(response);
    }

    private String getGeoCodeAPIResponse(String affiliation) {
        final String GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        final String API_KEY = "&key=" + "YOUR_API_KEY";

        try {
            // request the geocode API for location information given the affiliation name
            URL url = new URL(GEOCODE_API + URLEncoder.encode(affiliation, "UTF-8") + API_KEY);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // receive search response
            InputStream responseStream = connection.getInputStream();
            Scanner scanner = new Scanner(responseStream);
            String responseStr = scanner.useDelimiter("\\A").next();

            responseStream.close();
            scanner.close();

            return responseStr;
        } catch (IOException e) {
            System.out.println("Failed to get geocode for: " + affiliation);
            return null;
        }
    }

    private GeoCode parseResponse(String responseStr) {
        if (responseStr == null) return null;
        try {
            // parse the json repsonse from Geocode API
            GeoCode geoCode = new GeoCode();
            JSONObject response = new JSONObject(responseStr);
            JSONObject result = response.getJSONArray("results").getJSONObject(0);

            JSONArray addressComponents = result.getJSONArray("address_components");
            for (int i = 0; i < addressComponents.length(); i++) {
                JSONObject component = addressComponents.getJSONObject(i);
                JSONArray types = component.getJSONArray("types");
                for (int j = 0; j < types.length(); j++) {
                    String type = types.getString(j);
                    if ("country".equals(type)) {
                        geoCode.country = component.getString("long_name");
                    }
                }
            }

            // return the location information of the affiliation
            JSONObject geometry = result.getJSONObject("geometry");
            JSONObject location = geometry.getJSONObject("location");
            geoCode.lat = location.getDouble("lat");
            geoCode.lng = location.getDouble("lng");

            return geoCode;
        } catch (JSONException e) {
            return null;
        }
    }
}
