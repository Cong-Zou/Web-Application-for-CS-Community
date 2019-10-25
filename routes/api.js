var express = require('express');
var router = express.Router();

const neo4j = require('neo4j-driver').v1;

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
            `Match (p2:Paper) where p2.venue=$channelName and p2.year=$year return p2.title as title`,
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
            title.split(' ').forEach(word => {
                if (!countMap.has(word)) {
                    countMap.set(word, 0);
                }
                countMap.set(word, countMap.get(word) + 1);
            })
        })
        countMap[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => (a[1] - b[1] || b[0].length - a[0].length));
        }


        const body = [...countMap].slice(0, 20);
        console.log(body)
        res.status(200).json(body);
    } catch (e) {
        console.log('error', e);
        res.status(400).json({error: e});
    }
});


module.exports = router;
