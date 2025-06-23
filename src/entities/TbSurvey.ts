import { Column, Entity, OneToMany } from "typeorm";
import { TbSurveyResult } from "./TbSurveyResult";

@Entity("tb_survey", { schema: "lms_one" })
export class TbSurvey {
  @Column("int", { primary: true, name: "survey_id" })
  surveyId: number;

  @Column("varchar", { name: "survey_content", length: 2000 })
  surveyContent: string;

  @OneToMany(() => TbSurveyResult, (tbSurveyResult) => tbSurveyResult.survey)
  tbSurveyResults: TbSurveyResult[];
}
