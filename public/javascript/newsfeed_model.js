import { driver, neo4jconfig } from './neo4j_database.js';


class NewsFeed {

  async getAllNodes() {
    const session = driver.session({ 
      // Run sessions in read mode by default
      //defaultAccessMode: session.READ,
      // Run all queries against the 'neo4jconfig.database' database
      database: neo4jconfig.database,
     });
    try {
      const result = await session.run('MATCH (n) RETURN n LIMIT 25');
      return result.records.map(record => record.get(0).properties);
    } catch (error) {
      console.error('Error in getAllNodes:', error);
      throw error;
    } finally {
      session.close();
    }
  }

  async userGetAllContent(userid) {
    const session = driver.session({ database: neo4jconfig.database });
    try {
      const result = await session.run(
        `MATCH (feed:Feed {userid: $userid})<-[:POST_BELONG_TO]-(content:Content)
        RETURN content ORDER BY content.created_at DESC`,
        { userid }
      );
      return result.records.map(record => record.get('content').properties);
    } catch (error) {
      console.error('Error in userGetAllContent:', error);
      throw error;
    } finally {
      session.close();
    }
  }
  
  
  async userPutPost(userid, content, feedid) {
    const session = driver.session({ database: neo4jconfig.database });
    try {
      const result = await session.run(
        `MATCH (user:User {userid: $userid}), (feed:Feed {feedid: $feedid})
        CREATE (post:Content {content: $content, contentid: toString(randomUUID()), userid: $userid, entity_type: 'Post', created_at: timestamp()})-[:POST_BELONG_TO]->(feed)
        RETURN post`,
      { userid, content, feedid }
      );
      console.log(result)
      return result.records.map(record => record.get('post').properties);
    } catch (error) {
      throw error;
    } finally {
      session.close();
    }
  }
  
  async userLikedPostComment(userid, contentid) {
    const session = driver.session({ database: neo4jconfig.database });
    try {
      const result = await session.run(
        `MATCH (user:User {userid: $userid}), (content:Content {contentid: $contentid})
         CREATE (user)-[:LIKED]->(content)
         RETURN content`,
        { userid, contentid }
      );
      return result.records.map(record => record.get('content').properties);
    } catch (error) {
      throw error;
    } finally {
      session.close();
    }
  }
  
  async userSavedPostComment(userid, contentid) {
    const session = driver.session({ database: neo4jconfig.database });
    try {
      const result = await session.run(
        `MATCH (user:User {userid: $userid}), (content:Content {contentid: $contentid})
         CREATE (user)-[:SAVED]->(content)
         RETURN content`,
        { userid, contentid }
      );
      return result.records.map(record => record.get('content').properties);
    } catch (error) {
      throw error;
    } finally {
      session.close();
    }
  }
  
  async userPutComment(userid, postid, content) {
    const session = driver.session({ database: neo4jconfig.database });
    try {
      const result = await session.run(
        `MATCH (user:User {userid: $userid}), (post:Content {contentid: $postid, entity_type: 'Post'})
         CREATE (comment:Content {content: $content, contentid: apoc.create.uuid(), userid: $userid, entity_type: 'Comment', created_at: timestamp()})-[:REPLIED]->(post)
         RETURN comment`,
        { userid, postid, content }
      );
      return result.records.map(record => record.get('comment').properties);
    } catch (error) {
      throw error;
    } finally {
      session.close();
    }
  }
  

}

export default NewsFeed;
