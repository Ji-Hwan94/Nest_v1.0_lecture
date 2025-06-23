import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";

@Index("FK_tb_lecture_info_TO_tb_lecture_week_plan", ["lecId"], {})
@Entity("tb_lecture_week_plan", { schema: "lms_one" })
export class TbLectureWeekPlan {
  @Column("int", { primary: true, name: "lec_week_plan_id" })
  lecWeekPlanId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { name: "lec_week_round", nullable: true })
  lecWeekRound: number | null;

  @Column("varchar", { name: "lec_week_goal", nullable: true, length: 1000 })
  lecWeekGoal: string | null;

  @Column("varchar", { name: "lec_week_content", nullable: true, length: 2000 })
  lecWeekContent: string | null;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbLectureWeekPlans,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;
}
