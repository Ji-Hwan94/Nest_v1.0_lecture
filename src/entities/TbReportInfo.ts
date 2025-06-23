import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbAssignmentInfo } from "./TbAssignmentInfo";
import { TbStudentsInfo } from "./TbStudentsInfo";

@Index("FK_tb_assignment_info_TO_tb_report_info", ["assignId", "lecId"], {})
@Index("FK_tb_students_info_TO_tb_report_info", ["loginId"], {})
@Entity("tb_report_info", { schema: "lms_one" })
export class TbReportInfo {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "assign_id" })
  assignId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("datetime", { name: "report_reg_date" })
  reportRegDate: Date;

  @Column("varchar", { name: "report_content", nullable: true, length: 2000 })
  reportContent: string | null;

  @ManyToOne(
    () => TbAssignmentInfo,
    (tbAssignmentInfo) => tbAssignmentInfo.tbReportInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "assign_id", referencedColumnName: "assignId" },
    { name: "lec_id", referencedColumnName: "lecId" },
  ])
  tbAssignmentInfo: TbAssignmentInfo;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbReportInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;
}
