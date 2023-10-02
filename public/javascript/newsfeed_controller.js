import NewsFeed from './newsfeed_model.js';

class NewsFeedController {
  constructor() {
    this.topicModel = new NewsFeed();
  }

  // show all topics
  getAllNodes(req, res) {
    this.topicModel.getAllNodes((err, Topic) => {
      if (err) {
        res.send(err);
      }
      res.json(Topic);
    });
  }

}

export default NewsFeedController;