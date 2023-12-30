import NewsFeed from './newsfeed_model.js';

class NewsFeedController {
  constructor() {
    this.newsFeedModel = new NewsFeed();
  }

  async getAllNodes(req, res) {
    try {
      const nodes = await this.newsFeedModel.getAllNodes();
      return res.json(nodes);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getAllItems_sharedfeed(req, res) {
    try {
      const shared_feedid = req.query.shared_feedid;
      const content = await this.newsFeedModel.getAllItems_sharedfeed(shared_feedid);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getAllItems_privatefeed(req, res) {
    try {
      const private_feedid = req.query.private_feedid;
      const content = await this.newsFeedModel.getAllItems_privatefeed(private_feedid);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getAllItems(req, res) {
    try {
      const item_ids = req.query.item_id.split(',');;
      const content = await this.newsFeedModel.getAllItems(item_ids);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  

  async postFeedItem(req, res) {

    try {
      const { private_feedid, shared_feedid, parent_id, user_id, type, content } = req.body;
      const post = await this.newsFeedModel.postFeedItem(type, content, parent_id, user_id, shared_feedid, private_feedid);
      console.log(post)
      return res.json(post);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async deleteFeedItem(req, res) {

    try {
      const {shared_feedid} = req.body;
      const post = await this.newsFeedModel.deleteFeedItem(shared_feedid);
      console.log(post)
      return res.json(post);
    } catch (err) {
      return res.status(500).send(err);
    }

  }

  async deleteSinglefeedItem(req, res) {

    try {
      const {item_id} = req.body;
      const post = await this.newsFeedModel.deleteSinglefeedItem(item_id);
      console.log(post)
      return res.json(post);
    } catch (err) {
      return res.status(500).send(err);
    }

  }

  async getLikedItem(req, res) {
    try {
      const user_id = req.query.user_id;
      const item_id = req.query.item_id;
      const content = await this.newsFeedModel.getLikedItem(user_id,item_id);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }


  async postLikedItem(req, res) {
    try {
      const { user_id, item_id } = req.body; 
      const comment = await this.newsFeedModel.postLikedItem(user_id, item_id);
      return res.json(comment);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async deleteLikedItem(req, res) {
    try {
      const { user_id, item_id } = req.body; 
      const comment = await this.newsFeedModel.deleteLikedItem(user_id, item_id);
      return res.json(comment);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getSavedItem(req, res) {
    try {
      const user_id = req.query.user_id;
      const item_id = req.query.item_id;
      const content = await this.newsFeedModel.getSavedItem(user_id,item_id);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getAllSavedItem(req, res) {
    try {
      const user_id = req.query.user_id;
      const content = await this.newsFeedModel.getAllSavedItem(user_id);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }


  async postSavedItem(req, res) {
    try {
      const { user_id, item_id } = req.body; 
      const savedContent = await this.newsFeedModel.postSavedItem(user_id, item_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  
  async deleteSavedItem(req, res) {
    try {
      const { user_id, item_id } = req.body; 
      const comment = await this.newsFeedModel.deleteSavedItem(user_id, item_id);
      return res.json(comment);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getUserFeedId(req, res) {
    try {
      const { user_id} = req.query; 
      const savedContent = await this.newsFeedModel.getUserFeedId(user_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putUserFeedId(req, res) {
    try {
      const { user_id, buddy_id } = req.body; 
      const savedContent = await this.newsFeedModel.putUserFeedId(user_id, buddy_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async deleteUserFeedId(req, res) {
    try {
      const { user_id, buddy_id } = req.body; 
      const savedContent = await this.newsFeedModel.deleteUserFeedId(user_id, buddy_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putSharedFeedId(req, res) {
    try {
      const { user_id} = req.body; 
      const savedContent = await this.newsFeedModel.putSharedFeedId(user_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getSharedFeedId(req, res) {
    try {
      const {user_id} = req.query; 
      const savedContent = await this.newsFeedModel.getSharedFeedId(user_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }



  // async PostUserFeed(userId) {
  //   try {
  //     const savedContent = await this.newsFeedModel.PostUserFeed(userId);
  //     return res.json(savedContent);
  //   } catch (err) {
  //     return res.status(500).send(err);
  //   }
  // }

  async getOnboardingInfo(req, res) {
    try {
      const { user_id} = req.body; 
      const savedContent = await this.newsFeedModel.getOnboardingInfo(user_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }




  async postBuddyRequestResponse(req, res) {
    try {
      const { recipient_id,requestor_id} = req.body; 
      const savedContent = await this.newsFeedModel.postBuddyRequestResponse(recipient_id,requestor_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getBuddyRequestResponse(req, res) {
    try {
      const {recipient_id} = req.query; 
      const savedContent = await this.newsFeedModel.getBuddyRequestResponse(recipient_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putBuddyRequestResponse(req, res) {
    try {
      const { recipient_id,requestor_id,status} = req.body; 
      const savedContent = await this.newsFeedModel.putBuddyRequestResponse(recipient_id,requestor_id,status);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async deleteBuddyRequestResponse(req, res) {
    try {
      const { recipient_id,requestor_id} = req.body; 
      const savedContent = await this.newsFeedModel.deleteBuddyRequestResponse(recipient_id,requestor_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getFirstName(req, res) {
    try {
      const {user_id} = req.query; 
      const savedContent = await this.newsFeedModel.getFirstName(user_id);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putFirstName(req, res) {
    try {
      const { user_id,firstname} = req.body; 
      const savedContent = await this.newsFeedModel.putFirstName(user_id,firstname);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putLastName(req, res) {
    try {
      const { user_id, lastname} = req.body; 
      const savedContent = await this.newsFeedModel.putLastName(user_id,lastname);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putCountry(req, res) {
    try {
      const { user_id, country} = req.body; 
      const savedContent = await this.newsFeedModel.putCountry(user_id,country);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putTimeZone(req, res) {
    try {
      const { user_id,timezone} = req.body; 
      const savedContent = await this.newsFeedModel.putTimeZone(user_id,timezone);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putContentType(req, res) {
    try {
      const { user_id, contenttype} = req.body; 
      const savedContent = await this.newsFeedModel.putContentType(user_id,contenttype);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async getScreenPreference(req, res) {
    try {
      const {user_id,screenpreference} = req.query; 
      const savedContent = await this.newsFeedModel.getScreenPreference(user_id,screenpreference);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async putScreenPreference(req, res) {
    try {
      const { user_id, screenpreference} = req.body; 
      const savedContent = await this.newsFeedModel.putScreenPreference(user_id,screenpreference);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }



}

export default NewsFeedController;
