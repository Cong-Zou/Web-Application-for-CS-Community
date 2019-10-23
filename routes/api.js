var express = require('express');
var router = express.Router();

const neo4j = require('neo4j-driver').v1;

const uri = 'bolt://localhost:7688';
const driver = neo4j.driver(uri);
// const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();
/* GET home page. */
router.get('/paper', async (req, res, next) => {
    try {
        const title = req.query.title;
        console.log('title is', title);
        const result = await session.run(
            `Match (p1:Paper) where p1.title=$title RETURN p1 as paper, [(author:Person)-[:Writes]->(p1:Paper)|author.name] as authors,  [(p1:Paper) -[:Cites]->(p2:Paper)|p2.title] as citations`,
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
            citations: citations
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
            `Match (p1:Person) where p1.name=$name RETURN p1 as person, [(p1:Person)-[:Writes]->(p2:Paper)|p2.title] as publicationList`,
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
            `Match (p1:Person) where p1.name=$name RETURN [(p1:Person)-[:Writes]->(p2:Paper) where toInteger(p2.year)<=$endYear and toInteger(p2.year)>=$startYear |p2] as publicationList`,
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
            `Match (p1:Person)-[:Writes]->(p2:Paper) where p1.name=$name return [(p3:Person)-[:Writes]->(p2) where p3.name<>p1.name |p3] as coworkers`,
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




module.exports = router;
