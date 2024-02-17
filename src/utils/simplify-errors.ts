type Issues = [{
    accept: boolean;
    message: string;
    rule: string;
    path?: string[]
}]

type Result = {
  [key: string]: string[]
}

export default function simplifyErrors(issues: Issues | [] = []) {
  const result: Result = {};
  for (const issue of issues) {
    const key = issue.path?.join('.') || 'other';
    if (result[key]) {
      result[key]?.push(issue.message);
    } else {
      result[key] = [issue.message]
    }
  }
  return result;
}
