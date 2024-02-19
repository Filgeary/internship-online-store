function simplifyName(firstName: string, length: number): string {
  if (length > 0) {
    return `${firstName} и ещё ${length}`;
  } else {
    return firstName;
  }
}

export default simplifyName;
