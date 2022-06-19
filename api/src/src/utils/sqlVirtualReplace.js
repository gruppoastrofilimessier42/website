/* eslint-disable security/detect-non-literal-regexp */
const balanced = require("balanced-match");

const openParenthesis = "(";
const closeParenthesis = ")";

const sqlVirtualReplace = (sql, Model) => {
  const { tableName, modifierVirtualAttributes: virtualNames } = Model;

  if (!virtualNames?.length || !sql.includes(`) as \`${tableName}\``)) {
    return sql;
  }

  const mappings = [];
  const virtualMappings = {};
  let currentSql = sql;
  let match = null;
  do {
    match = balanced(openParenthesis, closeParenthesis, currentSql);
    if (match) {
      currentSql = `${match.pre}@@${mappings.length}${match.post}`;
      mappings.push(match.body);
    }
  } while (match);

  virtualNames.forEach((virtualName) => {
    const re = new RegExp(`(?<expression>[^\\s,][^,]*) as \`${virtualName}\``, "i");
    const virtualMatch = currentSql.match(re);
    if (virtualMatch) {
      virtualMappings[virtualName] = virtualMatch.groups.expression;
      currentSql = currentSql.replace(re, () => {
        return `\`${tableName}\`.\`${virtualName}\``;
      });
      // this is a fix for duplicate name error when all fields are selected
      currentSql = currentSql.replace(
        new RegExp(`(?<cpt>\`${tableName}\`\\.\\s*\\*,\\s*\`${tableName}\`\\.\\s*\`${virtualName}\`)`, "i"),
        `\`${tableName}\`.*`
      );
    }
  });

  const subTableRe = new RegExp(`@@(?<idx>\\d+)\\s+as\\s+\`${tableName}\``, "i");
  const subTableMatch = currentSql.match(subTableRe);

  if (subTableMatch) {
    let subTable = mappings[subTableMatch.groups.idx];
    virtualNames.forEach((virtualName) => {
      const virtualExpression = virtualMappings[virtualName];
      subTable = subTable.replace("select", `select ${virtualExpression} as \`${virtualName}\`,`);
    });
    mappings[subTableMatch.groups.idx] = subTable;
  }

  mappings.forEach((m, idx) => {
    for (let i = 0; i >= 0 && i < idx; i += 1) {
      mappings[idx] = mappings[idx].replace(new RegExp(`@@${i}\\b`, "g"), `(${mappings[i]})`);
    }
  });

  mappings.forEach((m, idx) => {
    currentSql = currentSql.replace(new RegExp(`@@${idx}\\b`, "g"), `(${m})`);
  });

  return currentSql;
};

const sqlExtractSelectFromWhere = (sql) => {
  const mappings = [];
  let currentSql = sql;
  let match = null;
  do {
    match = balanced(openParenthesis, closeParenthesis, currentSql);
    if (match) {
      currentSql = `${match.pre}@@${mappings.length}${match.post}`;
      mappings.push(match.body);
    }
  } while (match);

  match = currentSql.match(
    new RegExp(
      `^\\s*select\\s+(?<selectFields>.+?)\\s+from\\s+(?<from>.+?)(\\s+where\\s+(?<where>.+))?\\s*;?\\s*$`,
      "is"
    )
  );

  const rebuildSql = (part) =>
    mappings.reduce((final, mapping, idx) => final.replace(`@@${idx}`, `(${mapping})`), part);

  if (match) {
    const selectFields = rebuildSql(match.groups.selectFields);
    const from = rebuildSql(match.groups.from);
    const where = match.groups.where ? rebuildSql(match.groups.where) : undefined;
    return {
      groups: {
        selectFields,
        from,
        where,
      },
    };
  }
  return null;
};

module.exports = { sqlVirtualReplace, sqlExtractSelectFromWhere };
