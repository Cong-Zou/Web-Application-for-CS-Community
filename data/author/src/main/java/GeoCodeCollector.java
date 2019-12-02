import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mediator for location data collection
 */
public class GeoCodeCollector {

    static int count = 0;

    public void collectGeoCodes() {
        DBDriver dbDriver = new DBDriver();
        GoogleGeoCode googleGeoCode = new GoogleGeoCode();
        List<String> papers = dbDriver.getPapers();

        // collect location data for each paper from the DB
        for (String title: papers) {
            // get the affiliations of the paper's authors
            List<String> affiliations = dbDriver.getPaperAuthorsAffiliations(title);
            // get the most common affiliation
            String mostCommonAffiliation = getMostCommonAffiliation(affiliations);
            if (mostCommonAffiliation != null) {
                // retrieves the affiliation's latitude, longitude and country from the Google Geocode API
                GeoCode geoCode = googleGeoCode.getGeoInfo(mostCommonAffiliation);
                if (geoCode != null) {
                    // store the location data in DB
                    dbDriver.setPublicationCountryAndLatLng(title, geoCode.country, geoCode.lat, geoCode.lng);
                    count++;
                }
            }
        }
    }

    /**
     * Returns the affiliation that appears the most in the list
     */
    private String getMostCommonAffiliation(List<String> affiliations) {
        if (affiliations == null || affiliations.size() == 0) {
            return null;
        }
        
        Map<String, Integer> map = new HashMap<>();

        // record the occurrance of each affiliation
        for (String affiliation : affiliations) {
            if (affiliation.length() > 0 && !affiliation.equals("null")) {
                Integer count = map.get(affiliation);
                map.put(affiliation, count == null ? 1 : count + 1);
            }
        }

        Map.Entry<String, Integer> mostCommonAffiliation = null;

        // get the most frequently appeared affiliation
        for (Map.Entry<String, Integer> affiliation : map.entrySet()) {
            if (mostCommonAffiliation == null
                    || affiliation.getValue() > mostCommonAffiliation.getValue()) {
                mostCommonAffiliation = affiliation;
            }
        }

        return mostCommonAffiliation == null ? null : mostCommonAffiliation.getKey();
    }

    public static void main(String[] args) {
        System.out.println("Starting to collect geometry information for publications...");
        GeoCodeCollector gc = new GeoCodeCollector();
        gc.collectGeoCodes();
        System.out.println("Collection of geometry information for publications completed!");
        System.out.println("Added geocode for " + count + " publications.");
    }

}
