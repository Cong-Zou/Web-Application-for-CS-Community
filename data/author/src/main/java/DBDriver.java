import org.neo4j.driver.v1.*;

import java.util.ArrayList;
import java.util.List;

import static org.neo4j.driver.v1.Values.parameters;

/**
 * The Driver class of the Neo4j database
 */
public class DBDriver implements AutoCloseable {
    private final Driver driver;

    private final String URI = "bolt://129.146.189.33:7687";
    private final String USER = "neo4j";
    private final String PASSWORD = "diwd-team7";


    public DBDriver() {
        driver = GraphDatabase.driver(URI, AuthTokens.basic(USER, PASSWORD));
    }

    /**
     * Executes a write transaction to DB
     * @param command the write command
     * @return the result of the write command
     */
    public StatementResult execute(final String command) {
        try ( Session session = driver.session()) {
            StatementResult result = session.writeTransaction(tx -> tx.run(command));
            return result;
        } catch (Exception e) {
            System.out.println("Failed to save author info in DB");
            return null;
        }
    }

    /**
     * Gets all authors from the DB
     * @return a list of all authors' names
     */
    public List<String> getPeople() {
        try ( Session session = driver.session() )
        {
            return session.readTransaction(tx -> matchPersonNodes( tx ));
        }
    }

    private List<String> matchPersonNodes( Transaction tx ) {
        List<String> people = new ArrayList<>();
        StatementResult result = tx.run( "MATCH (a:Author) RETURN a.name" );
        while (result.hasNext())
        {
            Record author = result.next();
            people.add(author.get(0).asString());
        }
        return people;
    }

    /**
     * Gets all papers from the DB
     * @return a list of all papers' titles
     */
    public List<String> getPapers() {
        try ( Session session = driver.session() )
        {
            return session.readTransaction(tx -> matchPaperNodes( tx ));
        }
    }

    private List<String> matchPaperNodes( Transaction tx ) {
        List<String> papers = new ArrayList<>();
        StatementResult result = tx.run( "MATCH (p:Paper) RETURN p.title" );
        while (result.hasNext())
        {
            Record paper = result.next();
            papers.add(paper.get(0).asString());
        }
        return papers;
    }

    /**
     * Gets the affiliations of the given paper's authors
     * @param paperTitle the title of the paper
     * @return a list of affiliation names of the paper's authors
     */
    public List<String> getPaperAuthorsAffiliations(String paperTitle) {
        try ( Session session = driver.session() )
        {
            return session.readTransaction(tx -> matchPaperAuthorNodes(tx, paperTitle));
        }
    }

    private List<String> matchPaperAuthorNodes(Transaction tx, String paperTitle) {
        List<String> affiliations = new ArrayList<>();
        StatementResult result = tx.run(
                "MATCH (p:Paper {title: $title})<-[:Writes]-(a:Author) RETURN a.affiliation",
                parameters("title", paperTitle) );
        while (result.hasNext())
        {
            Record record = result.next();
            affiliations.add(record.get(0).asString());
        }
        return affiliations;
    }

    /**
     * Finds a paper with the given title and sets its country, lat and lng in DB
     */
    public void setPublicationCountryAndLatLng(String title, String country, double lat, double lng) {
        try ( Session session = driver.session() )
        {
            String response = session.writeTransaction(tx -> {
                StatementResult result = tx.run( "MATCH (p:Paper {title: $title}) " +
                                "SET p.country = $country " +
                                "SET p.lat = $lat " +
                                "SET p.lng = $lng " +
                                "RETURN p.title + ' ' + p.country + ' ' + p.lat + ' ' + p.lng",
                        parameters("title", title, "country", country, "lat", lat, "lng", lng));
                return result.next().get(0).asString();
            });
            System.out.println(response);
        }
    }

    @Override
    public void close() throws Exception {
        driver.close();
    }
}
