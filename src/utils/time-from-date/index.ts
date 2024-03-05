  export default function getTimeFromDate(dateString: string) {
    let dateObject = new Date(dateString);
    let time = dateObject.toTimeString().split(' ')[0];
    return time;
}