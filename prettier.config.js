module.exports = {
  printWidth: 80, // 最大80文字／行
  tabWidth: 2, // タブ幅は 2スペース分
  useTabs: false, // スペースの代わりにタブを使わない
  semi: true, // 行末のセミコロンは必須にする
  singleQuote: true, // 引用符にシングルクォートを使う
  quoteProps: 'as-needed', // 必要な場合のみプロパティに引用符を使用する
  jsxSingleQuote: true, // 引用符にシングルクォートを使う (JSX)
  trailingComma: 'none', // 末尾の要素にコンマを付けない
  bracketSpacing: true, // `{ foo: 1 }` のように括弧にスペースを付ける
  jsxBracketSameLine: false, // 長いタグ(`<foo bar="" ...>`) になった場合、 改行して `>` だけの行ができることを許容する
  arrowParens: 'always', // `(x) => x` のように、仮引数が一つでも常に括弧を使う
  rangeStart: 0, // フォーマット開始位置 最初から
  rangeEnd: Infinity, // フォーマット終了位置 最後まで
  filepath: 'none', // 使用するパーサーを推測するために使用するファイル名を指定しない
  requirePragma: false, // ファイルの先頭にプラグマ(`/** @format */`)を含むファイルのみをフォーマットとしない (全ファイルをフォーマット対象とする)
  insertPragma: false, // ファイルの先頭にプラグマ(`/** @format */`)を挿入しない
  proseWrap: 'preserve', // Markdown テキストをテキストの指定通りに折り返す
  htmlWhitespaceSensitivity: 'css', // HTML の空白は CSS の display プロパティのデフォルト値を尊重
  vueIndentScriptAndStyle: false, // Vueファイル内の `<script>` と `<style>` をインデントしない
  endOfLine: 'lf', // 改行コードは LF に限定
  embeddedLanguageFormatting: 'auto' // Prettier が自動的に識別できる場合、埋め込みコードをフォーマットする
};
