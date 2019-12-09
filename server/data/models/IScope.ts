// @ts-nocheck
import { Model } from 'sequelize'
export class Scope extends Model {
  public id: string = this.id
  public clientDescription: string = this.clientDescription
  public userDescription: string = this.userDescription
  public required: boolean = this.required
  public permissionLevel: number = this.permissionLevel
}
