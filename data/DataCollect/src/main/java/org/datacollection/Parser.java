package org.datacollection;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Parser {

    public List<Paper> ParsePapersXML(String pathSocPaperXml) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        FileReader fileReader = new FileReader(pathSocPaperXml);
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line);
        }
        String xmlContent = stringBuilder.toString();

        List<Paper> res = new ArrayList<Paper>();
        Document doc = Jsoup.parse(xmlContent);

        Elements elementsInproc = doc.select("inproceedings");
        for (Element element : elementsInproc) {
            String key = element.attr("key");
//            List<String> authors = new ArrayList<String>();
//            Elements elements1 = element.select("author");
//            for (Element element1 : elements1) {
//                authors.add(element1.text());
//            }
            String authors = element.select("author").text();
            String title = element.select("title").text();
            String pages = element.select("pages").text();
            String year = element.select("year").text();
            String venue = element.select("booktitle").text();
            Elements elements2 = element.select("ee");
            String doi = "null";
            if (!elements2.isEmpty()) {
                doi = elements2.get(0).text();
            }
            Paper paper = new Paper();
            paper.key = key;
            paper.title = title;
            paper.pages = pages;
            paper.year = year;
            paper.venue = venue;
            paper.doi = doi;
            paper.authors = authors;
            if (doi.equals("null")) {
                continue;
            }
            res.add(paper);
//            System.out.println(title);
        }

        Elements elementsArticle = doc.select("article");
        for (Element element : elementsArticle) {
            String key = element.attr("key");
//            List<String> authors = new ArrayList<String>();
//            Elements elements1 = element.select("author");
//            for (Element element1 : elements1) {
//                authors.add(element1.text());
//            }
            String authors = element.select("author").text();
            String title = element.select("title").text();
            String pages = element.select("pages").text();
            String year = element.select("year").text();
            String venue = element.select("journal").text();
            String volume = element.select("volume").text();
            String number = element.select("number").text();
            Elements elements2 = element.select("ee");
            String doi = elements2.get(0).text();
            Paper paper = new Paper();
            paper.key = key;
            paper.title = title;
            paper.pages = pages;
            paper.year = year;
            paper.venue = venue;
            paper.doi = doi;
            paper.authors = authors;
            paper.volume = volume;
            paper.number = number;
            if (doi.equals("null")) {
                continue;
            }
            res.add(paper);
//            System.out.println(title);
        }

        return res;
    }

    public HashMap<String, Integer> MapPaperDoiToIndex(List<Paper> listPapers) {
        HashMap<String, Integer> PaperMap = new HashMap<String, Integer>();
        for (int i = 0; i < listPapers.size(); i++) {
            PaperMap.put(listPapers.get(i).doi, i);
        }
        return PaperMap;
    }

    public void writePaperURLtoFile(List<Paper> listPapers) throws IOException {
        String pathname = "PaperURLs.txt";
        File writeFile = new File(pathname);
        writeFile.createNewFile();
        BufferedWriter out = new BufferedWriter(new FileWriter(writeFile));
        StringBuilder text = new StringBuilder();
        for (Paper paper : listPapers) {
            text.append("\"").append(paper.doi).append("\"").append(",");
        }
        out.write(text.toString());
        out.flush();
        out.close();
    }

    public List<Paper> UpdatePaperCitationsAbs(List<Paper> listPapers, HashMap<String, Integer> mapPapers, String pathCitationsAbs) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(pathCitationsAbs));
            reader.readLine();
            String line = null;
            while ((line = reader.readLine()) != null) {
                String[] item = line.split("\",\"");
                if (item.length < 4) {
                    continue;
                }
                String doi = item[1];
                String citations = item[2];
                String abs = item[3].substring(0, item[3].length() - 1);

                listPapers.get(mapPapers.get(doi)).citations = citations;
                listPapers.get(mapPapers.get(doi)).abs = abs;
//                System.out.println(doi);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listPapers;
    }

    public List<Author> GetAuthorList(String pathAuthors) {
        List<Author> listAuthors = new ArrayList<Author>();
        List<String> listHref = new ArrayList<String>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(pathAuthors));
            reader.readLine();
            String line = null;
            while ((line = reader.readLine()) != null) {
                String[] item = line.split("\",\"");
                if (item.length < 6) {
                    continue;
                }
                String name = item[2];
                String href = item[3];
                String affi = item[4];
                String topics = item[5].substring(0, item[5].length() - 2);
                if (!listHref.contains(href)) {
                    listHref.add(href);
                    Author author = new Author();
                    author.name = name;
                    author.href = href;
                    author.affiliation = affi;
                    author.interests = topics;
                    listAuthors.add(author);
                }
//                System.out.println(href);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return listAuthors;
    }

    public HashMap<String, String> GetWritesMap(String pathAuthors) {
        HashMap<String, String> WritesMap = new HashMap<String, String>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(pathAuthors));
            reader.readLine();
            String line = null;
            while ((line = reader.readLine()) != null) {
                String[] item = line.split("\",\"");
                if (item.length < 6) {
                    continue;
                }
                String doi = item[1];
                String href = item[3];
                WritesMap.put(href, doi);
//                System.out.println(doi);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return WritesMap;
    }

    public HashMap<String, String> GetCitesMap(String pathCited) {
        HashMap<String, String> CitesMap = new HashMap<String, String>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(pathCited));
            reader.readLine();
            String line = null;
            while ((line = reader.readLine()) != null) {
                String[] item = line.split("\",\"");
                if (item.length < 6) {
                    continue;
                }
                String doi1 = item[1];
                String doi2 = item[5].substring(0, item[5].length() - 1);
                if (doi2.contains("/ICWS.") || doi2.contains("/TSC.") || doi2.contains("/SCC.")) {
                    CitesMap.put(doi2, doi1);
//                    System.out.println(doi2);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return CitesMap;
    }
}
