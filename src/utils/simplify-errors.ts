type TResult = Record<string, string[]>;

function simplifyErrors(
  issues: {
    message: string;
    path: string[];
  }[] = []
): TResult {
  const result: TResult = {};
  for (const issue of issues) {
    const key = issue.path.join('.') || 'other';
    if (result[key]) {
      result[key].push(issue.message);
    } else {
      result[key] = [issue.message];
    }
  }

  return result;
}

export default simplifyErrors;
