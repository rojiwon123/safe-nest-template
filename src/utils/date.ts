export namespace DateMapper {
    /** ISO8601 */
    export const toISO = (date?: Date): string => {
        const time = date ?? new Date();
        return time.toISOString();
    };

    /** YYYY-MM-DD HH:mm:ss */
    export const toDateTime = (date?: Date): string => {
        const time = date ?? new Date();

        const year = time.getFullYear();
        const month = `${time.getMonth() + 1}`.padStart(2, "0");
        const day = `${time.getDate()}`.padStart(2, "0");
        const hours = `${time.getHours()}`.padStart(2, "0");
        const minutes = `${time.getMinutes()}`.padStart(2, "0");
        const seconds = `${time.getSeconds()}`.padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    /** YYYY-MM-DD */
    export const toDate = (date?: Date): string => {
        const time = date ?? new Date();

        const year = time.getFullYear();
        const month = `${time.getMonth() + 1}`.padStart(2, "0");
        const day = `${time.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    /** HH:mm:ss */
    export const toTime = (date?: Date): string => {
        const time = date ?? new Date();

        const hours = `${time.getHours()}`.padStart(2, "0");
        const minutes = `${time.getMinutes()}`.padStart(2, "0");
        const seconds = `${time.getSeconds()}`.padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    };
}
