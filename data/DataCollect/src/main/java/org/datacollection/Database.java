package org.datacollection;

import org.neo4j.driver.v1.*;

import javax.swing.plaf.nimbus.State;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.neo4j.driver.v1.Values.parameters;


public class Database {
    private final Driver driver = GraphDatabase.driver("bolt://129.146.189.33:7687",
            AuthTokens.basic("neo4j", "diwd-team7"));


    public void BuildDatabase(final List<Paper> listPapers, final List<Author> listAuthors, final HashMap<String, String> writesMap, final HashMap<String, String> citesMap) throws Exception {
        try {
            Session session = driver.session();
            String createInfo = session.writeTransaction(new TransactionWork<String>() {
                public String execute(Transaction tx) {
                    // create author nodes
                    System.out.println("Building author nodes...");
                    for (Author author : listAuthors) {
                        String cypher = "create (a:Author{href:$href, name:$name, affiliation:$affiliation, email:$email, photo:$photo, interests:$interests})";
                        StatementResult result = tx.run(cypher, parameters("href", author.href, "name", author.name, "affiliation", author.affiliation, "email", author.email, "photo", author.photo, "interests", author.interests));
                    }

                    // create paper nodes
                    System.out.println("Building paper nodes...");
                    for (Paper paper : listPapers) {
                        String cypher = "create (p:Paper{doi:$doi, key:$key, authors:$authors, title:$title, venue:$venue, year:$year, pages:$pages, citations:$citations, volume:$volume, number:$number, abs:$abs})";
                        StatementResult result = tx.run(cypher, parameters("doi", paper.doi, "key", paper.key, "authors", paper.authors, "title", paper.title, "venue", paper.venue, "year", paper.year, "pages", paper.pages, "citations", paper.citations, "volume", paper.volume, "number", paper.number, "abs", paper.abs));
                    }

                    //create writes relation edges
                    System.out.println("Building writes relations...");
                    for (String href : writesMap.keySet()) {
                        String doi = writesMap.get(href);
                        String cypher = "match (paper: Paper), (author: Author) " +
                                "where paper.doi=$doi and author.href=$href " +
                                "create (paper) <- [:Writes] - (author)";
                        StatementResult result = tx.run(cypher, parameters("doi", doi, "href", href));

                    }

                    //create cites relation edges
                    System.out.println("Building cites relations...");
                    for (String doi1 : citesMap.keySet()) {
                        String doi2 = citesMap.get(doi1);
                        String cypher = "match (paper1: Paper), (paper2: Paper) " +
                                "where paper1.doi=$doi1 and paper2.doi=$doi2 " +
                                "create (paper2) <- [:Cites] - (paper1)";
                        StatementResult result = tx.run(cypher, parameters("doi1", doi1, "doi2", doi2));
                    }

                    return "Done. The neo4j database has been built successfully!";
                }
            });
            System.out.println(createInfo);
            driver.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        driver.close();
    }
}
