const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a SQL formatting style analyzer. You MUST respond ONLY with raw JSON — no markdown, no code fences, no explanation, no text before or after. Just the JSON object. Analyze every tiny detail of the formatting. You support all SQL dialects: PostgreSQL, MySQL, MSSQL/T-SQL, and stored procedures/functions/views/triggers.`;

const USER_PROMPT_TEMPLATE = `Analyze the formatting style of the following SQL query very carefully. Look at EVERY line break and indentation. The query could be any type: SELECT/INSERT/UPDATE/DELETE, CREATE TABLE/VIEW/FUNCTION/PROCEDURE, stored procedures, triggers, or any DDL/DML in PostgreSQL, MySQL, or MSSQL.

IMPORTANT RULES:
- For "andOrOnNewline": Look at the actual lines. If AND or OR appears at the START of any line (possibly with leading spaces), this MUST be true.
- For "andOrIndented": If AND/OR lines are indented (have leading spaces), this MUST be true.
- For "newlineBeforeKeywords": Check EVERY keyword that starts a new line. Include ON, HAVING, and any keyword that begins a line.
- For "spaceInsideParens": Look at function calls like COUNT(x) — if there is NO space after ( or before ), set false.
- For "joinConditionIndent": If ON appears on a SEPARATE line (indented) after a JOIN line, set true. If ON stays on the SAME line as JOIN (e.g. "join tbl a on a.id = b.id"), set false.
- For "selectColumnsOnNewLine": If SELECT columns are each on their own line (one column per line), set true. If multiple columns appear on the same line separated by commas, set false.
- For "joinAndOrOnNewline": If AND/OR appears on its own line INSIDE a JOIN ON condition (after ON, before WHERE/GROUP BY), set true.

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
  "insertColumnsStyle": "inline" | "multiline",
  "valuesStyle": "inline" | "multiline",
  "joinConditionIndent": <boolean — TRUE if ON is on a separate indented line after JOIN, FALSE if ON is on same line as JOIN>,
  "joinConditionIndentSize": <number>,
  "selectColumnsOnNewLine": <boolean — TRUE if each SELECT column is on its own line, FALSE if multiple columns on same line>,
  "trailingComma": <boolean>,
  "selectDistinctStyle": "same_line",
  "starExpansion": "inline"
}

SQL query to analyze:

`;

/**
 * Extracts SQL formatting style rules from a sample query using Groq API.
 * @param {string} sampleSQL - The sample SQL query to analyze
 * @returns {Promise<object>} The extracted style rules
 */
export async function extractStyle(sampleSQL) {
  const apiKey =
    localStorage.getItem("groqApiKey") ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GROQ_API_KEY) ||
    "";

  if (!apiKey) {
    throw new Error("No API key provided. Enter your Groq API key above.");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT_TEMPLATE + sampleSQL },
      ],
      temperature: 0.1,
      max_tokens: 2048,
    }),
  });

  if (response.status === 401) {
    throw new Error("Invalid API key. Please check your Groq API key.");
  }
  if (response.status === 429) {
    throw new Error("Rate limit hit. Please wait a moment and try again.");
  }
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content ?? "";

  // Strip accidental markdown code fences
  content = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let rules;
  try {
    rules = JSON.parse(content);
  } catch {
    throw new Error(
      "Could not extract style — the AI response was not valid JSON. Try pasting a more complete SQL query."
    );
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
  const lines = sampleSQL.split("\n").map(l => l.trimEnd());

  // Check if AND or OR appear at the start of any line (with possible indentation)
  const andOrAtLineStart = lines.some(l => /^\s+(AND|OR)\b/i.test(l));
  if (andOrAtLineStart) {
    rules.andOrOnNewline = true;
    // Check if they're indented
    const andOrLine = lines.find(l => /^\s+(AND|OR)\b/i.test(l));
    if (andOrLine) {
      const indent = andOrLine.match(/^(\s+)/)?.[1]?.length || 0;
      rules.andOrIndented = indent > 0;
    }
  }

  // Comprehensive: scan every line for keywords that start at the beginning
  // This catches LEFT JOIN, RIGHT JOIN, HAVING, LIMIT, etc.
  const kwsUpper = new Set(rules.newlineBeforeKeywords.map(k => k.toUpperCase()));
  const multiWordPatterns = [
    "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
    "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "CROSS JOIN",
    "GROUP BY", "ORDER BY", "PARTITION BY",
    "INSERT INTO", "UNION ALL", "NOT IN", "NOT EXISTS",
  ];
  const singleKws = [
    "SELECT", "FROM", "WHERE", "JOIN", "ON", "HAVING", "LIMIT", "OFFSET",
    "SET", "VALUES", "UPDATE", "DELETE", "INSERT", "UNION", "INTERSECT", "EXCEPT",
    "WITH", "RETURNING",
  ];

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();
    if (!trimmed) continue;

    // Check multi-word keywords first
    let matched = false;
    for (const mwk of multiWordPatterns) {
      if (trimmed.startsWith(mwk + " ") || trimmed === mwk) {
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
      if (trimmed.startsWith(kw + " ") || trimmed === kw || trimmed.startsWith(kw + "\t")) {
        if (!kwsUpper.has(kw)) {
          rules.newlineBeforeKeywords.push(kw);
          kwsUpper.add(kw);
        }
        break;
      }
    }
  }

  // Check if ON appears indented on its own line (after JOIN)
  const onAtLineStart = lines.some(l => /^\s+ON\b/i.test(l));
  if (onAtLineStart) {
    rules.joinConditionIndent = true;
  }
  // Check if ON stays on the same line as JOIN
  const onSameLineAsJoin = lines.some(l => /\bjoin\b.*\bon\b/i.test(l));
  if (onSameLineAsJoin && !onAtLineStart) {
    rules.joinConditionIndent = false;
  }

  // Check function call parens — look for patterns like COUNT(, SUM( without space
  const funcNoSpace = /\b\w+\([^\s)]/i.test(sampleSQL);
  if (funcNoSpace) {
    rules.spaceInsideParens = false;
  }

  // Check if SELECT columns are on the same line (multiple commas on one line after SELECT)
  const selectIdx = lines.findIndex(l => /^\s*SELECT\b/i.test(l.trim()));
  if (selectIdx !== -1) {
    // Check the SELECT line and the lines after it (before FROM)
    let multiColOnLine = false;
    for (let li = selectIdx; li < lines.length; li++) {
      const line = lines[li].trim().toUpperCase();
      if (li > selectIdx && /^(FROM|WHERE|JOIN|LEFT|RIGHT|INNER|FULL|CROSS|GROUP|ORDER|HAVING|LIMIT|UNION|SET|VALUES|UPDATE|DELETE)\b/.test(line)) break;
      // Count commas on this line (excluding commas inside parentheses)
      let depth = 0, commaCount = 0;
      for (const ch of lines[li]) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ',' && depth === 0) commaCount++;
      }
      if (commaCount >= 2) { multiColOnLine = true; break; }
    }
    if (multiColOnLine) {
      rules.selectColumnsOnNewLine = false;
    }
  }

  return rules;
}
