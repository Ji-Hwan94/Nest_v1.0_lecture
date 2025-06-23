import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbStudentsInfo } from "./TbStudentsInfo";
import { TbTestInfo } from "./TbTestInfo";

@Index("FK_tb_students_info_TO_tb_test_result_info", ["loginId"], {})
@Entity("tb_test_result_info", { schema: "lms_one" })
export class TbTestResultInfo {
  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("int", { name: "test_score" })
  testScore: number;

  @Column("datetime", { name: "test_result_reg_date" })
  testResultRegDate: Date;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbTestResultInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;

  @ManyToOne(() => TbTestInfo, (tbTestInfo) => tbTestInfo.tbTestResultInfos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "test_id", referencedColumnName: "testId" },
    { name: "lec_id", referencedColumnName: "lecId" },
  ])
  tbTestInfo: TbTestInfo;
}
