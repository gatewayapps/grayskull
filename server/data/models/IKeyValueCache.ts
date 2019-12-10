// @ts-nocheck
import { Model } from 'sequelize'

export class KeyValueCache extends Model {
  public key: string = this.key
  public value: string = this.value
  public expires: Date = this.expires
}
