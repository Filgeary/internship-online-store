export default function isString(test: any): test is string {
    return typeof test === "string"
}