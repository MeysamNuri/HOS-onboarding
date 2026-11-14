export function convertToDomesticFormat(phoneNumber:string) {
  // Remove the "+98" prefix and replace with "0"
  return phoneNumber.replace(/^\+98/, '0');
}