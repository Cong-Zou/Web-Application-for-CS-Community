import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GeoCodeCollector {

    static int count = 0;

    public void collectGeoCodes() {
        DBDriver dbDriver = new DBDriver();
        GoogleGeoCode googleGeoCode = new GoogleGeoCode();
        List<String> papers = dbDriver.getPapers();

        for (String title: papers) {
            List<String> affiliations = dbDriver.getPaperAuthorsAffiliations(title);
            String mostCommonAffiliation = getMostCommonAffiliation(affiliations);
            if (mostCommonAffiliation != null) {
                GeoCode geoCode = googleGeoCode.getGeoInfo(mostCommonAffiliation);
                if (geoCode != null) {
                    dbDriver.setPublicationCountryAndLatLng(title, geoCode.country, geoCode.lat, geoCode.lng);
                    count++;
                }
            }
        }
    }

    private String getMostCommonAffiliation(List<String> affiliations) {
        if (affiliations == null || affiliations.size() == 0) {
            return null;
        }
        
        Map<String, Integer> map = new HashMap<>();

        for (String affiliation : affiliations) {
            if (affiliation.length() > 0 && !affiliation.equals("null")) {
                Integer count = map.get(affiliation);
                map.put(affiliation, count == null ? 1 : count + 1);
            }
        }

        Map.Entry<String, Integer> mostCommonAffiliation = null;

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
