import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";
import { TbReportInfo } from "./TbReportInfo";

@Index("FK_tb_lecture_info_TO_tb_assignment_info", ["lecId"], {})
@Entity("tb_assignment_info", { schema: "lms_one" })
export class TbAssignmentInfo {
  @Column("int", { primary: true, name: "assign_id" })
  assignId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { name: "assign_title", length: 100 })
  assignTitle: string;

  @Column("varchar", { name: "assign_content", length: 2000 })
  assignContent: string;

  @Column("datetime", { name: "assign_start_date" })
  assignStartDate: Date;

  @Column("datetime", { name: "assign_end_date" })
  assignEndDate: Date;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbAssignmentInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;

  @OneToMany(
    () => TbReportInfo,
    (tbReportInfo) => tbReportInfo.tbAssignmentInfo
  )
  tbReportInfos: TbReportInfo[];
}
