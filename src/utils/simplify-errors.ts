export default function simplifyErrors(issues: any = {}) {
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
