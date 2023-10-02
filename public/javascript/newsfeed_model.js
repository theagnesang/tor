import { driver, neo4jconfig } from './neo4j_database.js';


class NewsFeed {


  getAllNodes(callback) {
    const session = driver.session({ database: neo4jconfig.database});
    session.run('MATCH (n) RETURN n LIMIT 25')
      .then(result => {
        const data = result.records.map(record => record.get(0).properties);
        callback(null, data);
        session.close();
        driver.close();
      })
      .catch(error => {
        callback(error, null);
        driver.close();
      });
    }

}


export default NewsFeed;
