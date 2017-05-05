const path = require('path');

const bodyParser = require('body-parser');

const pool = require('../index');

module.exports = function(router) {

  router.use(bodyParser.json());

  router.get( '/weeks', ( req, res ) => {
    pool.query(`SELECT lessons.title AS lessontitle, lessons.id as lessonid, weeks.title AS weektitle FROM weeks
                          INNER JOIN lessons
                              ON weeks.id = lessons.week_id`, (err, weeks) => {

      if(err) return res.status(500).send();

      const newData = weeks.rows.reduce(( acc, object, i ) => {
        let isDuplicateWeek = acc.filter((obj) => {
         return obj.week === object.weektitle;
        });

        if( !acc.length || !isDuplicateWeek.length ) {
          acc.push({week: object.weektitle, lessons: [{id: object.lessonid, title: object.lessontitle}]});
          return acc;
        }

        acc.forEach((accItem, i) => {
          if(accItem.week === object.weektitle) {
            acc[i].lessons.push({id: object.lessonid, title: object.lessontitle});
          }
        });

        return acc;
      }, []);

      return res.status(200).json(newData);
    });
  });

  router.get( '/lessons/:lesson_id/posts', ( req, res ) => {
    let lessonId = req.params.lesson_id;

    pool.query(
      `SELECT * FROM posts
          INNER JOIN posttags
              ON posts.id = post_id
          WHERE lesson_id = ${lessonId};`, ( err, posts ) => {

        if(err) return res.status(500).send();

        pool.query(`SELECT * FROM tags`, ( err, tags ) => {

          if(err) return res.status(500).send();

          const newPosts = posts.rows.reduce(( acc, post ) => {

            let duplicatePosts = acc.filter((item) => {
              return item.post_id === post.post_id;
            });

            if(!acc.length || !duplicatePosts.length) {
              post.tag_ids = [post.tag_id];
              post.tags = [];
              acc.push(post);
            }

            if(duplicatePosts.length) {
              acc.forEach(( accPost ) => {
                if(accPost.post_id === post.post_id) {
                  accPost.tag_ids.push(post.tag_id)
                }
              });
            }

            return acc;
          }, [] );

          tags.rows.forEach(( tag ) => {
            newPosts.forEach(( post ) => {
              post.tag_ids.forEach(( tagId ) => {
                if(tag.id === tagId ) post.tags.push(tag.tag);
              });
            });
          });

          res.status(200).json(newPosts);
        });
    });
  });


                    // INNER JOIN tags
                    //     ON posttags.tag_id = tags.id
                    //     WHERE lesson_id = ${lessonId};`, (err, posts) => {
      // if(err) return res.status(500).send();

      // const newPosts = posts.rows.reduce((acc, post) => {

      //   let isDuplicate = acc.filter((item) => {
      //     return item.post_id === post.post_id;
      //   });

      //   if(!acc.length || !isDuplicate.length) {
      //     acc.push(post);
      //   }

      //   acc.forEach((obj, i) => {
      //     if(obj.post_id === post.post_id) {
      //       console.log(acc[i].tag);
      //       acc[i].tag = [acc[i].tag, post.tag];
      //     }
      //   })

      //   return acc;
      // }, []);

  router.post( '/posts/:post_id/votes', ( req, res ) => {

  });

  router.post( '/posts/', ( req, res ) => {

  });

  return router;
}
