import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbGroupCode } from "./TbGroupCode";

@Index("FK_tb_group_code_TO_tb_detail_code", ["groupCode"], {})
@Entity("tb_detail_code", { schema: "lms_one" })
export class TbDetailCode {
  @Column("varchar", { primary: true, name: "detail_code", length: 20 })
  detailCode: string;

  @Column("varchar", { primary: true, name: "group_code", length: 20 })
  groupCode: string;

  @Column("varchar", { name: "detail_name", nullable: true, length: 200 })
  detailName: string | null;

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

  @Column("int", { name: "sequence", nullable: true })
  sequence: number | null;

  @Column("varchar", { name: "d_temp_field1", nullable: true, length: 20 })
  dTempField1: string | null;

  @Column("varchar", { name: "d_temp_field2", nullable: true, length: 20 })
  dTempField2: string | null;

  @Column("varchar", { name: "d_temp_field3", nullable: true, length: 20 })
  dTempField3: string | null;

  @Column("varchar", { name: "d_temp_field4", nullable: true, length: 20 })
  dTempField4: string | null;

  @ManyToOne(() => TbGroupCode, (tbGroupCode) => tbGroupCode.tbDetailCodes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_code", referencedColumnName: "groupCode" }])
  groupCode2: TbGroupCode;
}
