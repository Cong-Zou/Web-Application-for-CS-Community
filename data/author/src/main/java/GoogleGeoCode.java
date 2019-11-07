import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Scanner;

public class GoogleGeoCode {

    public GeoCode getGeoInfo(String affiliation) {
        String response = getGeoCodeAPIResponse(affiliation);
        return parseResponse(response);
    }

    private String getGeoCodeAPIResponse(String affiliation) {
        final String GEOCODE_API = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        final String API_KEY = "&key=AIzaSyD9x4lgdZ2gzPF8r4Yo1YybNqWYLOtrB8k";

        try {
            URL url = new URL(GEOCODE_API + URLEncoder.encode(affiliation, "UTF-8") + API_KEY);
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // Receive search response
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

            JSONObject geometry = result.getJSONObject("geometry");
            JSONObject location = geometry.getJSONObject("location");
            geoCode.lat = location.getDouble("lat");
            geoCode.lng = location.getDouble("lng");

            return geoCode;
        } catch (JSONException e) {
            return null;
        }
    }



    public static void main(String[] args) {
        GoogleGeoCode g = new GoogleGeoCode();
        GeoCode geoCode = g.getGeoInfo("KOM – Multimedia Communications Lab");
        System.out.println(geoCode == null ? "null" : geoCode.country + " " + geoCode.lat + " " + geoCode.lng);
    }
}
