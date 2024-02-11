interface Issue {
  accept?: boolean,
  message: string,
  path: string[],
  rule?: string,
}

type Issues = Issue[];

export default function simplifyErrors(issues: Issues = []): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path.join('.') || 'other';
    if (result[key]) {
      result[key].push(issue.message);
    } else {
      result[key] = [issue.message]
    }
  }
  return result;
}
