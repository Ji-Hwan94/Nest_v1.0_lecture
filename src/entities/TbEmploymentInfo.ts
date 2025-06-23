import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { TbStudentsInfo } from "./TbStudentsInfo";

@Entity("tb_employment_info", { schema: "lms_one" })
export class TbEmploymentInfo {
  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("varchar", { name: "emp_name", length: 100 })
  empName: string;

  @Column("datetime", { name: "emp_join_date", nullable: true })
  empJoinDate: Date | null;

  @Column("datetime", { name: "emp_retire_date", nullable: true })
  empRetireDate: Date | null;

  @OneToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbEmploymentInfo,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;
}
