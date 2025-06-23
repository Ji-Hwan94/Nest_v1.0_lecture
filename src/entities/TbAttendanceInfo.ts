import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { TbLectureRoundInfo } from "./TbLectureRoundInfo";
import { TbStudentsInfo } from "./TbStudentsInfo";

@Index("FK_tb_students_info_TO_tb_attendance_info", ["loginId"], {})
@Entity("tb_attendance_info", { schema: "lms_one" })
export class TbAttendanceInfo {
  @Column("int", { primary: true, name: "time_id" })
  timeId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("datetime", { name: "attend_startdate", nullable: true })
  attendStartdate: Date | null;

  @Column("datetime", { name: "attend_enddate", nullable: true })
  attendEnddate: Date | null;

  @Column("varchar", { name: "attend_state", nullable: true, length: 1 })
  attendState: string | null;

  @Column("varchar", { name: "loginID", nullable: true, length: 50 })
  loginId: string | null;

  @OneToOne(
    () => TbLectureRoundInfo,
    (tbLectureRoundInfo) => tbLectureRoundInfo.tbAttendanceInfo,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "time_id", referencedColumnName: "roundId" },
    { name: "lec_id", referencedColumnName: "lecId" },
  ])
  tbLectureRoundInfo: TbLectureRoundInfo;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbAttendanceInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;
}
