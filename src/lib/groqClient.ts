// @ts-nocheck

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a SQL formatting style analyzer. You MUST respond ONLY with raw JSON — no markdown, no code fences, no explanation, no text before or after. Just the JSON object. Analyze every tiny detail of the formatting. You support all SQL dialects: PostgreSQL, MySQL, MSSQL/T-SQL, and stored procedures/functions/views/triggers.`;

// Dialect-specific context injected into the prompt so the AI knows exact syntax rules
const DIALECT_CONTEXT = {
  postgresql: {
    label: 'PostgreSQL',
    notes: `This is PostgreSQL SQL. Be aware of:
- Dollar-quoted strings: $$ ... $$ and $tag$ ... $tag$
- Type casts using :: operator (e.g. value::text, now()::date)
- RETURNING clause after INSERT/UPDATE/DELETE
- ON CONFLICT ... DO NOTHING / DO UPDATE syntax
- ILIKE, SIMILAR TO operators
- Array operations: ARRAY[], ANY(), ALL()
- Window functions and CTEs are very common
- Identifiers may be double-quoted
- RAISE NOTICE / RAISE EXCEPTION in PL/pgSQL functions`,
  },
  mysql: {
    label: 'MySQL',
    notes: `This is MySQL (or MariaDB) SQL. Be aware of:
- Identifiers are backtick-quoted: \`table_name\`, \`column\`
- LIMIT / OFFSET for pagination (no FETCH NEXT)
- IF() / IFNULL() / NULLIF() functions instead of COALESCE patterns
- GROUP_CONCAT() instead of STRING_AGG()
- AUTO_INCREMENT column attribute
- ENGINE=InnoDB table option
- Stored procedures use DELIMITER and BEGIN ... END
- No RETURNING clause; use LAST_INSERT_ID()
- DATE_FORMAT(), STR_TO_DATE(), NOW() date functions`,
  },
  mssql: {
    label: 'MSSQL / T-SQL',
    notes: `This is Microsoft SQL Server T-SQL. Be aware of:
- Identifiers are bracket-quoted: [schema].[table], [column]
- TOP N instead of LIMIT
- GO as a batch separator (must be on its own line)
- NOLOCK hint: WITH (NOLOCK)
- TRY / CATCH error handling blocks
- PRINT statement for debug output
- RAISERROR / THROW for exceptions
- OUTPUT clause on INSERT / UPDATE / DELETE (INSERTED., DELETED. virtual tables)
- SCOPE_IDENTITY(), @@ROWCOUNT, @@ERROR system variables
- FOR XML PATH, FOR JSON PATH output clauses
- ;WITH CTE pattern (semicolon before WITH)`,
  },
};

/**
 * Build the full user prompt, injecting the dialect context chosen by the user.
 */
function buildPrompt(dialect) {
  const ctx = DIALECT_CONTEXT[dialect] || DIALECT_CONTEXT.postgresql;
  return `Analyze the formatting style of the following SQL query very carefully.

Database: ${ctx.label}
${ctx.notes}

Now focus purely on FORMATTING style — look at EVERY line break, indentation, and spacing detail.

IMPORTANT RULES:
- For "andOrOnNewline": If AND or OR appears at the START of any line (possibly with leading spaces), this MUST be true.
- For "andOrIndented": If AND/OR lines are indented (have leading spaces), this MUST be true.
- For "newlineBeforeKeywords": Check EVERY keyword that starts a new line. Include ON, HAVING, and any keyword that begins a line.
- For "spaceInsideParens": Look at function calls like COUNT(x) — if there is NO space after ( or before ), set false.
- For "joinConditionIndent": If ON appears on a SEPARATE line (indented) after a JOIN line, set true. If ON stays on the SAME line as JOIN, set false.
- For "selectColumnsOnNewLine": If SELECT columns are each on their own line (one column per line), set true. If multiple columns appear on the same line separated by commas, set false.
- For "columnsPerRow": Count how many columns appear on a single SELECT line when selectColumnsOnNewLine=false.
- For "spaceAroundOperators": Check if there is a space on both sides of = < > != operators.
- For "spaceAfterComma": Count the number of spaces after a comma inside function calls / IN lists (usually 1).
- For "spaceAfterFunctionName": Check if there is a space between a function name and its opening parenthesis like COUNT (x).
- For "alignColumnAliases": Check if column name widths are padded with spaces so that AS alias keywords align vertically.
- For "maxLineWidth": Estimate the longest line length in the sample. Round up to nearest 20. Min 80.

Return a JSON object with exactly these fields:

{
  "keywordCase": "upper" | "lower" | "title",
  "indentChar": " " | "\\t",
  "indentSize": <number>,
  "newlineBeforeKeywords": <string array — every keyword that starts on its own line, e.g. ["SELECT","FROM","WHERE","LEFT JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT"]>,
  "commaPosition": "end" | "start",
  "openParenOnNewline": <boolean>,
  "andOrOnNewline": <boolean — TRUE if AND/OR begin a new line in the sample>,
  "andOrIndented": <boolean — TRUE if those AND/OR lines are indented>,
  "aliasKeyword": "AS" | "as" | "none",
  "semicolonOnNewline": <boolean>,
  "columnIndent": <boolean>,
  "columnIndentSize": <number>,
  "subqueryIndentSize": <number>,
  "linesBetweenClauses": 0 | 1,
  "inListStyle": "inline" | "multiline",
  "inListIndentSize": <number>,
  "functionArgsStyle": "inline" | "multiline",
  "caseIndentStyle": "indented" | "same",
  "caseIndentSize": <number>,
  "betweenStyle": "inline" | "multiline",
  "closingParenStyle": "same" | "newline",
  "closingParenIndent": <number>,
  "spaceInsideParens": <boolean>,
  "spaceAfterComma": <number — spaces after comma inside inline expressions, usually 1>,
  "spaceAroundOperators": <boolean — true if space on both sides of = < > !=>,
  "spaceAfterFunctionName": <boolean — true if space between function name and open paren>,
  "insertColumnsStyle": "inline" | "multiline",
  "valuesStyle": "inline" | "multiline",
  "joinConditionIndent": <boolean — TRUE if ON is on a separate indented line after JOIN, FALSE if ON is on same line as JOIN>,
  "joinConditionIndentSize": <number>,
  "selectColumnsOnNewLine": <boolean — TRUE if each SELECT column is on its own line, FALSE if multiple columns on same line>,
  "columnsPerRow": <number — columns per row when selectColumnsOnNewLine is false, usually 1-5>,
  "alignColumnAliases": <boolean — true if column names are padded so AS aliases align>,
  "maxLineWidth": <number — estimated max line width, rounded to nearest 20, min 80>,
  "trailingComma": <boolean>,
  "selectDistinctStyle": "same_line",
  "starExpansion": "inline"
}

SQL query to analyze:

`;
}

/**
 * Extracts SQL formatting style rules from a sample query using Groq API.
 * @param {string} sampleSQL - The sample SQL query to analyze
 * @param {string} dialect - User-selected database dialect: "postgresql"|"mysql"|"mssql"
 * @returns {Promise<object>} The extracted style rules
 */
export async function extractStyle(sampleSQL, dialect = 'postgresql') {
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';

  if (!apiKey) {
    throw new Error('No API key provided. Enter your Groq API key above.');
  }

  const userPrompt = buildPrompt(dialect) + sampleSQL;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (response.status === 401) {
    throw new Error('Invalid API key. Please check your Groq API key.');
  }
  if (response.status === 429) {
    throw new Error('Rate limit hit. Please wait a moment and try again.');
  }
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content ?? '';

  // Strip accidental markdown code fences
  content = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  let rules;
  try {
    rules = JSON.parse(content);
  } catch {
    throw new Error('Could not extract style — the AI response was not valid JSON. Try pasting a more complete SQL query.');
  }

  // Post-process: verify AI output against actual sample SQL patterns
  rules = postProcessRules(rules, sampleSQL);
  return rules;
}

/**
 * Analyze the raw sample SQL to verify and correct the AI's extraction.
 * The AI often misses AND/OR newline patterns and ON indentation.
 */
function postProcessRules(rules, sampleSQL) {
  const lines = sampleSQL.split('\n').map((l) => l.trimEnd());

  // Check if AND or OR appear at the start of any line (with possible indentation)
  const andOrAtLineStart = lines.some((l) => /^\s+(AND|OR)\b/i.test(l));
  if (andOrAtLineStart) {
    rules.andOrOnNewline = true;
    // Check if they're indented
    const andOrLine = lines.find((l) => /^\s+(AND|OR)\b/i.test(l));
    if (andOrLine) {
      const indent = andOrLine.match(/^(\s+)/)?.[1]?.length || 0;
      rules.andOrIndented = indent > 0;
    }
  }

  // Comprehensive: scan every line for keywords that start at the beginning
  const kwsUpper = new Set((rules.newlineBeforeKeywords || []).map((k) => k.toUpperCase()));
  const multiWordPatterns = [
    'LEFT OUTER JOIN',
    'RIGHT OUTER JOIN',
    'FULL OUTER JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'INNER JOIN',
    'CROSS JOIN',
    'GROUP BY',
    'ORDER BY',
    'PARTITION BY',
    'INSERT INTO',
    'UNION ALL',
    'NOT IN',
    'NOT EXISTS',
  ];
  const singleKws = [
    'SELECT',
    'FROM',
    'WHERE',
    'JOIN',
    'ON',
    'HAVING',
    'LIMIT',
    'OFFSET',
    'SET',
    'VALUES',
    'UPDATE',
    'DELETE',
    'INSERT',
    'UNION',
    'INTERSECT',
    'EXCEPT',
    'WITH',
    'RETURNING',
  ];

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();
    if (!trimmed) continue;

    // Check multi-word keywords first
    let matched = false;
    for (const mwk of multiWordPatterns) {
      if (trimmed.startsWith(mwk + ' ') || trimmed === mwk) {
        if (!kwsUpper.has(mwk)) {
          rules.newlineBeforeKeywords.push(mwk);
          kwsUpper.add(mwk);
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Check single keywords
    for (const kw of singleKws) {
      if (trimmed.startsWith(kw + ' ') || trimmed === kw || trimmed.startsWith(kw + '\t')) {
        if (!kwsUpper.has(kw)) {
          rules.newlineBeforeKeywords.push(kw);
          kwsUpper.add(kw);
        }
        break;
      }
    }
  }

  // Check if ON appears indented on its own line (after JOIN)
  const onAtLineStart = lines.some((l) => /^\s+ON\b/i.test(l));
  if (onAtLineStart) {
    rules.joinConditionIndent = true;
  }
  // Check if ON stays on the same line as JOIN
  const onSameLineAsJoin = lines.some((l) => /\bjoin\b.*\bon\b/i.test(l));
  if (onSameLineAsJoin && !onAtLineStart) {
    rules.joinConditionIndent = false;
  }

  // Check function call parens — look for patterns like COUNT(, SUM( without space
  const funcNoSpace = /\b\w+\([^\s)]/i.test(sampleSQL);
  if (funcNoSpace) {
    rules.spaceInsideParens = false;
    rules.spaceAfterFunctionName = false;
  }

  // Check space after function name: COUNT (x)
  const funcWithSpace = /\b[A-Z_]+\s+\(/i.test(sampleSQL);
  if (funcWithSpace) {
    rules.spaceAfterFunctionName = true;
  }

  // Check space around operators
  const hasSpaceAroundOp = /\s[=<>!]{1,2}\s/.test(sampleSQL);
  if (hasSpaceAroundOp) {
    rules.spaceAroundOperators = true;
  } else if (/[a-zA-Z0-9][=<>!]{1,2}[a-zA-Z0-9]/.test(sampleSQL)) {
    rules.spaceAroundOperators = false;
  }

  // Guess max line width from sample
  const maxLen = Math.max(...lines.map((l) => l.length));
  if (maxLen > 0 && (!rules.maxLineWidth || rules.maxLineWidth < 80)) {
    rules.maxLineWidth = Math.ceil(Math.max(80, maxLen) / 20) * 20;
  }

  // Detect columnsPerRow from SELECT block
  const selectIdx = lines.findIndex((l) => /^\s*SELECT\b/i.test(l));
  if (selectIdx !== -1) {
    let multiColOnLine = false;
    let maxColsOnLine = 1;
    for (let li = selectIdx; li < lines.length; li++) {
      const lineTrimmed = lines[li].trim().toUpperCase();
      if (
        li > selectIdx &&
        /^(FROM|WHERE|JOIN|LEFT|RIGHT|INNER|FULL|CROSS|GROUP|ORDER|HAVING|LIMIT|UNION|SET|VALUES|UPDATE|DELETE)\b/.test(lineTrimmed)
      )
        break;
      let depth = 0,
        commaCount = 0;
      for (const ch of lines[li]) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ',' && depth === 0) commaCount++;
      }
      if (commaCount >= 1) {
        multiColOnLine = true;
        maxColsOnLine = Math.max(maxColsOnLine, commaCount + 1);
      }
    }
    if (multiColOnLine) {
      rules.selectColumnsOnNewLine = false;
      if (!rules.columnsPerRow || rules.columnsPerRow < 1) {
        rules.columnsPerRow = maxColsOnLine;
      }
    }
  }

  // Ensure numeric defaults
  rules.spaceAfterComma = typeof rules.spaceAfterComma === 'number' ? rules.spaceAfterComma : 1;
  rules.maxLineWidth = typeof rules.maxLineWidth === 'number' ? rules.maxLineWidth : 120;
  rules.columnsPerRow = typeof rules.columnsPerRow === 'number' ? Math.max(1, rules.columnsPerRow) : 1;

  return rules;
}
