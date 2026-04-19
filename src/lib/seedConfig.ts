import type { SqlStyleRules } from '../types/sql';

const CONFIG_VERSION = 'v1';

const USER_CONFIG: SqlStyleRules = {
  dialectMode: 'mssql',
  keywordCase: 'lower',
  indentChar: ' ',
  indentSize: 4,
  aliasKeyword: 'as',
  selectColumnsOnNewLine: false,
  columnsPerRow: 5,
  commaPosition: 'end',
  columnIndent: false,
  columnIndentSize: 0,
  maxLineWidth: 120,
  alignColumnAliases: false,
  spaceAfterComma: 1,
  spaceAroundOperators: false,
  spaceInsideParens: false,
  spaceAfterFunctionName: true,
  joinConditionIndent: false,
  andOrOnNewline: false,
  andOrIndented: true,
  linesBetweenClauses: 0,
  semicolonOnNewline: false,
  openParenOnNewline: false,
  closingParenStyle: 'same',
  newlineBeforeKeywords: [
    'with', 'select', 'from', 'where',
    'case', 'when', 'then', 'else', 'end',
    'join', 'left join', 'order by', 'UNION ALL', 'GROUP BY',
  ],
  subqueryIndentSize: 4,
  inListStyle: 'inline',
  inListIndentSize: 4,
  functionArgsStyle: 'inline',
  caseIndentStyle: 'indented',
  caseIndentSize: 4,
  betweenStyle: 'inline',
  closingParenIndent: 0,
  insertColumnsStyle: 'inline',
  valuesStyle: 'inline',
  joinConditionIndentSize: 4,
  trailingComma: false,
  selectDistinctStyle: 'same_line',
  starExpansion: 'inline',
};

export function seedConfig() {
  const seeded = localStorage.getItem('sqlStyleRules_seeded');
  if (seeded === CONFIG_VERSION) return;

  localStorage.setItem('sqlStyleRules', JSON.stringify(USER_CONFIG));
  localStorage.setItem('sqlStyleRules_seeded', CONFIG_VERSION);
  console.info('[seedConfig] Config seeded:', CONFIG_VERSION);
}
