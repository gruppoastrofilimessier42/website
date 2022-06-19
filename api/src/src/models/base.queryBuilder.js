const { QueryBuilder } = require("objection");

class BaseQueryBuilder extends QueryBuilder {
  // versione pensata per aggiungere subito la select allo stack delle operations, ma sembra un'azione inutile e pericolosa
  // addSelect(...attrs) {
  //     this.onBuild((qb) => {
  //       if (qb.isFind()) {
  //         const { addSelectCounter, selectAlreadyAdded } = qb.context();
  //         const areOnlyAddSelects = addSelectCounter === qb._operations.filter((op) => op.name === "select").length;
  //         if (!qb.hasSelects() || (areOnlyAddSelects && !selectAlreadyAdded)) {
  //           qb.select(`${qb.modelClass().tableName}.*`);
  //           qb.context({ selectAlreadyAdded: true });
  //         }
  //       }
  //     });
  //     const { addSelectCounter = 0 } = this.context();
  //     this.context({ addSelectCounter: addSelectCounter + 1 });
  //     return this.select(...attrs);
  //   }

  // Versione buona
  addSelect(...attrs) {
    this.onBuild((qb) => {
      if (qb.isFind()) {
        if (!qb.hasSelects()) {
          qb.select(`${qb.modelClass().tableName}.*`);
        }
        qb.select(...attrs);
      }
    });
    return this;
  }
}

module.exports = BaseQueryBuilder;
