// import { driver, neo4jconfig } from './database/neo4j_database.js';
import db from './postgres_database.js';


class NewsFeed {

  async getAllNodes() {
    try {
      const result = await db.any('SELECT * FROM auth.newsfeed LIMIT 10');
      return result;
    } catch (error) {
      console.error('Error in getAllNodes:', error);
      throw error;
    }
  }

  async getOnboardingInfo() {
    try {
      const result = await db.any('select * from auth.user_profile where id = $1',[user_id]);
      return result;
    } catch (error) {
      console.error('Error in getAllNodes:', error);
      throw error;
    }
  }



  async getAllItems_sharedfeed(shared_feedid) {
    try {
      const result = await db.any(
        `
        WITH RECURSIVE hierarchical_newsfeed AS (
          -- Base case: get all posts for a private feed
          SELECT 
              item_id,
              type,
              content,
              parent_id,
              created_at,
              user_id,
              shared_feedid,
              private_feedid,
              1 AS depth,
              ROW_NUMBER() OVER (ORDER BY created_at DESC) as group_id -- Assign an integer group ID to each post
          FROM 
              auth.newsfeed_items 
          WHERE 
              shared_feedid = $1 AND parent_id IS NULL
      
          UNION ALL
      
          -- Recursive case: get comments for a private feed
          SELECT 
              ni.item_id,
              ni.type,
              ni.content,
              ni.parent_id,
              ni.created_at,
              ni.user_id,
              ni.shared_feedid,
              ni.private_feedid,
              hn.depth + 1,
              hn.group_id -- Use the same group ID as the parent post
          FROM 
              auth.newsfeed_items ni
          JOIN 
              hierarchical_newsfeed hn ON ni.parent_id = hn.item_id
      )
      
      SELECT *
      FROM hierarchical_newsfeed
      ORDER BY
          group_id asc, -- Group by the new group_id
        depth asc,
          created_at desc;
        `,
        [shared_feedid]
      );
      return result;
    } catch (error) {
      console.error('Error in userGetAllContent_sharedfeed:', error);
      throw error;
    }
  }

  async getAllItems_privatefeed(private_feedid) {
    try {
      const result = await db.any(
        `
        WITH RECURSIVE hierarchical_newsfeed AS (
          -- Base case: get all posts for a private feed
          SELECT 
              item_id,
              type,
              content,
              parent_id,
              created_at,
              user_id,
              shared_feedid,
              private_feedid,
              1 AS depth,
              ROW_NUMBER() OVER (ORDER BY created_at DESC) as group_id -- Assign an integer group ID to each post
          FROM 
              auth.newsfeed_items 
          WHERE 
              private_feedid = $1 AND parent_id IS NULL
      
          UNION ALL
      
          -- Recursive case: get comments for a private feed
          SELECT 
              ni.item_id,
              ni.type,
              ni.content,
              ni.parent_id,
              ni.created_at,
              ni.user_id,
              ni.shared_feedid,
              ni.private_feedid,
              hn.depth + 1,
              hn.group_id -- Use the same group ID as the parent post
          FROM 
              auth.newsfeed_items ni
          JOIN 
              hierarchical_newsfeed hn ON ni.parent_id = hn.item_id
      )
      
      SELECT *
      FROM hierarchical_newsfeed
      ORDER BY
          group_id asc, -- Group by the new group_id
        depth asc,
          created_at desc;
        `,
        [private_feedid]
      );
      return result;
    } catch (error) {
      console.error('Error in getAllItems_privatefeed:', error);
      throw error;
    }
  }

  async getAllItems(item_ids) {
    try {
      const result = await db.any(
        `WITH cte AS (
          SELECT item_id, content
          FROM auth.newsfeed_items
          WHERE item_id IN (
            $1:csv
          )
      )
      SELECT a.item_id, a.created_at, b.content
      FROM auth.newsfeed_saveditem a
      LEFT JOIN cte b ON a.item_id = b.item_id
      ORDER BY a.created_at;
        `,
        [item_ids]
      );
      return result;
    } catch (error) {
      console.error("Error liking data:", error);
      throw error;
    } 
  }

  async postFeedItem(type, content, parent_id, user_id, shared_feedid, private_feedid) {
    try {
      // Use db.oneOrNone if you are expecting to insert a single row.
      const result = await db.oneOrNone(
        `INSERT INTO auth.newsfeed_items (type, content, parent_id, user_id, shared_feedid, private_feedid)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, // This will return the inserted row.
        [type, content, parent_id, user_id, shared_feedid, private_feedid]
      );
      return result; // Directly return the inserted row.
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error; // Rethrow the error to be handled by the caller.
    }
    // No need for a finally block to close the session with pg-promise.
  }

  async deleteFeedItem(shared_feedid) {
    try {
      // Use db.oneOrNone if you are expecting to insert a single row.
      const result = await db.manyOrNone(
        `DELETE FROM auth.newsfeed_items
        WHERE shared_feedid = $1
        RETURNING *;`, // This will return the inserted row.
        [shared_feedid]
      );
      return result; // Directly return the inserted row.
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error; // Rethrow the error to be handled by the caller.
    }
    // No need for a finally block to close the session with pg-promise.
  }

  async deleteSinglefeedItem(item_id) {
    try {
      // Use db.oneOrNone if you are expecting to insert a single row.
      const result = await db.oneOrNone(
        `DELETE FROM auth.newsfeed_items
        WHERE item_id = $1
        RETURNING *;`, // This will return the inserted row.
        [item_id]
      );
      return result; // Directly return the inserted row.
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error; // Rethrow the error to be handled by the caller.
    }
    // No need for a finally block to close the session with pg-promise.
  }

  async getLikedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `select * from auth.newsfeed_likes 
        where user_id = $1 and item_id = $2`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error liking data:", error);
      throw error;
    } 
  }
  
  async postLikedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `INSERT INTO auth.newsfeed_likes (user_id, item_id)
        values ($1, $2)
        RETURNING *`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error liking data:", error);
      throw error;
    } 
  }

  async deleteLikedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `DELETE FROM auth.newsfeed_likes
        where user_id = $1 and item_id = $2
        RETURNING *`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error liking data:", error);
      throw error;
    } 
  }

  async getSavedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `select * from auth.newsfeed_saveditem where 
        user_id = $1 and item_id = $2`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error checking saved item data", error);
      throw error;
    } 
  }

  async getAllSavedItem(user_id) {
    try {
      const result = await db.any(
        `select * from auth.newsfeed_saveditem 
        where user_id = $1
        order by created_at DESC;`,
        [user_id]
      );
      return result;
    } catch (error) {
      console.error("Error getting all saved item data:", error);
      throw error;
    } 
  }
  
  async postSavedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `INSERT INTO auth.newsfeed_saveditem (user_id, item_id)
        values ($1, $2)
        RETURNING *`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

  async deleteSavedItem(user_id, item_id) {
    try {
      const result = await db.oneOrNone(
        `DELETE FROM auth.newsfeed_saveditem
        where user_id = $1 and item_id = $2
        RETURNING *`,
        [user_id, item_id]
      );
      return result;
    } catch (error) {
      console.error("Error liking data:", error);
      throw error;
    } 
  }


  async getUserFeedId(user_id) {
    try {
      const result = await db.any(
        `SELECT private_feedid,shared_feedid,buddy_id
        FROM auth.newsfeeds
        WHERE user_id = $1`,
        [user_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }
  //the requestor will get their shared_feedid updated to the recipient
  async putUserFeedId(user_id, buddy_id) {
    try {
      const result = await db.manyOrNone(
        `UPDATE auth.newsfeeds
        SET shared_feedid = (select shared_feedid
                              from auth.newsfeeds 
                              where user_id = $2
                              ),
        buddy_id = $2
        WHERE user_id = $1
        RETURNING *;

        UPDATE auth.newsfeeds
        SET buddy_id = $1
        WHERE user_id = $2
        RETURNING *;`,
        [user_id, buddy_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

  //buddy_id is -1 by default, hence delete is a update
  async deleteUserFeedId(user_id, buddy_id) {
    try {
      const result = await db.manyOrNone(
        `UPDATE auth.newsfeeds
        set buddy_id = -1
        WHERE user_id in ($1, $2)
        RETURNING *;`,
        [user_id, buddy_id]
      );
      return result;
    } catch (error) {
      console.error("Error updating buddy_id:", error);
      throw error;
    } 
  }

  async putSharedFeedId(user_id) {
    try {
      const result = await db.oneOrNone(
        `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        UPDATE auth.newsfeeds
        SET shared_feedid = uuid_generate_v4()
        WHERE user_id = $1    
        RETURNING *;`,
        [user_id]
      );
      return result;
    } catch (error) {
      console.error("Error putting new sharedfeedid data:", error);
      throw error;
    } 
  }

  async getSharedFeedId(user_id) {
    try {
      const result = await db.any(
        `SELECT shared_feedid
        FROM auth.newsfeeds
        WHERE user_id = $1    
        ;`,
        [user_id]
      );
      return result;
    } catch (error) {
      console.error("Error getting sharedfeedid data:", error);
      throw error;
    } 
  }

  // async PostUserFeed() {
  //   try {
  //     const result = await db.oneOrNone(
  //       `INSERT INTO auth.newsfeeds (user_id)
  //        VALUES ($1)
  //        RETURNING *`, // This will return the inserted row.
  //       [user_id]
  //     );
  //     return result;
  //   } catch (error) {
  //     console.error('Error in getAllNodes:', error);
  //     throw error;
  //   }
  // }

  async postBuddyRequestResponse(recipient_id,requestor_id) {
    try {
      const result = await db.oneOrNone(
        `INSERT INTO auth.buddy_requests (requestor_id, recipient_id, status)
        VALUES ($2, $1, 'pending')
        RETURNING *;`,
        [recipient_id,requestor_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

  async getBuddyRequestResponse(recipient_id) {
    try {
      const result = await db.any(
        `SELECT DISTINCT recipient_id, requestor_id,status
        FROM auth.buddy_requests
        WHERE recipient_id = $1 and status = 'pending';
        `,
        [recipient_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

  async putBuddyRequestResponse(recipient_id,requestor_id, status) {
    try {
      const result = await db.oneOrNone(
        `UPDATE auth.buddy_requests
        SET status = $3
        WHERE request_id = (
            SELECT request_id
            FROM auth.buddy_requests
            WHERE recipient_id = $1 AND requestor_id = $2
            ORDER BY timestamp DESC
            LIMIT 1
        )
        RETURNING *;`,
        [recipient_id,requestor_id,status]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

  async deleteBuddyRequestResponse(recipient_id,requestor_id) {
    try {
      const result = await db.manyOrNone(
        `DELETE FROM auth.buddy_requests
        WHERE ((requestor_id = $2 and recipient_id = $1) or 
                (requestor_id = $1 and recipient_id = $2) ) 
                and status = 'accepted'
        RETURNING *;
        `,
        [recipient_id,requestor_id]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } 
  }

async getFirstName(user_id) {
  try {
    const result = await db.oneOrNone(
      `select first_name
      from auth.user_profile
      WHERE id = $1
      ;`,
      [user_id]
    );
    return result;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
    } 
  }

async putFirstName(user_id,firstname) {
  try {
    const result = await db.oneOrNone(
      `UPDATE auth.user_profile
      SET first_name = $2
      WHERE id = $1
      RETURNING *;`,
      [user_id,firstname]
    );
    return result;
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
    } 
  }

  async putLastName(user_id,lastname) {
    try {
      const result = await db.oneOrNone(
        `UPDATE auth.user_profile
        SET last_name = $2
        WHERE id = $1
        RETURNING *;`,
        [user_id,lastname]
      );
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
      } 
    }

    async putCountry(user_id,country) {
      try {
        const result = await db.oneOrNone(
          `UPDATE auth.user_profile
          SET country = $2
          WHERE id = $1
          RETURNING *;`,
          [user_id,country]
        );
        return result;
      } catch (error) {
        console.error("Error saving data:", error);
        throw error;
        } 
      }

    async putTimeZone(user_id,timezone) {
      try {
        const result = await db.oneOrNone(
          `UPDATE auth.user_profile
          SET gmt_offset = $2
          WHERE id = $1
          RETURNING *;`,
          [user_id,timezone]
        );
        return result;
      } catch (error) {
        console.error("Error saving data:", error);
        throw error;
        } 
      }

      async putContentType(user_id,ContentType) {
        try {
          const result = await db.oneOrNone(
            `UPDATE auth.user_profile
            SET content_type = $2
            WHERE id = $1
            RETURNING *;`,
            [user_id,ContentType]
          );
          return result;
        } catch (error) {
          console.error("Error saving data:", error);
          throw error;
          } 
        }

      
      async getScreenPreference(user_id) {
        try {
          const result = await db.oneOrNone(
            `select screen_preference
            from auth.user_profile
            WHERE id = $1
            ;`,
            [user_id]
          );
          return result;
        } catch (error) {
          console.error("Error saving data:", error);
          throw error;
          } 
        }
        
      async putScreenPreference(user_id,screenpreference) {
        try {
          const result = await db.oneOrNone(
            `UPDATE auth.user_profile
            SET screen_preference = $2
            WHERE id = $1
            RETURNING *;`,
            [user_id,screenpreference]
          );
          return result;
        } catch (error) {
          console.error("Error saving data:", error);
          throw error;
          } 
        }

}

export default NewsFeed;
