import { User } from 'src/users/entities/user.entity';
import { VehicleStatus } from 'src/vehicles_status/entities/vehicles_status.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 't_vehicle',
})
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  make: string;

  @Column({ length: 50 })
  model: string;

  @Column({ length: 4 })
  year: string;

  @Column({ unique: true, length: 17 })
  vin: string;

  @Column({ unique: true, length: 10 })
  license_plate: string;

  @Column('text')
  latitude: string;

  @Column('text')
  longitude: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.vehicles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;

  @ManyToOne(() => VehicleStatus, { eager: true })
  vehicle_status: VehicleStatus;
}
