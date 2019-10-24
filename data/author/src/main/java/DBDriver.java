import org.neo4j.driver.v1.*;

import java.util.ArrayList;
import java.util.List;

public class DBDriver implements AutoCloseable {
    private final Driver driver;

    private final String URI = "bolt://129.146.189.33:7687";
    private final String USER = "neo4j";
    private final String PASSWORD = "diwd-team7";


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

    public List<String> getPeople()
    {
        try ( Session session = driver.session() )
        {
            return session.readTransaction(tx -> matchPersonNodes( tx ));
        }
    }

    private static List<String> matchPersonNodes( Transaction tx )
    {
        List<String> people = new ArrayList<>();
        StatementResult result = tx.run( "MATCH (a:Author) RETURN a.name" );
        while (result.hasNext())
        {
            Record author = result.next();
            people.add(author.get(0).asString());
        }
        return people;
    }

    @Override
    public void close() throws Exception {
        driver.close();
    }
}
