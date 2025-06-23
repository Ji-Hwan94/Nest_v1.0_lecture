import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";
import { TbTestQstnInfo } from "./TbTestQstnInfo";
import { TbTestResultInfo } from "./TbTestResultInfo";

@Index("FK_tb_lecture_info_TO_tb_test_info", ["lecId"], {})
@Entity("tb_test_info", { schema: "lms_one" })
export class TbTestInfo {
  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("datetime", { name: "test_begin_date", nullable: true })
  testBeginDate: Date | null;

  @Column("datetime", { name: "test_end_date", nullable: true })
  testEndDate: Date | null;

  @Column("varchar", { name: "test_type", length: 1 })
  testType: string;

  @Column("datetime", { name: "test_reg_date" })
  testRegDate: Date;

  @ManyToOne(
    () => TbLectureInfo,
    (tbLectureInfo) => tbLectureInfo.tbTestInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;

  @OneToMany(
    () => TbTestQstnInfo,
    (tbTestQstnInfo) => tbTestQstnInfo.tbTestInfo
  )
  tbTestQstnInfos: TbTestQstnInfo[];

  @OneToMany(
    () => TbTestResultInfo,
    (tbTestResultInfo) => tbTestResultInfo.tbTestInfo
  )
  tbTestResultInfos: TbTestResultInfo[];
}
