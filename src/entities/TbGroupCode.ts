import { Column, Entity, OneToMany } from "typeorm";
import { TbDetailCode } from "./TbDetailCode";

@Entity("tb_group_code", { schema: "lms_one" })
export class TbGroupCode {
  @Column("varchar", { primary: true, name: "group_code", length: 20 })
  groupCode: string;

  @Column("varchar", { name: "group_name", nullable: true, length: 200 })
  groupName: string | null;

  @Column("varchar", { name: "note", nullable: true, length: 2000 })
  note: string | null;

  @Column("varchar", { name: "use_yn", nullable: true, length: 10 })
  useYn: string | null;

  @Column("varchar", { name: "regId", nullable: true, length: 20 })
  regId: string | null;

  @Column("datetime", { name: "reg_date", nullable: true })
  regDate: Date | null;

  @Column("varchar", { name: "updateId", nullable: true, length: 20 })
  updateId: string | null;

  @Column("datetime", { name: "update_date", nullable: true })
  updateDate: Date | null;

  @Column("varchar", { name: "g_temp_field1", nullable: true, length: 20 })
  gTempField1: string | null;

  @Column("varchar", { name: "g_temp_field2", nullable: true, length: 20 })
  gTempField2: string | null;

  @Column("varchar", { name: "g_temp_field3", nullable: true, length: 20 })
  gTempField3: string | null;

  @OneToMany(() => TbDetailCode, (tbDetailCode) => tbDetailCode.groupCode2)
  tbDetailCodes: TbDetailCode[];
}
