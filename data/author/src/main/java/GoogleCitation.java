import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

/**
 * Wrapper class for Google Citation, used to collect author's interests and photo
 */
public class GoogleCitation {

    public void collectAuthorInfo(Author author) {
        String response = getAuthorInfo(author.getName());
        processAuthorInfo(response, author);
    }

    private String getAuthorInfo(String authorName) {
        String s;
        String[] commands = {"/bin/bash",
                "-c",
                "source diwd/bin/activate && python google_scholar.py \"" + authorName + "\""
        };
        try {
            // call the python script that outputs author information
            Process p = Runtime.getRuntime().exec(commands);
            BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new
                    InputStreamReader(p.getErrorStream()));
            StringBuilder result = new StringBuilder();

            // read the standard output
            while ((s = stdInput.readLine()) != null) {
                result.append(s);
            }

            return result.length() == 0 ? null : result.toString().replace("u\'", "\'");

        } catch (IOException e) {
            System.out.println("Failed to get Google Citation data for " + authorName);
            return null;
        }
    }

    private void processAuthorInfo(String json, Author author) {
        if (json == null) return;

        String authorName = author.getName();
        Map<String, String> info = new HashMap<>();
        JSONObject response;

        try {
            response = new JSONObject(json);
        } catch (JSONException e) {
            System.out.println("Failed to collect info from Google Citation for " + authorName);
            return;
        }

        String name = response.getString("name");

        if (!Util.matchesAuthorName(name, authorName)) {
            System.out.println("No info from Google Citation for " + authorName);
            return;
        }

        // parse the result from Google Citation to collect author's interests and photo url
        try {
            JSONArray interests = response.getJSONArray("interests");
            StringBuilder interestList = new StringBuilder();
            for (int i = 0; i < interests.length(); i++) {
                interestList.append(interests.getString(i));
            }
            if (interestList.length() > 0) {
                info.put("interests", interestList.toString());
            }
        } catch (JSONException e) {
            System.out.println("No interests info from Google Citation for " + authorName);
        }

        try {
            String photoUrl = response.getString("url_picture");
            if (photoUrl != null) {
                info.put("photo", photoUrl);
            }
        } catch (JSONException e) {
            System.out.println("No photo info from Google Citation for " + authorName);
        }

        author.updateInfo(info);
    }
}
