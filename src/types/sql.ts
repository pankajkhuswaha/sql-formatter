export type DialectMode = 'postgresql' | 'mysql' | 'mssql';
export type KeywordCase = 'upper' | 'lower' | 'title';
export type AliasKeyword = 'AS' | 'as' | 'none';
export type CommaPosition = 'end' | 'start';
export type ClosingParenStyle = 'same' | 'newline';
export type ConfigStep = 'extract' | 'edit';

export interface SqlStyleRules {
  dialectMode: DialectMode;
  keywordCase: KeywordCase;
  indentChar: ' ' | '\t';
  indentSize: number;
  aliasKeyword: AliasKeyword;
  selectColumnsOnNewLine: boolean;
  columnsPerRow: number;
  commaPosition: CommaPosition;
  columnIndent: boolean;
  columnIndentSize: number;
  maxLineWidth: number;
  alignColumnAliases: boolean;
  spaceAfterComma: number;
  spaceAroundOperators: boolean;
  spaceInsideParens: boolean;
  spaceAfterFunctionName: boolean;
  joinConditionIndent: boolean;
  andOrOnNewline: boolean;
  andOrIndented: boolean;
  linesBetweenClauses: 0 | 1;
  semicolonOnNewline: boolean;
  openParenOnNewline: boolean;
  closingParenStyle: ClosingParenStyle;
  newlineBeforeKeywords: string[];
  subqueryIndentSize: number;
  inListStyle: 'inline' | 'multiline';
  inListIndentSize: number;
  functionArgsStyle: 'inline' | 'multiline';
  caseIndentStyle: 'indented' | 'same';
  caseIndentSize: number;
  betweenStyle: 'inline' | 'multiline';
  closingParenIndent: number;
  insertColumnsStyle: 'inline' | 'multiline';
  valuesStyle: 'inline' | 'multiline';
  joinConditionIndentSize: number;
  trailingComma: boolean;
  selectDistinctStyle: 'same_line';
  starExpansion: 'inline';
}

export interface DialectOption {
  id: DialectMode;
  label: string;
  icon: string;
  desc: string;
  color: string;
  activeRing: string;
}
