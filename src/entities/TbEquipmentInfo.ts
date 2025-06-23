import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureRoomInfo } from "./TbLectureRoomInfo";

@Index("FK_tb_lecture_room_info_TO_tb_equipment_info", ["roomId"], {})
@Entity("tb_equipment_info", { schema: "lms_one" })
export class TbEquipmentInfo {
  @Column("int", { primary: true, name: "equip_id" })
  equipId: number;

  @Column("int", { name: "room_id", nullable: true })
  roomId: number | null;

  @Column("varchar", { name: "equip_serial", length: 50 })
  equipSerial: string;

  @Column("varchar", { name: "equip_name", length: 50 })
  equipName: string;

  @Column("date", { name: "equip_purchase_date" })
  equipPurchaseDate: string;

  @Column("varchar", { name: "equip_use", length: 50 })
  equipUse: string;

  @Column("int", { name: "equip_quantity", nullable: true })
  equipQuantity: number | null;

  @Column("date", { name: "equip_perioduse_date", nullable: true })
  equipPerioduseDate: string | null;

  @Column("varchar", { name: "file_name", nullable: true, length: 50 })
  fileName: string | null;

  @Column("varchar", { name: "file_ext", nullable: true, length: 10 })
  fileExt: string | null;

  @Column("varchar", { name: "file_size", nullable: true, length: 10 })
  fileSize: string | null;

  @Column("varchar", { name: "logicla_path", nullable: true, length: 50 })
  logiclaPath: string | null;

  @Column("varchar", { name: "physical_path", nullable: true, length: 50 })
  physicalPath: string | null;

  @ManyToOne(
    () => TbLectureRoomInfo,
    (tbLectureRoomInfo) => tbLectureRoomInfo.tbEquipmentInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: TbLectureRoomInfo;
}
