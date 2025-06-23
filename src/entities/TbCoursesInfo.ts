import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";
import { TbStudentsInfo } from "./TbStudentsInfo";

@Index("FK_tb_students_info_TO_tb_courses_info", ["loginId"], {})
@Entity("tb_courses_info", { schema: "lms_one" })
export class TbCoursesInfo {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("datetime", { name: "course_reg_date", nullable: true })
  courseRegDate: Date | null;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbCoursesInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbCoursesInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;
}
