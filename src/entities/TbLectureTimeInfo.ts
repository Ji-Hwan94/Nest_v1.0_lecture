import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";

@Entity("tb_lecture_time_info", { schema: "lms_one" })
export class TbLectureTimeInfo {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { primary: true, name: "time_id", length: 50 })
  timeId: string;

  @Column("varchar", { name: "time_day", length: 5 })
  timeDay: string;

  @Column("datetime", { name: "time_start" })
  timeStart: Date;

  @Column("datetime", { name: "time_end" })
  timeEnd: Date;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbLectureTimeInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;
}
