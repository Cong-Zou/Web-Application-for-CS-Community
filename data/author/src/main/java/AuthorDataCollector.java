import java.util.List;

/**
 * The execution engine of author data collection
 */
public class AuthorDataCollector {

    /**
     * Collects author info from AMiner, Google Citation and their AMiner webpages
     * @param aMiner the AMiner wrapper
     * @param gCitation the Google Citation wrapper
     * @param webPage the webpage wrapper
     */
    public void collect(AMiner aMiner, GoogleCitation gCitation, WebPage webPage) {
        System.out.println("Starting to collect author data...");
        List<String> authors = Author.getAllAuthors();
        Author author;

        for (String name : authors) {
            author = new Author(name);

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

        // Initialize the wrappers
        AMiner aMiner = new AMiner();
        GoogleCitation gCitation = new GoogleCitation();
        WebPage webPage = new WebPage();

        // Collect author information
        adc.collect(aMiner, gCitation, webPage);
    }
}
