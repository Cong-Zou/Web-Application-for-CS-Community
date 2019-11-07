var express = require('express');
var router = express.Router();

const neo4j = require('neo4j-driver').v1;

const USELESS_WORDS = new Set(['in', 'the', 'and', 'to', 'a', 'of', 'by', 'an', 'can', 'from', 'this', 'with', 'is', 'are'])

let neo4j_addr = process.env.NEO4J_URI || "";
const user = neo4j_addr.split('|')[0];
const password = neo4j_addr.split('|')[1];
neo4j_addr = neo4j_addr.split('|')[2] || 'bolt://localhost:7688';
let driver;
if (!user) {
    console.log('start neo4j driver without auth addr:', neo4j_addr);
    driver = neo4j.driver(neo4j_addr);
} else {
    console.log('start neo4j driver addr:', neo4j_addr, user, password);
    driver = neo4j.driver(neo4j_addr, neo4j.auth.basic(user, password));
}

const session = driver.session();
/* GET home page. */
router.get('/paper', async (req, res, next) => {
    try {
        const title = req.query.title;
        console.log('title is', title);
        const result = await session.run(
            `Match (p1:Paper) where p1.title=$title RETURN p1 as paper, [(author:Author)-[:Writes]->(p1:Paper)|author.name] as authors,  [(p1:Paper) -[:Cites]->(p2:Paper)|p2.title] as citations`,
            {title: title}
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);//.json({'error':'not found'});
            return;
        }
        const singleRecord = result.records[0];
        const paper = singleRecord.get('paper').properties;
        const authors = singleRecord.get('authors');
        const citations = singleRecord.get('citations');
        const body = {
            title: paper.title,
            authors: authors,
            year: paper.year,
            venue: paper.venue,
            abstract: paper.abstract,
            pages: paper.pages,
            citations: citations,
            volume: paper.volume
        };
        console.log('res is', body);
        res.status(200).json(body);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});

router.get('/person', async (req, res, next) => {
    try {
        const name = req.query.name;
        console.log('name is', name);

        const result = await session.run(
            `Match (p1:Author) where p1.name=$name RETURN p1 as person, [(p1:Author)-[:Writes]->(p2:Paper)|p2.title] as publicationList`,
            {name: name}
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }
        const singleRecord = result.records[0];
        const person = singleRecord.get('person').properties;
        const publicationList = singleRecord.get('publicationList');
        if (!person.interests) {
            person.interests = '';
            //todo handle this situation, return [] instead of ['']
        }
        const body = {
            name: person.name,
            photoUrl: person.photo,
            researchInterests: person.interests.split(', '),
            affiliation: person.affiliation,
            email: person.email,
            publicationList: publicationList,
            title: person.title
        }
        res.status(200).json(body);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
})

router.get('/person/publications', async (req, res) => {
    try {
        const name = req.query.name;
        const startYear = Number(req.query.startYear);
        const endYear = Number(req.query.endYear);
        console.log('name startYear endYear', name, startYear, endYear);

        const result = await session.run(
            `Match (p1:Author) where p1.name=$name RETURN [(p1:Author)-[:Writes]->(p2:Paper) where toInteger(p2.year)<=$endYear and toInteger(p2.year)>=$startYear |p2] as publicationList`,
            {name: name, startYear: startYear, endYear: endYear}
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }
        const singleRecord = result.records[0];
        const publicationList = singleRecord.get('publicationList').map(x => x.properties);
        res.status(200).json(publicationList);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
})


router.get('/person/coworkers', async (req, res) => {
    try {
        const name = req.query.name;
        console.log('name', name);

        const result = await session.run(
            `Match (p1:Author)-[:Writes]->(p2:Paper) where p1.name=$name return [(p3:Author)-[:Writes]->(p2) where p3.name<>p1.name |p3] as coworkers`,
            {
                name: name
            }
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }
        const singleRecord = result.records[0];
        const coworkers = singleRecord.get('coworkers').map(x => x.properties);
        res.status(200).json(coworkers);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
})


router.get('/channel', async (req, res) => {
    try {
        const name = req.query.name;
        console.log('name', name);

        const result = await session.run(
            `Match (p1:Author)-[:Writes]->(p2:Paper) where p2.venue=$name With p2.volume as volume,p1 return volume,count(p1) as counts`, {
                name: name
            }
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }
        console.log(result.records);
        const body = {
            name: name,
            volumes: result.records.map(x => {
                return {name: x.get('volume'), authorCount: x.get('counts')}
            })
        }
        res.status(200).json(body);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});

router.get('/search/experts', async (req, res) => {
    try {

        const key = req.query.key;
        console.log('key', key);

        const result = await session.run(
            `Match (p2:Author) WHERE p2.interests CONTAINS $key return p2 as person`,
            {
                key: key
            }
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }
        const personList = result.records.map(x => {
            const person = x.get('person').properties
            if (!person.interests) {
                person.interests = ''
            }
            return {
                name: person.name,
                photoUrl: person.photo,
                researchInterests: person.interests.split(', '),
                affiliation: person.affiliation,
                email: person.email,
                title: person.title
            }
        })
        console.log(personList)
        res.status(200).json(personList);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }

});

router.get('/search/focused_topics', async (req, res) => {
    try {
        const channelName = req.query.channelName;
        const year = req.query.year;
        console.log('channelName', channelName);

        const result = await session.run(
            `Match (p2:Paper) where p2.venue=$channelName and p2.year=$year return p2.title as title, p2.abstract as abstract`,
            {
                channelName: channelName,
                year: year
            }
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }

        const countMap = new Map();

        result.records.forEach(p => {
            const title = p.get('title');
            const abstract = p.get('abstract');
            (abstract + ' ' + title).split(' ').forEach(word => {
                if (USELESS_WORDS.has(word.toLowerCase())) {
                    return;
                }
                if (!countMap.has(word)) {
                    countMap.set(word, 0);
                }
                countMap.set(word, countMap.get(word) + 1);
            })
        })
        const sortedList = [...countMap.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length);

        const body = sortedList.slice(0, 20);
        res.status(200).json(body);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});


router.get('/paper/top_k', async (req, res) => {
    try {
        const keywords = req.query.keywords;
        const keywordList = keywords.split(',');
        const kNum = +req.query.k;

        const result = await session.run(
            `with $keywordList as wordList unwind wordList as word with word Match(p:Paper) where (p.abstract+' '+p.title) CONTAINS word return p as paper, [(author:Author)-[:Writes]->(p:Paper)|author.name] as authors limit $k`,
            {
                keywordList: keywordList,
                k: kNum
            }
        );
        console.log(result.records);
        if (result.records.length === 0) {
            res.sendStatus(404);
            return;
        }

        const paperList = result.records.map(singleRecord => {
            const paper = singleRecord.get('paper').properties;
            const authors = singleRecord.get('authors');
            const body = {
                title: paper.title,
                authors: authors,
                year: paper.year,
                venue: paper.venue,
                abstract: paper.abstract,
                pages: paper.pages,
                citations: null,
                volume: paper.volume
            };
            return body
        })

        // console.log(result.records)
        res.status(200).json(paperList);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});


router.get('/paper/categorize', async (req, res) => {
        try {
            const keywords = req.query.keywords || '';
            const keywordList = keywords.split(',');
            const startYear = +req.query.startYear;
            const endYear = +req.query.endYear;
            const channelName = req.query.channelName || '%';


            let result;
            if (keywords) {
                result = await session.run(
                    `with $keywordList as wordList unwind wordList as word with word Match(p:Paper) where (p.abstract+' '+p.title) CONTAINS word and ('%'=$channelName or p.venue=$channelName) and toInteger(p.year)<=$endYear and toInteger(p.year)>=$startYear return p as paper`,
                    {keywordList: keywordList, startYear: startYear, endYear: endYear, channelName: channelName}
                );
            } else {
                result = await session.run(
                    `match (p:Paper) where ('%'=$channelName or p.venue=$channelName) and toInteger(p.year)<=$endYear and toInteger(p.year)>=$startYear return p as paper`,
                    {startYear: startYear, endYear: endYear, channelName: channelName}
                );
            }


            console.log(result.records);
            if (result.records.length === 0) {
                res.sendStatus(404);
                return;
            }

            const categories = [
                {name: 'web', papers: []},
                {name: 'system', papers: []},
                {name: 'cloud', papers: []},
                {name: 'mobile', papers: []},
                {name: 'algorithm', papers: []},
                {name: 'others', papers: []}
            ];

            const paperList = result.records.map(singleRecord => {
                const paper = singleRecord.get('paper').properties;
                const body = {
                    title: paper.title,
                    authors: [null],
                    year: paper.year,
                    venue: paper.venue,
                    abstract: paper.abstract,
                    pages: paper.pages,
                    citations: null,
                    volume: paper.volume
                };
                return body
            })
            paperList.forEach(paper => {
                let minCnt = 100000000;
                let curIndex = categories.length - 1;
                for (let i = 0; i < categories.length - 1; i++) {
                    if (paper.abstract.toLowerCase().includes(categories[i].name) && categories[i].papers.length < minCnt) {
                        minCnt = categories[i].papers.length;
                        curIndex = i;
                    }
                }
                categories[curIndex].papers.push(paper);
            });
            // console.log(result.records)
            res.status(200).json(categories);
        } catch
            (e) {
            console.log('error', e);
            res.status(400).json({error: e});
        }
    }
);


// Query 2.7 - Given the name of a researcher, generate a graph* showing a multi-depth
// collaboration network of the author (her co-authors and their co-authors).
router.get('/collaboration', async (req, res) => {
    try {
        const name = req.query.name;
        const result = await session.run(
            `MATCH (a:Author {name: $name})-[:Collaborates]->(o:Author) RETURN o.name AS coauthor`,
            {name: name}
        );

        let authors = new Map();
        let links = [];
        let nodes = [];
        let count = 1;
        nodes.push({id: count, name: name, group: 1});
        authors.set(name, count++);


        if (result.records.length > 0) {
            for (let i = 0; i < result.records.length; i++) {
                const record = result.records[i];
                if (record !== undefined) {
                    const coauthor = record.get('coauthor');
                    if (coauthor.length > 0 && coauthor.valueOf() !== "null".valueOf()) {
                        // node for graph
                        if (authors.get(coauthor) === undefined) {
                            nodes.push({id: count, name: coauthor, group: 2});
                            authors.set(coauthor, count++);
                        }

                        // link for graph
                        const authorIndex = authors.get(name);
                        const coauthorIndex = authors.get(coauthor);
                        links.push({source: authorIndex, target: coauthorIndex});
                    }
                }
            }

            for (const [coauthorName, index] of authors.entries()) {
                if (coauthorName.valueOf() !== name.valueOf()) {
                    const result2 = await session.run(
                        `MATCH (a:Author {name: $name})-[:Collaborates]->(o:Author) RETURN o.name AS coauthor`,
                        {name: coauthorName}
                    );

                    if (result2.records.length > 0) {
                        for (let j = 0; j < result2.records.length; j++) {
                            const record = result2.records[j];
                            if (record !== undefined) {
                                const coauthor = record.get('coauthor');
                                if (coauthor.length > 0 && coauthor.valueOf() !== "null".valueOf()) {
                                    // node for graph
                                    if (authors.get(coauthor) === undefined) {
                                        nodes.push({id: count, name: coauthor, group: 3});
                                        authors.set(coauthor, count++);
                                    }

                                    // link for graph
                                    const coauthorIndex = authors.get(coauthor);
                                    links.push({source: index, target: coauthorIndex});
                                }
                            }
                        }
                    }
                }
            }
        }

        const response = {nodes: nodes, links: links};
        console.log(response);
        res.status(200).json(response);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});

// Query 2.12 - Given some geographical area (e.g., country) and some keywords,
// generate a graph on Google map the publications on the topic,
// whose authors come from the geographical area (at least one or more authors).
router.get('/map/keywords', async (req, res) => {
    try {
        const country = req.query.country;
        const keywords = req.query.keywords;
        const keywordList = keywords.split(/(\s+)/);

        const result = await session.run(
            `WITH $keywordList AS wordList UNWIND wordList AS word WITH word MATCH(p:Paper) WHERE (p.title CONTAINS word OR p.abstract CONTAINS word) AND p.country CONTAINS $country RETURN p.title, p.lat, p.lng`,
            {
                keywordList: keywordList,
                country: country
            }
        );

        const publicationList = result.records.map(record => {
            return {
                title: record.get("p.title"),
                lat: record.get("p.lat"),
                lng: record.get("p.lng")
            };
        });

        console.log(publicationList);
        res.status(200).json(publicationList);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});

// Query 2.13 - Given a publication channel name (journal or conference) and a time frame,
// showcase in a map the publications distribution.
router.get('/map/channel', async (req, res) => {
    try {
        const channel = req.query.channel;
        const startYear = req.query.startYear;
        const endYear = req.query.endYear;

        const result = await session.run(
            `MATCH (p:Paper) WHERE p.venue CONTAINS $channel AND p.year >= $startYear AND p.year <= $endYear AND p.lat IS NOT NULL RETURN p.title, p.lat, p.lng`,
            {
                channel: channel,
                startYear: startYear,
                endYear: endYear
            }
        );

        const publicationList = result.records.map(record => {
            return {
                title: record.get("p.title"),
                lat: record.get("p.lat"),
                lng: record.get("p.lng")
            };
        });

        console.log(publicationList);
        res.status(200).json(publicationList);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});

module.exports = router;
