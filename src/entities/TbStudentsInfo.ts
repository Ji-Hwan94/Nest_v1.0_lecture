import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { TbAttendanceInfo } from "./TbAttendanceInfo";
import { TbCoursesInfo } from "./TbCoursesInfo";
import { TbEmploymentInfo } from "./TbEmploymentInfo";
import { TbReportInfo } from "./TbReportInfo";
import { TbUserinfo } from "./TbUserinfo";
import { TbSurveyResult } from "./TbSurveyResult";
import { TbTestResultInfo } from "./TbTestResultInfo";
import { TbTestSubmitInfo } from "./TbTestSubmitInfo";

@Entity("tb_students_info", { schema: "lms_one" })
export class TbStudentsInfo {
  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("varchar", { name: "students_number", length: 50 })
  studentsNumber: string;

  @Column("varchar", { name: "students_emp_status", nullable: true, length: 1 })
  studentsEmpStatus: string | null;

  @Column("blob", { name: "students_resume", nullable: true })
  studentsResume: Buffer | null;

  @Column("varchar", { name: "file_name", nullable: true, length: 1000 })
  fileName: string | null;

  @OneToMany(
    () => TbAttendanceInfo,
    (tbAttendanceInfo) => tbAttendanceInfo.login
  )
  tbAttendanceInfos: TbAttendanceInfo[];

  @OneToMany(() => TbCoursesInfo, (tbCoursesInfo) => tbCoursesInfo.login)
  tbCoursesInfos: TbCoursesInfo[];

  @OneToOne(
    () => TbEmploymentInfo,
    (tbEmploymentInfo) => tbEmploymentInfo.login
  )
  tbEmploymentInfo: TbEmploymentInfo;

  @OneToMany(() => TbReportInfo, (tbReportInfo) => tbReportInfo.login)
  tbReportInfos: TbReportInfo[];

  @OneToOne(() => TbUserinfo, (tbUserinfo) => tbUserinfo.tbStudentsInfo, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbUserinfo;

  @OneToMany(() => TbSurveyResult, (tbSurveyResult) => tbSurveyResult.login)
  tbSurveyResults: TbSurveyResult[];

  @OneToMany(
    () => TbTestResultInfo,
    (tbTestResultInfo) => tbTestResultInfo.login
  )
  tbTestResultInfos: TbTestResultInfo[];

  @OneToMany(
    () => TbTestSubmitInfo,
    (tbTestSubmitInfo) => tbTestSubmitInfo.login
  )
  tbTestSubmitInfos: TbTestSubmitInfo[];
}
