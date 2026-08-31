/**
 * 関数名を自動取得するヘルパー関数
 * @returns 現在の関数名
 */
export const getFunctionName = (): string => {
  const stack = new Error().stack;
  if (stack) {
    const lines = stack.split('\n');
    // lines[1] = getFunctionName 自身、lines[2] = 呼び出し元の関数
    if (lines.length > 2) {
      const match = lines[2].match(/at\s+(\w+)/);
      return match ? match[1] : 'unknown';
    }
  }
  return 'unknown';
};
