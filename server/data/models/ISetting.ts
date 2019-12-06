// @ts-nocheck
import { Model } from 'sequelize'

export class Setting extends Model {
  public key: string = this.key
  public value: string = this.value
  public type: string = this.type
  public category: string = this.category
}
