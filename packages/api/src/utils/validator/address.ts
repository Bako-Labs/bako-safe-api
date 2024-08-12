import { CustomHelpers } from 'joi';
import { Address } from 'fuels';

export class AddressValidator {
  static validate(value: string, helpers: CustomHelpers) {
    try {
      const address = Address.fromString(value);
      return address.toB256();
    } catch (error) {
      return helpers.message({ custom: 'Invalid address' });
    }
  }

  static validateMany(value: string[], helpers: CustomHelpers) {
    return value.map(address => AddressValidator.validate(address, helpers));
  }

  static isAddress(value: string) {
    try {
      Address.fromString(value);
      return true;
    } catch (_) {
      return false;
    }
  }
}
