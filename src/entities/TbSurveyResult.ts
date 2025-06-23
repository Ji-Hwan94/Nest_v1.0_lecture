import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";
import { TbStudentsInfo } from "./TbStudentsInfo";
import { TbSurvey } from "./TbSurvey";

@Index("FK_tb_survey_TO_tb_survey_result", ["surveyId"], {})
@Index("FK_tb_students_info_TO_tb_survey_result", ["loginId"], {})
@Entity("tb_survey_result", { schema: "lms_one" })
export class TbSurveyResult {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "survey_id" })
  surveyId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("int", { name: "survey_result", nullable: true })
  surveyResult: number | null;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbSurveyResults,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbSurveyResults,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;

  @ManyToOne(() => TbSurvey, (tbSurvey) => tbSurvey.tbSurveyResults, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "survey_id", referencedColumnName: "surveyId" }])
  survey: TbSurvey;
}
