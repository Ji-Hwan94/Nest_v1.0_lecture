import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbQstnOptionInfo } from "./TbQstnOptionInfo";
import { TbStudentsInfo } from "./TbStudentsInfo";
import { TbTestQstnInfo } from "./TbTestQstnInfo";

@Index(
  "FK_tb_test_qstn_info_TO_tb_test_submit_info",
  ["lecId", "testId", "qstnId"],
  {}
)
@Index(
  "FK_tb_qstn_option_info_TO_tb_test_submit_info",
  ["qstnId", "optionId", "testId", "lecId"],
  {}
)
@Index("FK_tb_students_info_TO_tb_test_submit_info", ["loginId"], {})
@Entity("tb_test_submit_info", { schema: "lms_one" })
export class TbTestSubmitInfo {
  @Column("int", { primary: true, name: "qstn_id" })
  qstnId: number;

  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "option_id" })
  optionId: number;

  @Column("varchar", { primary: true, name: "loginID", length: 50 })
  loginId: string;

  @Column("datetime", { name: "submit_date" })
  submitDate: Date;

  @ManyToOne(
    () => TbQstnOptionInfo,
    (tbQstnOptionInfo) => tbQstnOptionInfo.tbTestSubmitInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "qstn_id", referencedColumnName: "qstnId" },
    { name: "option_id", referencedColumnName: "optionId" },
    { name: "test_id", referencedColumnName: "testId" },
    { name: "lec_id", referencedColumnName: "lecId" },
  ])
  tbQstnOptionInfo: TbQstnOptionInfo;

  @ManyToOne(
    () => TbStudentsInfo,
    (tbStudentsInfo) => tbStudentsInfo.tbTestSubmitInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbStudentsInfo;

  @ManyToOne(
    () => TbTestQstnInfo,
    (tbTestQstnInfo) => tbTestQstnInfo.tbTestSubmitInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "lec_id", referencedColumnName: "lecId" },
    { name: "test_id", referencedColumnName: "testId" },
    { name: "qstn_id", referencedColumnName: "qstnId" },
  ])
  tbTestQstnInfo: TbTestQstnInfo;
}
