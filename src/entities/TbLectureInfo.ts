import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbAssignmentInfo } from "./TbAssignmentInfo";
import { TbCoursesInfo } from "./TbCoursesInfo";
import { TbLearningMaterialInfo } from "./TbLearningMaterialInfo";
import { TbLectureRoomInfo } from "./TbLectureRoomInfo";
import { TbUserinfo } from "./TbUserinfo";
import { TbLectureRoundInfo } from "./TbLectureRoundInfo";
import { TbLectureTimeInfo } from "./TbLectureTimeInfo";
import { TbLectureWeekPlan } from "./TbLectureWeekPlan";
import { TbQnaInfo } from "./TbQnaInfo";
import { TbSurveyResult } from "./TbSurveyResult";
import { TbTestInfo } from "./TbTestInfo";

@Index("FK_tb_userinfo_TO_tb_lecture_info", ["loginId"], {})
@Index("FK_tb_lecture_room_info_TO_tb_lecture_info", ["roomId"], {})
@Entity("tb_lecture_info", { schema: "lms_one" })
export class TbLectureInfo {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { name: "loginID", nullable: true, length: 50 })
  loginId: string | null;

  @Column("int", { name: "room_id", nullable: true })
  roomId: number | null;

  @Column("varchar", { name: "lec_name", length: 100 })
  lecName: string;

  @Column("date", { name: "lec_start_date" })
  lecStartDate: string;

  @Column("date", { name: "lec_end_date" })
  lecEndDate: string;

  @Column("int", { name: "lec_personnel" })
  lecPersonnel: number;

  @Column("blob", { name: "lec_plan", nullable: true })
  lecPlan: Buffer | null;

  @Column("int", { name: "lecture_round", nullable: true })
  lectureRound: number | null;

  @Column("varchar", { name: "lec_goal", nullable: true, length: 500 })
  lecGoal: string | null;

  @Column("varchar", { name: "lec_content", nullable: true, length: 2000 })
  lecContent: string | null;

  @Column("varchar", { name: "lec_specifics", nullable: true, length: 500 })
  lecSpecifics: string | null;

  @Column("int", { name: "lec_section_cnt", nullable: true })
  lecSectionCnt: number | null;

  @Column("int", { name: "lec_days_cnt", nullable: true })
  lecDaysCnt: number | null;

  @OneToMany(() => TbAssignmentInfo, (tbAssignmentInfo) => tbAssignmentInfo.lec)
  tbAssignmentInfos: TbAssignmentInfo[];

  @OneToMany(() => TbCoursesInfo, (tbCoursesInfo) => tbCoursesInfo.lec)
  tbCoursesInfos: TbCoursesInfo[];

  @OneToMany(
    () => TbLearningMaterialInfo,
    (tbLearningMaterialInfo) => tbLearningMaterialInfo.lec
  )
  tbLearningMaterialInfos: TbLearningMaterialInfo[];

  @ManyToOne(
    () => TbLectureRoomInfo,
    (tbLectureRoomInfo) => tbLectureRoomInfo.tbLectureInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: TbLectureRoomInfo;

  @ManyToOne(() => TbUserinfo, (tbUserinfo) => tbUserinfo.tbLectureInfos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbUserinfo;

  @OneToMany(
    () => TbLectureRoundInfo,
    (tbLectureRoundInfo) => tbLectureRoundInfo.lec
  )
  tbLectureRoundInfos: TbLectureRoundInfo[];

  @OneToMany(
    () => TbLectureTimeInfo,
    (tbLectureTimeInfo) => tbLectureTimeInfo.lec
  )
  tbLectureTimeInfos: TbLectureTimeInfo[];

  @OneToMany(
    () => TbLectureWeekPlan,
    (tbLectureWeekPlan) => tbLectureWeekPlan.lec
  )
  tbLectureWeekPlans: TbLectureWeekPlan[];

  @OneToMany(() => TbQnaInfo, (tbQnaInfo) => tbQnaInfo.lec)
  tbQnaInfos: TbQnaInfo[];

  @OneToMany(() => TbSurveyResult, (tbSurveyResult) => tbSurveyResult.lec)
  tbSurveyResults: TbSurveyResult[];

  @OneToMany(() => TbTestInfo, (tbTestInfo) => tbTestInfo.lec)
  tbTestInfos: TbTestInfo[];
}
