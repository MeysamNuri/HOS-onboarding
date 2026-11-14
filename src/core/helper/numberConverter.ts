export class NumberConverter {

    private static latinToArabicMap: { [key: string]: string } = {
        '0': '\u06F0',
        '1': '\u06F1',
        '2': '\u06F2',
        '3': '\u06F3',
        '4': '\u06F4',
        '5': '\u06F5',
        '6': '\u06F6',
        '7': '\u06F7',
        '8': '\u06F8',
        '9': '\u06F9'
    };

    public static latinToArabic(text: string): string {
        if (typeof text !== 'string') {
            console.error('Input is not a valid string');
            return '';
        }
        return text.replace(/\d/g, (digit) => this.latinToArabicMap[digit] || digit);
    }

    public static formatTime(hours: number, minutes: number): string {
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${this.latinToArabic(formattedHours)}:${this.latinToArabic(formattedMinutes)}`;
    }
    public static formatNumberWithCommas(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public static formatCurrency(number: number): string {
        const formatted = this.formatNumberWithCommas(number);
        return this.latinToArabic(formatted);
    }
}
