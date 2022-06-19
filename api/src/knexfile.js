const { knexSnakeCaseMappers } = require("objection");
const config = require("./src/config/config");

const afterCreate = (conn, done) => {
  conn.query('SET time_zone="UTC";', (err) => {
    if (err) {
      done(err, conn);
    } else {
      done();
    }
  });
};

module.exports = {
  development: {
    client: "mysql2",
    connection: config.objection.url,
    ...knexSnakeCaseMappers(),
    pool: {
      afterCreate,
    },
  },

  test: {
    client: "mysql2",
    connection: config.objection.url,
    ...knexSnakeCaseMappers(),
    pool: {
      afterCreate,
    },
  },

  production: {
    client: "mysql2",
    connection: config.objection.url,
    ...knexSnakeCaseMappers(),
    pool: {
      afterCreate,
    },
  },
};
