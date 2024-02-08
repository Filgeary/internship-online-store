export default function simplifyErrors(issues = []): Record<string, string[]> {
  const result = {};
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
