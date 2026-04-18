// ─── SQL Keywords ──────────────────────────────────────────────────────
const KEYWORDS = new Set([
  // DML
  "SELECT","FROM","WHERE","AND","OR","NOT","IN","EXISTS",
  "BETWEEN","LIKE","ILIKE","SIMILAR","IS","NULL","TRUE","FALSE",
  "INSERT","INTO","VALUES","UPDATE","SET","DELETE","MERGE","USING","MATCHED",
  // DDL
  "CREATE","ALTER","DROP","TABLE","INDEX","VIEW","SCHEMA","DATABASE",
  "PROCEDURE","FUNCTION","TRIGGER","SEQUENCE",
  "COLUMN","ADD","MODIFY","RENAME","TRUNCATE",
  // JOIN
  "JOIN","INNER","LEFT","RIGHT","FULL","OUTER","CROSS","ON","NATURAL","APPLY",
  // Clauses
  "GROUP","BY","ORDER","HAVING","LIMIT","OFFSET","FETCH","NEXT","ONLY","PERCENT",
  "UNION","ALL","INTERSECT","EXCEPT",
  // Expressions
  "AS","DISTINCT","TOP","CASE","WHEN","THEN","ELSE","END",
  "ASC","DESC","NULLS","FIRST","LAST","WITH","RECURSIVE","RETURNING",
  // Aggregate / Window
  "COUNT","SUM","AVG","MIN","MAX","COALESCE","IFNULL","NULLIF",
  "OVER","PARTITION","ROWS","RANGE","UNBOUNDED","PRECEDING","FOLLOWING",
  "CURRENT","ROW","FILTER","WITHIN",
  // Functions (also in FUNCTIONS set)
  "CAST","CONVERT","TRIM","UPPER","LOWER","LENGTH","SUBSTR","SUBSTRING",
  "CONCAT","REPLACE","ROUND","FLOOR","CEIL","ABS","MOD",
  "ROW_NUMBER","RANK","DENSE_RANK","NTILE","LAG","LEAD",
  "FIRST_VALUE","LAST_VALUE",
  // Date/Time (only non-ambiguous ones — YEAR/MONTH/DAY etc. stay in FUNCTIONS only)
  "NOW","CURRENT_TIMESTAMP","CURRENT_DATE","CURRENT_TIME","INTERVAL",
  // Constraints
  "PRIMARY","KEY","FOREIGN","REFERENCES","CONSTRAINT",
  "DEFAULT","CHECK","UNIQUE","CASCADE","RESTRICT","NO","ACTION","DEFERRABLE",
  "INITIALLY","DEFERRED","IMMEDIATE",
  // Transaction
  "BEGIN","COMMIT","ROLLBACK","TRANSACTION","SAVEPOINT","RELEASE",
  // Privileges
  "GRANT","REVOKE","DENY","TO","USAGE","PRIVILEGES",
  // Procedural SQL
  "DECLARE","VARIABLE","CURSOR","OPEN","CLOSE","FETCH","DEALLOCATE",
  "IF","ELSIF","ELSEIF","LOOP","WHILE","FOR","EACH","EXIT","CONTINUE",
  "RETURN","RETURNS","LANGUAGE","VOLATILE","STABLE","IMMUTABLE","SECURITY",
  "DEFINER","INVOKER","CALLED","INPUT","STRICT",
  "RAISE","NOTICE","EXCEPTION","PERFORM","EXECUTE","EXEC",
  "PRINT","THROW","TRY","CATCH","RAISERROR",
  "CALL","SIGNAL","RESIGNAL","HANDLER","CONDITION","SQLSTATE",
  // MSSQL
  "GO","NOLOCK","IDENTITY","OUTPUT","INSERTED","DELETED","SCOPE_IDENTITY",
  "JSON","PATH","WITHOUT_ARRAY_WRAPPER","INCLUDE_NULL_VALUES",
  // Misc
  "TEMPORARY","TEMP","EXPLAIN","ANALYZE","VERBOSE","COSTS",
  "VACUUM","REINDEX","CLUSTER",
  "SHOW","DESCRIBE","USE","DELIMITER",
  "MATERIALIZED","LATERAL","TABLESAMPLE","UNNEST",
  "ON","CONFLICT","DO","NOTHING",
  "OWNED","DEPENDS","EXTENSION","TABLESPACE","STORAGE",
  "BEFORE","AFTER","INSTEAD","OF","REFERENCING","NEW","OLD",
  "ROW","STATEMENT","CONSTRAINT","ASSERTION",
]);

// Known SQL function names (not treated as clause keywords for newline purposes)
const FUNCTIONS = new Set([
  "COUNT","SUM","AVG","MIN","MAX","COALESCE","IFNULL","NULLIF",
  "CAST","CONVERT","TRIM","UPPER","LOWER","LENGTH","SUBSTR","SUBSTRING",
  "CONCAT","REPLACE","ROUND","FLOOR","CEIL","CEILING","ABS","MOD","POWER","SQRT",
  "DATE","YEAR","MONTH","DAY","HOUR","MINUTE","SECOND","EXTRACT",
  "NOW","CURRENT_TIMESTAMP","CURRENT_DATE","CURRENT_TIME",
  "ROW_NUMBER","RANK","DENSE_RANK","NTILE","LAG","LEAD",
  "FIRST_VALUE","LAST_VALUE","NTH_VALUE","PERCENT_RANK","CUME_DIST",
  "ISNULL","NVL","NVL2","DECODE","IIF","CHOOSE",
  "STRING_AGG","GROUP_CONCAT","ARRAY_AGG","JSON_AGG","XMLAGG",
  "DATEADD","DATEDIFF","DATEPART","DATENAME","FORMAT","GETDATE","SYSDATE","SYSDATETIME",
  "TO_CHAR","TO_DATE","TO_NUMBER","TO_TIMESTAMP",
  "CHARINDEX","PATINDEX","STUFF","REVERSE","LEFT","RIGHT","LTRIM","RTRIM",
  "LPAD","RPAD","INITCAP","TRANSLATE","REGEXP_REPLACE","REGEXP_MATCHES",
  "JSON_EXTRACT","JSON_VALUE","JSON_QUERY","JSON_OBJECT","JSON_ARRAY",
  "ARRAY_LENGTH","ARRAY_APPEND","UNNEST","GENERATE_SERIES",
  "SCOPE_IDENTITY","IDENT_CURRENT","NEWID","NEWSEQUENTIALID",
  "HASHBYTES","CHECKSUM","BINARY_CHECKSUM",
  "OBJECT_ID","OBJECT_NAME","DB_NAME","SCHEMA_NAME","TYPE_NAME",
  "RAISE","PERFORM","EXEC","EXECUTE","CALL",
]);

const MULTI_WORD_KEYWORDS = [
  // JOINs
  "FULL OUTER JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN",
  "LEFT JOIN","RIGHT JOIN","INNER JOIN","CROSS JOIN","NATURAL JOIN",
  "CROSS APPLY","OUTER APPLY",
  // Clauses
  "GROUP BY","ORDER BY","PARTITION BY","CLUSTER BY","DISTRIBUTE BY","SORT BY",
  "IS NOT NULL","IS NULL","NOT IN","NOT EXISTS","NOT BETWEEN","NOT LIKE","NOT ILIKE",
  "IS NOT DISTINCT FROM","IS DISTINCT FROM",
  "INSERT INTO","UNION ALL","EXCEPT ALL","INTERSECT ALL",
  // DDL multi-word
  "CREATE OR REPLACE","CREATE TABLE","CREATE VIEW","CREATE INDEX",
  "CREATE PROCEDURE","CREATE FUNCTION","CREATE TRIGGER","CREATE SEQUENCE",
  "CREATE SCHEMA","CREATE DATABASE","CREATE TYPE","CREATE EXTENSION",
  "CREATE MATERIALIZED VIEW","CREATE TEMPORARY TABLE","CREATE TEMP TABLE",
  "ALTER TABLE","ALTER VIEW","ALTER PROCEDURE","ALTER FUNCTION","ALTER COLUMN",
  "DROP TABLE","DROP VIEW","DROP PROCEDURE","DROP FUNCTION","DROP INDEX",
  // PostgreSQL
  "ON CONFLICT","DO NOTHING","DO UPDATE","RETURNS TABLE","RETURNS SETOF",
  "RETURNS VOID","LANGUAGE PLPGSQL","LANGUAGE SQL",
  "RAISE NOTICE","RAISE EXCEPTION","RAISE WARNING","RAISE INFO",
  // MSSQL
  "BEGIN TRY","END TRY","BEGIN CATCH","END CATCH",
  "WITH NOLOCK","OPTION RECOMPILE",
  "FOR JSON PATH","FOR JSON AUTO","FOR JSON RAW","FOR XML PATH","FOR XML RAW","FOR XML AUTO",
  // Procedural
  "END IF","END LOOP","END WHILE","END FOR",
  "ELSE IF","ELSEIF",
  "FOR EACH","FOR EACH ROW",
  // FETCH
  "FETCH NEXT","FETCH FIRST",
];

// ─── Token Types ───────────────────────────────────────────────────────
const T = {
  STRING:"STRING", QUOTED:"QUOTED", COMMENT:"COMMENT",
  KEYWORD:"KEYWORD", IDENT:"IDENT", NUMBER:"NUMBER",
  COMMA:"COMMA", LPAREN:"LPAREN", RPAREN:"RPAREN",
  SEMI:"SEMI", OP:"OP", DOT:"DOT", STAR:"STAR",
};

// Paren context types
const PC = {
  FUNCTION:"FUNCTION",   // COUNT(...), SUM(...)
  IN_LIST:"IN_LIST",     // IN (1, 2, 3)
  SUBQUERY:"SUBQUERY",   // IN (SELECT ...) or (SELECT ...)
  VALUES:"VALUES",       // VALUES (...)
  INSERT_COLS:"INSERT_COLS", // INSERT INTO t (col1, col2)
  EXPRESSION:"EXPRESSION",  // (a + b), general grouping
};

// ─── Tokenizer ─────────────────────────────────────────────────────────
function tokenize(sql) {
  const tokens = [];
  let i = 0;
  const len = sql.length;

  while (i < len) {
    if (/\s/.test(sql[i])) { i++; continue; }

    // Single-line comment
    if (sql[i] === "-" && sql[i+1] === "-") {
      let end = sql.indexOf("\n", i);
      if (end === -1) end = len;
      tokens.push({ type: T.COMMENT, value: sql.slice(i, end) });
      i = end; continue;
    }
    // Multi-line comment
    if (sql[i] === "/" && sql[i+1] === "*") {
      let end = sql.indexOf("*/", i+2);
      if (end === -1) end = len - 2;
      tokens.push({ type: T.COMMENT, value: sql.slice(i, end+2) });
      i = end + 2; continue;
    }
    // PostgreSQL dollar-quoted string: $$...$$ or $tag$...$tag$
    if (sql[i] === "$" && i+1 < len && (sql[i+1] === "$" || /[a-zA-Z_]/.test(sql[i+1]))) {
      let tagEnd = sql.indexOf("$", i+1);
      if (tagEnd !== -1) {
        const tag = sql.slice(i, tagEnd+1);
        const closeIdx = sql.indexOf(tag, tagEnd+1);
        if (closeIdx !== -1) {
          tokens.push({ type: T.STRING, value: sql.slice(i, closeIdx + tag.length) });
          i = closeIdx + tag.length; continue;
        }
      }
    }
    // Single-quoted string
    if (sql[i] === "'") {
      let j = i + 1;
      while (j < len) {
        if (sql[j] === "'" && sql[j+1] === "'") j += 2;
        else if (sql[j] === "'") break;
        else j++;
      }
      tokens.push({ type: T.STRING, value: sql.slice(i, j+1) });
      i = j + 1; continue;
    }
    // Double-quoted identifier
    if (sql[i] === '"') {
      let j = i + 1;
      while (j < len && sql[j] !== '"') j++;
      tokens.push({ type: T.QUOTED, value: sql.slice(i, j+1) });
      i = j + 1; continue;
    }
    // Backtick identifier (MySQL)
    if (sql[i] === "`") {
      let j = i + 1;
      while (j < len && sql[j] !== "`") j++;
      tokens.push({ type: T.QUOTED, value: sql.slice(i, j+1) });
      i = j + 1; continue;
    }
    // Bracket identifier (MSSQL): [schema].[table]
    if (sql[i] === "[") {
      let j = i + 1;
      while (j < len && sql[j] !== "]") j++;
      tokens.push({ type: T.QUOTED, value: sql.slice(i, j+1) });
      i = j + 1; continue;
    }
    // Number
    if (/\d/.test(sql[i]) || (sql[i] === "." && i+1 < len && /\d/.test(sql[i+1]))) {
      let j = i;
      while (j < len && /[\d.eE]/.test(sql[j])) j++;
      if (j < len && /[+-]/.test(sql[j]) && /[eE]/.test(sql[j-1])) j++;
      while (j < len && /\d/.test(sql[j])) j++;
      tokens.push({ type: T.NUMBER, value: sql.slice(i, j) });
      i = j; continue;
    }
    // Punctuation
    if (sql[i] === ",") { tokens.push({ type: T.COMMA, value: "," }); i++; continue; }
    if (sql[i] === "(") { tokens.push({ type: T.LPAREN, value: "(" }); i++; continue; }
    if (sql[i] === ")") { tokens.push({ type: T.RPAREN, value: ")" }); i++; continue; }
    if (sql[i] === ";") { tokens.push({ type: T.SEMI, value: ";" }); i++; continue; }
    if (sql[i] === ".") { tokens.push({ type: T.DOT, value: "." }); i++; continue; }
    if (sql[i] === "*") { tokens.push({ type: T.STAR, value: "*" }); i++; continue; }
    // PostgreSQL :: type cast
    if (sql[i] === ":" && sql[i+1] === ":") {
      tokens.push({ type: T.OP, value: "::" }); i += 2; continue;
    }
    // Multi-char operators
    if ("<>=!".includes(sql[i])) {
      let op = sql[i];
      if (i+1 < len && "=><".includes(sql[i+1])) { op += sql[i+1]; i += 2; }
      else i++;
      tokens.push({ type: T.OP, value: op }); continue;
    }
    // MSSQL += etc.
    if (sql[i] === "+" && sql[i+1] === "=") { tokens.push({ type: T.OP, value: "+=" }); i += 2; continue; }
    if ("+-/%&|^~".includes(sql[i])) {
      tokens.push({ type: T.OP, value: sql[i] }); i++; continue;
    }
    // Identifier / Keyword
    if (/[a-zA-Z_@#]/.test(sql[i])) {
      let j = i;
      while (j < len && /[a-zA-Z0-9_@#$]/.test(sql[j])) j++;
      const word = sql.slice(i, j);
      const upper = word.toUpperCase();
      tokens.push({ type: KEYWORDS.has(upper) ? T.KEYWORD : T.IDENT, value: word });
      i = j; continue;
    }
    tokens.push({ type: T.OP, value: sql[i] }); i++;
  }
  return tokens;
}

// ─── Merge Multi-Word Keywords ─────────────────────────────────────────
function mergeMultiWordKeywords(tokens) {
  const sorted = [...MULTI_WORD_KEYWORDS].sort((a, b) => b.split(" ").length - a.split(" ").length);
  const result = [];
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i].type === T.KEYWORD) {
      let merged = false;
      for (const mwk of sorted) {
        const parts = mwk.split(" ");
        if (i + parts.length <= tokens.length) {
          let match = true;
          for (let k = 0; k < parts.length; k++) {
            if (tokens[i+k].type !== T.KEYWORD || tokens[i+k].value.toUpperCase() !== parts[k]) {
              match = false; break;
            }
          }
          if (match) {
            result.push({
              type: T.KEYWORD,
              value: parts.map((_, k) => tokens[i+k].value).join(" "),
              merged: mwk,
            });
            i += parts.length; merged = true; break;
          }
        }
      }
      if (!merged) { result.push(tokens[i]); i++; }
    } else { result.push(tokens[i]); i++; }
  }
  return result;
}

// ─── Annotate Paren Contexts ───────────────────────────────────────────
// Walk tokens, match each ( with its ), and tag with context type
function annotateparenContexts(tokens) {
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === T.LPAREN) {
      // Determine context from preceding token
      let ctx = PC.EXPRESSION;
      const prev = findPrevNonComment(tokens, i);
      if (prev !== null) {
        const pt = tokens[prev];
        const pu = (pt.merged || pt.value).toUpperCase();
        if (pt.type === T.IDENT || (pt.type === T.KEYWORD && FUNCTIONS.has(pu))) {
          ctx = PC.FUNCTION;
        } else if (pt.type === T.KEYWORD && (pu === "IN" || pu === "NOT IN")) {
          ctx = PC.IN_LIST;
        } else if (pt.type === T.KEYWORD && pu === "VALUES") {
          ctx = PC.VALUES;
        } else if (pt.type === T.KEYWORD && (pu === "INSERT INTO" || pu === "INTO")) {
          // Check if the token before INTO had table name; this is INSERT cols
          ctx = PC.INSERT_COLS;
        }
      }
      // Check if first meaningful token after ( is SELECT → subquery
      const firstInner = findNextNonComment(tokens, i);
      if (firstInner !== null && tokens[firstInner].type === T.KEYWORD) {
        const fu = tokens[firstInner].value.toUpperCase();
        if (fu === "SELECT" || fu === "WITH") {
          ctx = PC.SUBQUERY;
        }
      }
      tokens[i].parenCtx = ctx;
      tokens[i].parenDepth = stack.length;
      stack.push({ idx: i, ctx });
    } else if (tokens[i].type === T.RPAREN) {
      const info = stack.pop();
      if (info) {
        tokens[i].parenCtx = info.ctx;
        tokens[i].parenDepth = stack.length;
        tokens[i].matchIdx = info.idx;
        tokens[info.idx].matchIdx = i;
      } else {
        tokens[i].parenCtx = PC.EXPRESSION;
        tokens[i].parenDepth = 0;
      }
    }
  }
}

function findPrevNonComment(tokens, idx) {
  for (let i = idx - 1; i >= 0; i--) {
    if (tokens[i].type !== T.COMMENT) return i;
  }
  return null;
}

function findNextNonComment(tokens, idx) {
  for (let i = idx + 1; i < tokens.length; i++) {
    if (tokens[i].type !== T.COMMENT) return i;
  }
  return null;
}

// ─── Normalize ─────────────────────────────────────────────────────────
function applyKeywordCase(token, keywordCase) {
  if (token.type !== T.KEYWORD) return;
  const val = token.merged || token.value;
  switch (keywordCase) {
    case "upper": token.value = val.toUpperCase(); break;
    case "lower": token.value = val.toLowerCase(); break;
    case "title":
      token.value = val.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      break;
  }
}

function normalizeAlias(tokens, aliasKeyword) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === T.KEYWORD && tokens[i].value.toUpperCase() === "AS") {
      if (aliasKeyword === "none") { tokens.splice(i, 1); i--; }
      else if (aliasKeyword === "AS") tokens[i].value = "AS";
      else if (aliasKeyword === "as") tokens[i].value = "as";
    }
  }
  return tokens;
}

// ─── Context Stack for Rebuild ─────────────────────────────────────────
// Tracks what "zone" we're in during rebuild
function createContextStack() {
  const stack = [{ type: "ROOT", inSelect: false }];
  return {
    push(ctx) { stack.push(ctx); },
    pop() { return stack.length > 1 ? stack.pop() : stack[0]; },
    current() { return stack[stack.length - 1]; },
    isInline() {
      const c = stack[stack.length - 1];
      return c.type === PC.FUNCTION || c.type === PC.IN_LIST ||
             c.type === PC.VALUES || c.type === PC.INSERT_COLS ||
             c.type === PC.EXPRESSION;
    },
    depth() { return stack.length - 1; },
  };
}

// ─── Rebuild ───────────────────────────────────────────────────────────
function rebuild(tokens, rules) {
  const indentUnit = rules.indentChar === "\t" ? "\t" : " ".repeat(rules.indentSize || 4);
  const newlineKws = new Set((rules.newlineBeforeKeywords || []).map(k => k.toUpperCase()));
  // Spacing helpers derived from rules
  const commaGap = " ".repeat(Math.max(1, rules.spaceAfterComma ?? 1));
  const spaceOps = rules.spaceAroundOperators !== false;
  const spaceFuncParen = rules.spaceAfterFunctionName === true;

  const lines = [];
  let cur = "";
  let baseIndent = 0;
  let inSelectClause = false;
  let inGroupOrderClause = false;
  let inJoinOnClause = false;
  let inBetween = false;
  let inProceduralBlock = false;
  let lastClauseKeyword = "";
  let selectColCount = 0;           // columns emitted in current SELECT row
  const columnsPerRow = Math.max(1, rules.columnsPerRow || 1);
  const ctx = createContextStack();
  const caseDepthStack = []; // Track CASE nesting separately from baseIndent

  function indent(level) { return indentUnit.repeat(level); }
  function flush() { if (cur.trim()) lines.push(cur); cur = ""; }
  function newLine(level) { flush(); cur = indent(level); }
  function blankLine() { if (rules.linesBetweenClauses === 1) { flush(); lines.push(""); } }
  function append(val) {
    if (!cur || !cur.trim()) cur = cur + val;
    else cur += " " + val;
  }
  function appendNoSpace(val) { cur += val; }

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const upper = tok.type === T.KEYWORD ? (tok.merged || tok.value).toUpperCase() : "";
    const isInline = ctx.isInline();

    // ── DOT — no spaces ──
    if (tok.type === T.DOT) {
      cur = cur.trimEnd() + ".";
      continue;
    }
    if (i > 0 && tokens[i-1].type === T.DOT) {
      appendNoSpace(tok.value);
      continue;
    }

    // ── COMMENT ──
    if (tok.type === T.COMMENT) {
      append(tok.value);
      if (tok.value.startsWith("--")) { flush(); cur = indent(baseIndent); }
      continue;
    }

    // ─── Inside inline context (function, IN list, VALUES, expression) ───
    if (isInline) {
      const curCtx = ctx.current();
      const isFuncCtx = curCtx.type === PC.FUNCTION;

      if (tok.type === T.RPAREN) {
        cur = cur.trimEnd();
        appendNoSpace(")");
        ctx.pop();
        continue;
      }
      if (tok.type === T.COMMA) {
        cur = cur.trimEnd();
        appendNoSpace("," + commaGap);
        continue;
      }
      if (tok.type === T.LPAREN) {
        const pCtx = tok.parenCtx || PC.EXPRESSION;
        if (pCtx === PC.SUBQUERY) {
          ctx.push({ type: PC.SUBQUERY, inSelect: false });
          baseIndent++;
          if (rules.openParenOnNewline) {
            newLine(baseIndent - 1);
            append("(");
          } else {
            append("(");
          }
          continue;
        }
        // Nested parens inside inline — attach tight, no space before (
        ctx.push({ type: pCtx, inSelect: false });
        cur = cur.trimEnd();
        appendNoSpace("(");
        continue;
      }
      // DOT handling inside inline
      if (tok.type === T.DOT) { cur = cur.trimEnd() + "."; continue; }
      if (i > 0 && tokens[i-1].type === T.DOT) { appendNoSpace(tok.value); continue; }
      // First token after ( — append without leading space
      if (i > 0 && tokens[i-1].type === T.LPAREN) {
        appendNoSpace(tok.value);
        continue;
      }
      // Token right after comma separator — already has trailing space, no extra
      if (i > 0 && tokens[i-1].type === T.COMMA) {
        appendNoSpace(tok.value);
        continue;
      }
      // Operator tokens inside inline — respect spaceAroundOperators
      if (tok.type === T.OP) {
        if (spaceOps) append(tok.value);
        else appendNoSpace(tok.value);
        continue;
      }
      // Everything else inside inline — append with space
      append(tok.value);
      continue;
    }

    // ─── KEYWORD handling (not inline) ──────────────────────────────────
    if (tok.type === T.KEYWORD) {
      // BETWEEN tracking
      if (upper === "BETWEEN") {
        inBetween = true;
        append(tok.value);
        continue;
      }
      // AND inside BETWEEN — keep inline, don't newline
      if (upper === "AND" && inBetween) {
        inBetween = false;
        append(tok.value);
        continue;
      }

      // CASE/WHEN/THEN/ELSE/END
      if (upper === "CASE") {
        append(tok.value);
        caseDepthStack.push(baseIndent);
        baseIndent++;
        continue;
      }
      if (upper === "WHEN") {
        newLine(baseIndent);
        append(tok.value);
        continue;
      }
      if (upper === "THEN") {
        append(tok.value);
        continue;
      }
      if (upper === "ELSE" && !upper.startsWith("ELSE IF")) {
        newLine(baseIndent);
        append(tok.value);
        continue;
      }
      if (upper === "END" || upper === "END IF" || upper === "END LOOP" ||
          upper === "END WHILE" || upper === "END FOR" ||
          upper === "END TRY" || upper === "END CATCH") {
        // For CASE..END, restore the saved indent level instead of blindly decrementing
        if (caseDepthStack.length > 0 && upper === "END") {
          // Check if this END closes a CASE (not a BEGIN block)
          // If we're not in a procedural block, or the caseDepthStack has entries, it's a CASE END
          baseIndent = caseDepthStack.pop();
        } else {
          baseIndent = Math.max(0, baseIndent - 1);
        }
        newLine(baseIndent);
        append(tok.value);
        if (upper !== "END") inProceduralBlock = false;
        continue;
      }

      // Procedural blocks: BEGIN increases indent
      if (upper === "BEGIN" || upper === "BEGIN TRY" || upper === "BEGIN CATCH") {
        newLine(baseIndent);
        append(tok.value);
        baseIndent++;
        inProceduralBlock = true;
        continue;
      }

      // DECLARE — newline keyword in procedural
      if (upper === "DECLARE") {
        newLine(baseIndent);
        append(tok.value);
        continue;
      }

      // RETURN — newline keyword in procedural
      if (upper === "RETURN" || upper === "RETURNS") {
        newLine(baseIndent);
        append(tok.value);
        continue;
      }

      // IF / ELSIF / ELSEIF / ELSE IF — procedural control flow
      if (upper === "IF" || upper === "ELSIF" || upper === "ELSEIF" || upper === "ELSE IF") {
        newLine(baseIndent);
        append(tok.value);
        baseIndent++;
        continue;
      }

      // LOOP / WHILE / FOR — procedural loops
      if (upper === "LOOP" || upper === "WHILE" || upper === "FOR") {
        newLine(baseIndent);
        append(tok.value);
        baseIndent++;
        continue;
      }

      // RAISE NOTICE/EXCEPTION — PostgreSQL
      if (upper === "RAISE NOTICE" || upper === "RAISE EXCEPTION" ||
          upper === "RAISE WARNING" || upper === "RAISE INFO") {
        newLine(baseIndent);
        append(tok.value);
        continue;
      }

      // CREATE OR REPLACE / CREATE PROCEDURE / CREATE FUNCTION / CREATE VIEW etc.
      if (upper.startsWith("CREATE") || upper.startsWith("ALTER") || upper.startsWith("DROP")) {
        newLine(baseIndent);
        append(tok.value);
        inSelectClause = false;
        inGroupOrderClause = false;
        inJoinOnClause = false;
        continue;
      }

      // Check newline-before-keywords (or always-newline major clause keywords)
      const ALWAYS_NEWLINE = new Set(["HAVING","SELECT","FROM","WHERE","WITH",
        "JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","CROSS JOIN",
        "FULL OUTER JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN","NATURAL JOIN",
        "CROSS APPLY","OUTER APPLY",
        "GROUP BY","ORDER BY","LIMIT","OFFSET",
        "UNION","UNION ALL","INTERSECT","EXCEPT",
        "SET","VALUES","INSERT INTO","UPDATE","DELETE",
        "ON CONFLICT","RETURNING",
        "FOR JSON PATH","FOR JSON AUTO","FOR JSON RAW","FOR XML PATH","FOR XML RAW","FOR XML AUTO"]);
      const alwaysNewline = ALWAYS_NEWLINE.has(upper);
      if (newlineKws.has(upper) || alwaysNewline) {
        // Smart blank line: only between major clause GROUP transitions, not same-type consecutive keywords
        const joinTypes = ["JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN",
          "FULL OUTER JOIN","CROSS JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN",
          "NATURAL JOIN","CROSS APPLY","OUTER APPLY"];
        const forJsonXmlTypes = ["FOR JSON PATH","FOR JSON AUTO","FOR JSON RAW","FOR XML PATH","FOR XML RAW","FOR XML AUTO"];

        // Determine clause "group" for blank-line logic
        function clauseGroup(kw) {
          if (joinTypes.includes(kw)) return "JOIN";
          if (kw === "ON") return "ON";
          if (forJsonXmlTypes.includes(kw)) return "FOR_JSON_XML";
          return kw; // SELECT, FROM, WHERE, etc. are each their own group
        }
        const prevGroup = clauseGroup(lastClauseKeyword);
        const curGroup = clauseGroup(upper);
        // Only blank-line on clause group change, and never inside subqueries (baseIndent > 0),
        // and never for FOR JSON/XML
        const shouldBlankLine = prevGroup !== curGroup
          && lastClauseKeyword !== ""
          && curGroup !== "FOR_JSON_XML"
          && curGroup !== "ON"
          && ctx.depth() === 0;
        if (shouldBlankLine) {
          blankLine();
        }

        if (upper === "ON") {
          // Check if previous newline keyword was a JOIN
          const isAfterJoin = joinTypes.includes(lastClauseKeyword);
          if (isAfterJoin) {
            inJoinOnClause = true;
            if (rules.joinConditionIndent) {
              // ON on its own line, indented under JOIN
              newLine(baseIndent + 1);
            } else {
              // ON stays on the same line as JOIN
              append(tok.value);
              lastClauseKeyword = upper;
              continue;
            }
          } else {
            // Not a JOIN ON — just regular keyword (e.g. CREATE INDEX ON, SET NOCOUNT ON)
            append(tok.value);
            continue;
          }
        } else {
          // Reset joinOnClause for most clause keywords
          if (["WHERE","FROM","GROUP BY","ORDER BY","HAVING","LIMIT",
              "SET","VALUES","INSERT INTO","UPDATE","DELETE",
              "UNION","UNION ALL","SELECT",
              ...joinTypes,
              "ON CONFLICT"].includes(upper)) {
            inJoinOnClause = false;
          }
          newLine(baseIndent);
        }
        append(tok.value);
        lastClauseKeyword = upper;

        // Track SELECT clause
        if (upper === "SELECT") {
          inSelectClause = true;
          inGroupOrderClause = false;
          selectColCount = 0;
          if (rules.columnIndent) {
            flush();
            cur = " ".repeat(rules.columnIndentSize || rules.indentSize || 4);
          }
        } else if (upper === "GROUP BY" || upper === "ORDER BY") {
          inSelectClause = false;
          inGroupOrderClause = true;
        } else if (["FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN",
          "FULL OUTER JOIN","CROSS JOIN","LEFT OUTER JOIN","RIGHT OUTER JOIN",
          "NATURAL JOIN","CROSS APPLY","OUTER APPLY",
          "HAVING","LIMIT","SET","VALUES","INSERT INTO","UPDATE","DELETE",
          "UNION","UNION ALL","ON CONFLICT"].includes(upper)) {
          inSelectClause = false;
          inGroupOrderClause = false;
        }
        continue;
      }

      // AND / OR on newline
      if ((upper === "AND" || upper === "OR") && rules.andOrOnNewline) {
        if (inJoinOnClause) {
          // AND/OR in JOIN ON — indent at ON level (baseIndent + 1)
          newLine(baseIndent + 1);
        } else {
          const extra = rules.andOrIndented ? 1 : 0;
          newLine(baseIndent + extra);
        }
        append(tok.value);
        continue;
      }

      // Regular keyword
      append(tok.value);
      continue;
    }

    // ── COMMA (not inline) ──
    if (tok.type === T.COMMA) {
      // GROUP BY / ORDER BY commas — keep items on same line
      if (inGroupOrderClause) {
        appendNoSpace(",");
        continue;
      }
      // SELECT with columnsPerRow > 1: break only after N columns
      if (inSelectClause && rules.selectColumnsOnNewLine === false) {
        selectColCount++;
        if (columnsPerRow > 1 && selectColCount % columnsPerRow !== 0) {
          // stay on same line
          appendNoSpace("," + commaGap);
        } else {
          appendNoSpace(",");
          newLine(baseIndent + 1);
        }
        continue;
      }
      if (inSelectClause && rules.columnIndent) {
        appendNoSpace(",");
        flush();
        cur = " ".repeat(rules.columnIndentSize || rules.indentSize || 4);
      } else if (rules.commaPosition === "start") {
        flush();
        cur = indent(baseIndent + 1);
        append(",");
      } else {
        appendNoSpace(",");
        newLine(baseIndent + 1);
      }
      continue;
    }

    // ── LPAREN (not inline) ──
    if (tok.type === T.LPAREN) {
      const pCtx = tok.parenCtx || PC.EXPRESSION;

      if (pCtx === PC.SUBQUERY) {
        ctx.push({ type: PC.SUBQUERY, inSelect: inSelectClause });
        if (rules.openParenOnNewline) {
          newLine(baseIndent);
          append("(");
        } else {
          append("(");
        }
        baseIndent++;
        continue;
      }

      // Function call — attach ( directly (or with space if spaceAfterFunctionName)
      if (pCtx === PC.FUNCTION) {
        ctx.push({ type: PC.FUNCTION, inSelect: inSelectClause });
        if (spaceFuncParen) append("(");
        else appendNoSpace("(");
        continue;
      }

      // IN list — inline, attach with space before (
      if (pCtx === PC.IN_LIST) {
        ctx.push({ type: PC.IN_LIST, inSelect: inSelectClause });
        append("(");
        continue;
      }

      // VALUES list
      if (pCtx === PC.VALUES) {
        ctx.push({ type: PC.VALUES, inSelect: inSelectClause });
        if (rules.spaceInsideParens) append("( ");
        else append("(");
        continue;
      }

      // INSERT columns
      if (pCtx === PC.INSERT_COLS) {
        ctx.push({ type: PC.INSERT_COLS, inSelect: inSelectClause });
        if (rules.spaceInsideParens) append("( ");
        else append("(");
        continue;
      }

      // Expression grouping — inline
      ctx.push({ type: PC.EXPRESSION, inSelect: inSelectClause });
      appendNoSpace("(");
      continue;
    }

    // ── RPAREN (not inline — must be subquery closing) ──
    if (tok.type === T.RPAREN) {
      const popped = ctx.pop();
      if (popped && popped.type === PC.SUBQUERY) {
        baseIndent = Math.max(0, baseIndent - 1);
        if (rules.closingParenStyle === "newline") {
          newLine(baseIndent);
          append(")");
        } else {
          newLine(baseIndent);
          append(")");
        }
        inSelectClause = popped.inSelect || false;
      } else {
        appendNoSpace(")");
      }
      continue;
    }

    // ── SEMICOLON ──
    if (tok.type === T.SEMI) {
      if (rules.semicolonOnNewline) { newLine(0); append(";"); }
      else appendNoSpace(";");
      continue;
    }

    // ── OP tokens (not inline) — respect spaceAroundOperators ──
    if (tok.type === T.OP) {
      if (spaceOps) append(tok.value);
      else {
        cur = cur.trimEnd();
        appendNoSpace(tok.value);
      }
      continue;
    }

    // ── Everything else ──
    append(tok.value);
  }

  flush();
  return lines;
}

// ─── Post-process ──────────────────────────────────────────────────────
function postProcess(lines, rules = {}) {
  let result = lines.map(l => l.trimEnd());

  // ── Align column aliases in SELECT blocks ──
  if (rules.alignColumnAliases) {
    result = alignAliases(result);
  }

  // ── Collapse consecutive blank lines ──
  const collapsed = [];
  let prevBlank = false;
  for (const line of result) {
    if (line === "") {
      if (!prevBlank) collapsed.push(line);
      prevBlank = true;
    } else {
      collapsed.push(line);
      prevBlank = false;
    }
  }
  while (collapsed.length > 0 && collapsed[0] === "") collapsed.shift();
  while (collapsed.length > 0 && collapsed[collapsed.length - 1] === "") collapsed.pop();
  return collapsed.join("\n");
}

/**
 * Pad column expressions in SELECT blocks so that AS aliases align.
 * Looks for contiguous lines of the SELECT block (indented, comma-separated lines)
 * and finds the max expr length to align AS keywords.
 */
function alignAliases(lines) {
  const result = [...lines];
  let i = 0;
  while (i < result.length) {
    // Find a SELECT line
    if (/^\s*SELECT\b/i.test(result[i])) {
      // Collect the block: next lines until a clause keyword at column 0
      const blockStart = i + 1;
      let blockEnd = blockStart;
      while (
        blockEnd < result.length &&
        !/^(?:FROM|WHERE|JOIN|LEFT|RIGHT|INNER|FULL|CROSS|GROUP|ORDER|HAVING|LIMIT|UNION|SET|VALUES|UPDATE|DELETE)\b/i.test(
          result[blockEnd].trimStart()
        )
      ) {
        blockEnd++;
      }
      // Align AS within the block
      const blockLines = result.slice(blockStart, blockEnd);
      const aligned = alignAsInBlock(blockLines);
      for (let j = 0; j < aligned.length; j++) {
        result[blockStart + j] = aligned[j];
      }
      i = blockEnd;
      continue;
    }
    i++;
  }
  return result;
}

function alignAsInBlock(lines) {
  // Only align lines that contain " AS " or end with an alias (no AS)
  // Strategy: find the leading indent + expression part before AS, compute max width
  const parsed = lines.map(line => {
    const m = line.match(/^(\s*)(.*?)\s+(AS|as)\s+(\S.*)$/);
    if (m) return { indent: m[1], expr: m[2].trimEnd(), kw: m[3], alias: m[4], raw: line };
    return { indent: "", expr: "", kw: "", alias: "", raw: line };
  });
  const withAs = parsed.filter(p => p.kw);
  if (withAs.length < 2) return lines; // nothing to align
  const maxExpr = Math.max(...withAs.map(p => p.indent.length + p.expr.length));
  return parsed.map(p => {
    if (!p.kw) return p.raw;
    const total = p.indent.length + p.expr.length;
    const pad = " ".repeat(Math.max(1, maxExpr - total + 1));
    return `${p.indent}${p.expr}${pad}${p.kw} ${p.alias}`;
  });
}

// ─── Split Multi-Statement SQL ─────────────────────────────────────────
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inSQ = false, inDQ = false, inLC = false, inBC = false, inBT = false;
  let inDollar = false, dollarTag = "";

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i], nx = sql[i+1] || "";

    // Inside dollar-quoted string (PostgreSQL)
    if (inDollar) {
      current += ch;
      if (ch === "$" && sql.slice(i, i + dollarTag.length) === dollarTag) {
        current += sql.slice(i+1, i + dollarTag.length);
        i += dollarTag.length - 1;
        inDollar = false;
      }
      continue;
    }

    if (inLC) { current += ch; if (ch === "\n") inLC = false; continue; }
    if (inBC) { current += ch; if (ch === "*" && nx === "/") { current += nx; i++; inBC = false; } continue; }
    if (inSQ) { current += ch; if (ch === "'" && nx === "'") { current += nx; i++; } else if (ch === "'") inSQ = false; continue; }
    if (inDQ) { current += ch; if (ch === '"') inDQ = false; continue; }
    if (inBT) { current += ch; if (ch === '`') inBT = false; continue; }

    // Dollar-quoted string start: $$ or $tag$
    if (ch === "$" && (nx === "$" || /[a-zA-Z_]/.test(nx))) {
      let tagEnd = sql.indexOf("$", i+1);
      if (tagEnd !== -1) {
        const tag = sql.slice(i, tagEnd+1);
        dollarTag = tag;
        inDollar = true;
        current += ch;
        continue;
      }
    }

    if (ch === "'") { inSQ = true; current += ch; continue; }
    if (ch === '"') { inDQ = true; current += ch; continue; }
    if (ch === '`') { inBT = true; current += ch; continue; }
    if (ch === "-" && nx === "-") { inLC = true; current += ch; continue; }
    if (ch === "/" && nx === "*") { inBC = true; current += ch; continue; }

    // MSSQL GO batch separator (must be on its own line)
    if ((ch === "G" || ch === "g") && (nx === "O" || nx === "o")) {
      const before = i === 0 || /[\n\r]/.test(sql[i-1]);
      const after = i+2 >= sql.length || /[\n\r\s]/.test(sql[i+2]);
      if (before && after) {
        if (current.trim()) statements.push(current.trim());
        current = "";
        i++; // skip 'O'
        continue;
      }
    }

    // Handle semicolon: don't split if ; is followed by WITH (MSSQL ;WITH CTE pattern)
    if (ch === ";") {
      // Look ahead past whitespace for WITH keyword
      let lookAhead = i + 1;
      while (lookAhead < sql.length && /\s/.test(sql[lookAhead])) lookAhead++;
      const rest = sql.slice(lookAhead, lookAhead + 4).toUpperCase();
      if (rest === "WITH") {
        // ;WITH pattern — keep the semicolon but don't split
        current += ";";
        continue;
      }
      current += ";";
      statements.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) statements.push(current.trim());
  return statements.filter(s => s.length > 0);
}

// ─── Format dollar-quoted body (PostgreSQL $$...$$ blocks) ─────────────
function formatDollarBody(formatted, rules) {
  // Match $$...$$  or $tag$...$tag$ in the formatted output
  return formatted.replace(/(\$[a-zA-Z_]*\$)([\s\S]*?)\1/g, (match, tag, body) => {
    const trimmed = body.trim();
    if (!trimmed) return match;

    // Recursively format the body
    const innerFormatted = formatSQLInner(trimmed, rules);
    // Indent each line of the body
    const indentStr = " ".repeat(rules.indentSize || 4);
    const indentedBody = innerFormatted
      .split("\n")
      .map(line => (line.trim() ? indentStr + line : ""))
      .join("\n");
    return `${tag}\n${indentedBody}\n${tag}`;
  });
}

// ─── Inner formatting (no dollar-body recursion) ───────────────────────
function formatSQLInner(rawSQL, rules) {
  if (!rawSQL || !rules) return rawSQL || "";

  const statements = splitStatements(rawSQL);
  const formatted = statements.map(stmt => {
    let sql = stmt;
    let hasSemicolon = false;
    if (sql.endsWith(";")) { hasSemicolon = true; sql = sql.slice(0, -1).trim(); }

    // Handle MSSQL ;WITH CTE pattern — strip leading ; before WITH
    let hasLeadingSemicolon = false;
    if (/^;\s*with\b/i.test(sql)) {
      hasLeadingSemicolon = true;
      sql = sql.replace(/^;\s*/, "");
    }

    let tokens = tokenize(sql);
    tokens = mergeMultiWordKeywords(tokens);
    annotateparenContexts(tokens);
    tokens.forEach(tok => applyKeywordCase(tok, rules.keywordCase));
    tokens = normalizeAlias(tokens, rules.aliasKeyword);
    if (hasSemicolon) tokens.push({ type: T.SEMI, value: ";" });

    const lines = rebuild(tokens, rules);
    let result = postProcess(lines, rules);

    // Prepend ; back to WITH for ;WITH CTE pattern
    if (hasLeadingSemicolon) {
      result = ";" + result;
    }

    return result;
  });

  return formatted.join("\n\n");
}

// ─── Main Entry Point ──────────────────────────────────────────────────
export function formatSQL(rawSQL, rules) {
  if (!rawSQL || !rules) return rawSQL || "";

  let result = formatSQLInner(rawSQL, rules);
  // Format dollar-quoted bodies (PostgreSQL functions)
  result = formatDollarBody(result, rules);
  return result;
}
