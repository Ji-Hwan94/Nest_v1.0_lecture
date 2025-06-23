import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { TbAttendanceInfo } from "./TbAttendanceInfo";
import { TbLectureInfo } from "./TbLectureInfo";

@Index("FK_tb_lecture_info_TO_tb_lecture_round_info", ["lecId"], {})
@Entity("tb_lecture_round_info", { schema: "lms_one" })
export class TbLectureRoundInfo {
  @Column("int", { primary: true, name: "round_id" })
  roundId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { name: "round_cnt", nullable: true })
  roundCnt: number | null;

  @OneToOne(
    () => TbAttendanceInfo,
    (tbAttendanceInfo) => tbAttendanceInfo.tbLectureRoundInfo
  )
  tbAttendanceInfo: TbAttendanceInfo;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbLectureRoundInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;
}
