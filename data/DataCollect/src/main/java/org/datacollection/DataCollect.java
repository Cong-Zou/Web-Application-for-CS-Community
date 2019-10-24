package org.datacollection;

import java.util.HashMap;
import java.util.List;

public class DataCollect {
    public static void main(String[] args) throws Exception {
        String pathSocPapersXml = "dblp-soc-papers.xml";
        String pathAuthors = "crawl_authors.csv";
        String pathCitationsAbs = "crawl_citations_abs.csv";
        String pathCited = "crawl_cited.csv";
        Parser parser = new Parser();
        Database database = new Database();

        // parse XML to get paper info
        List<Paper> listPapers = parser.ParsePapersXML(pathSocPapersXml);
        HashMap<String, Integer> mapPapers = parser.MapPaperDoiToIndex(listPapers);

        // parse crawled data
        listPapers = parser.UpdatePaperCitationsAbs(listPapers, mapPapers, pathCitationsAbs);
        List<Author> listAuthors = parser.GetAuthorList(pathAuthors);
        HashMap<String, String> writesMap = parser.GetWritesMap(pathAuthors);
        HashMap<String, String> citesMap = parser.GetCitesMap(pathCited);
        database.BuildDatabase(listPapers, listAuthors, writesMap, citesMap);

        System.out.println("Done.");
    }
}
