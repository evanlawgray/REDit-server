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

      const newData = weeks.rows.reduce((acc, object, i) => {
        let isDuplicateWeek = acc.filter((obj) => {
         return obj.week === object.weektitle;
        });

        if(!acc.length || !isDuplicateWeek.length) {
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
    const mockdata = fs.readFileSync( path.resolve( __dirname, './../../mockdata.json' ), 'utf-8' );
    const posts = JSON.parse( mockdata ).posts;

    if( posts.length ) {
      res.status(200).send( posts );
    }
    else {
      res.status(404).send();
    }
  })

  router.post( '/posts/:post_id/votes', ( req, res ) => {
    console.log(req.body);
  })

  router.post( '/posts/', ( req, res ) => {

  })

  return router;
}
