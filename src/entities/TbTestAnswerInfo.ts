import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { TbQstnOptionInfo } from "./TbQstnOptionInfo";
import { TbTestQstnInfo } from "./TbTestQstnInfo";

@Index(
  "FK_tb_test_qstn_info_TO_tb_test_answer_info",
  ["lecId", "testId", "qstnId"],
  {}
)
@Index(
  "FK_tb_qstn_option_info_TO_tb_test_answer_info",
  ["qstnId", "optionId", "testId", "lecId"],
  {}
)
@Entity("tb_test_answer_info", { schema: "lms_one" })
export class TbTestAnswerInfo {
  @Column("int", { primary: true, name: "qstn_id" })
  qstnId: number;

  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "option_id" })
  optionId: number;

  @OneToOne(
    () => TbQstnOptionInfo,
    (tbQstnOptionInfo) => tbQstnOptionInfo.tbTestAnswerInfo,
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
    () => TbTestQstnInfo,
    (tbTestQstnInfo) => tbTestQstnInfo.tbTestAnswerInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "lec_id", referencedColumnName: "lecId" },
    { name: "test_id", referencedColumnName: "testId" },
    { name: "qstn_id", referencedColumnName: "qstnId" },
  ])
  tbTestQstnInfo: TbTestQstnInfo;
}
