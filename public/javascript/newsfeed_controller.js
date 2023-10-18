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

  async userGetAllContent(req, res) {
    const userid = req.params.userid;
    try {
      const content = await this.newsFeedModel.userGetAllContent(userid);
      return res.json(content);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async userPutPost(req, res) {
    try {
      const userid = req.params.userid; 
      const { content, feedid } = req.body; 
      console.log(userid, feedid, content)
      const post = await this.newsFeedModel.userPutPost(userid, content, feedid);
      return res.json(post);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async userPutComment(req, res) {
    try {
      const userid = req.params.userid; 
      const { content, postid } = req.body;
      const comment = await this.newsFeedModel.userPutComment(userid, postid, content);
      return res.json(comment);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async userLikedPostComment(req, res) {
    try {
      const userid = req.params.userid; 
      const contentid = req.body; 
      const likedContent = await this.newsFeedModel.userLikedPostComment(userid, contentid);
      return res.json(likedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async userSavedPostComment(req, res) {
    try {
      const userid = req.params.userid; 
      const contentid = req.body; 
      const savedContent = await this.newsFeedModel.userSavedPostComment(userid, contentid);
      return res.json(savedContent);
    } catch (err) {
      return res.status(500).send(err);
    }
  }

}

export default NewsFeedController;
