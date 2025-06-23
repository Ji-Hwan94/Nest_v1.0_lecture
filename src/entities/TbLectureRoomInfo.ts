import { Column, Entity, OneToMany } from "typeorm";
import { TbEquipmentInfo } from "./TbEquipmentInfo";
import { TbLectureInfo } from "./TbLectureInfo";

@Entity("tb_lecture_room_info", { schema: "lms_one" })
export class TbLectureRoomInfo {
  @Column("int", { primary: true, name: "room_id" })
  roomId: number;

  @Column("int", { name: "room_personnel", nullable: true })
  roomPersonnel: number | null;

  @Column("varchar", { name: "room_name", length: 10 })
  roomName: string;

  @Column("varchar", { name: "room_size", nullable: true, length: 10 })
  roomSize: string | null;

  @Column("varchar", { name: "room_remark", nullable: true, length: 100 })
  roomRemark: string | null;

  @OneToMany(() => TbEquipmentInfo, (tbEquipmentInfo) => tbEquipmentInfo.room)
  tbEquipmentInfos: TbEquipmentInfo[];

  @OneToMany(() => TbLectureInfo, (tbLectureInfo) => tbLectureInfo.room)
  tbLectureInfos: TbLectureInfo[];
}
