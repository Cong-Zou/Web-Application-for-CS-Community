import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Wrapper for AMiner to get author infomation - affiliation, title, interests, photo, homepage, email
 */
public class AMiner {
    private final String ENDPOINT_BASIC = "https://api.aminer.org/api/search/person";

    public void collectAuthorInfo(Author author) {
        String response = searchAuthor(author);
        processSearchResponse(response, author);
    }

    private String searchAuthor(Author author) {
        String name = author.getName();

        try {
            // call AMiner API to get author info based on the author name
            URL url = new URL(ENDPOINT_BASIC + "?query=" + URLEncoder.encode(name, "UTF-8"));
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
            System.out.println("Failed to get data from AMiner for " + author.getName());
            return null;
        }
    }

    private void processSearchResponse(String responseStr, Author author) {
        if (responseStr == null) return;

        JSONObject response;
        JSONArray searchResults;
        String authorName = author.getName();

        // parse json response from AMiner API
        try {
            response = new JSONObject(responseStr);
            searchResults = response.getJSONArray("result");
        } catch (JSONException e) {
            System.out.println("Failed to get data from AMiner for " + authorName);
            return;
        }

        Map<String, String> attributes = new HashMap<>();
        boolean found = false;

        // loop through results and get author info from the matching author
        for (int i = 0; i < searchResults.length(); i++) {
            JSONObject result = searchResults.getJSONObject(i);
            if (Util.matchesAuthorName(result.getString("name"), authorName)) {
                found = true;

                // affiliation
                try {
                    JSONObject aff = result.getJSONObject("aff");
                    if (aff != null) {
                        String affName = aff.getString("desc");
                        if (affName != null && affName.length() > 0) {
                            attributes.put("affiliation", affName);
                        }
                    }
                } catch (JSONException e) {
                    System.out.println("No affiliation info from AMiner for " + authorName);
                }

                // title
                try {
                    JSONArray posList = result.getJSONArray("pos");
                    if (posList.length() > 0) {
                        JSONObject pos = posList.getJSONObject(0);
                        if (pos != null) {
                            String posName = pos.getString("n");
                            if (posName != null && posName.length() > 0) {
                                attributes.put("title", posName);
                            }
                        }
                    }
                } catch (JSONException e) {
                    System.out.println("No title info from AMiner for " + authorName);
                }

                // interests
                try {
                    JSONArray interestList = result.getJSONArray("tags");
                    StringBuilder interestsStr = new StringBuilder();
                    if (interestList.length() > 0) {
                        interestsStr.append(interestList.getJSONObject(0).getString("t"));
                    }
                    for (int j = 1; j < interestList.length(); j++) {
                        JSONObject interest = interestList.getJSONObject(j);
                        interestsStr.append(", ").append(interest.getString("t"));
                    }
                    if (interestsStr.length() > 0) {
                        attributes.put("interests", interestsStr.toString());
                    }
                } catch (JSONException e) {
                    System.out.println("No interests info from AMiner for " + authorName);
                }

                // photo
                try {
                    String photoUrl = result.getString("avatar");
                    if (photoUrl != null && !photoUrl.contains("default")) {
                        attributes.put("photo", "https:" + photoUrl);
                    }
                } catch (JSONException e) {
                    System.out.println("No photo info from AMiner for " + authorName);
                }

                try {
                    JSONObject contact = result.getJSONObject("contact");
                    if (contact != null) {
                        // homepage
                        String homepage = contact.getString("homepage");
                        if (homepage != null && homepage.length() > 0) {
                            attributes.put("homepage", homepage);
                        }

                        // email
                        if (contact.getBoolean("has_email")) {
                            String id = result.getString("id");
                            if (id != null && id.length() > 0) {
                                String emailImageUrl = WebPage.getEmailFromAMinerPage(id, author.getName());
                                if (emailImageUrl != null && emailImageUrl.length() > 0) {
                                    attributes.put("email", emailImageUrl);
                                }
                            }
                        }
                    }
                } catch (JSONException e) {
                    System.out.println("No contact info from AMiner for " + author.getName());
                }

                break;
            }
        }
        if (!found) {
            System.out.println("No info from AMiner for " + author.getName());
        }
        author.updateInfo(attributes);

    }
}
