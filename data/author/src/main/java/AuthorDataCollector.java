import java.util.List;

public class AuthorDataCollector {

    public void collect(AMiner aMiner, GoogleCitation gCitation, WebPage webPage) {
        System.out.println("Starting to collect author data...");
        List<String[]> authors = Author.getAllAuthors();
        String name, affiliation;
        Author author;

        for (String[] nameAndAff : authors) {
            name = nameAndAff[0];
            affiliation = nameAndAff[1];
            boolean hasAffiliation = !affiliation.equals("null");
            author = new Author(name, hasAffiliation ? affiliation : null, hasAffiliation);

            // use AMiner to collect affiliation, title, email, interests, photo and homepage info
            aMiner.collectAuthorInfo(author);

            // use Google Citation to collect interests and photo info
            if (author.getInterests() == null || author.getPhoto() == null) {
                gCitation.collectAuthorInfo(author);
            }

            author.updateInDB();
        }

        System.out.println(String.format(
                "Author data collection complete.\nProcessed %d authors\nUpdated %d affiliations, %d titles, %d emails, %d interests, %d photos, and %d homepages",
                Author.authorCount, Author.affiliationUpdate, Author.titleUpdate, Author.emailUpdate, Author.interestsUpdate, Author.photoUpdate, Author.homepageUpdate));
    }

    public static void main(String[] args) {
        AuthorDataCollector adc = new AuthorDataCollector();

        AMiner aMiner = new AMiner();
        GoogleCitation gCitation = new GoogleCitation();
        WebPage webPage = new WebPage();

        adc.collect(aMiner, gCitation, webPage);
    }
}
