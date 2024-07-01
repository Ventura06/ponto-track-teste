import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 't_vehicle_status',
})
export class VehicleStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  vehicle_status: string;

  @Column({ length: 255 })
  description: string;
}
