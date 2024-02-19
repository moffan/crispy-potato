export function removeSpecialChars(str: string): string {
    const regex = /[^\w\.\-æøåÆØÅ\s]/g
    
    return str.replace(regex, "");
}