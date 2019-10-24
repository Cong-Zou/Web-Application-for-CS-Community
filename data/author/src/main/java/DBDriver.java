import org.neo4j.driver.v1.*;

import java.util.ArrayList;
import java.util.List;

public class DBDriver implements AutoCloseable {
    private final Driver driver;

    private final String URI = "bolt://localhost:7687";
    private final String USER = "root";
    private final String PASSWORD = "cmu12345";


    public DBDriver() {
        driver = GraphDatabase.driver(URI, AuthTokens.basic(USER, PASSWORD));
    }

    public StatementResult execute(final String command) {
        try ( Session session = driver.session()) {
            StatementResult result = session.writeTransaction(tx -> tx.run(command));
            return result;
        } catch (Exception e) {
            System.out.println("Failed to save author info in DB");
            return null;
        }
    }

    public List<String[]> getPeople()
    {
        try ( Session session = driver.session() )
        {
            return session.readTransaction(tx -> matchPersonNodes( tx ));
        }
    }

    private static List<String[]> matchPersonNodes( Transaction tx )
    {
        List<String[]> people = new ArrayList<>();
        StatementResult result = tx.run( "MATCH (a:Person) RETURN a.name, a.affiliation" );
        while (result.hasNext())
        {
            Record author = result.next();
            String[] nameAndAff = {author.get(0).asString(), author.get(1).asString()};
            people.add(nameAndAff);
        }
        return people;
    }

    @Override
    public void close() throws Exception {
        driver.close();
    }
}
