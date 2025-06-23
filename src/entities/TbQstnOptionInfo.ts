import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { TbTestQstnInfo } from "./TbTestQstnInfo";
import { TbTestAnswerInfo } from "./TbTestAnswerInfo";
import { TbTestSubmitInfo } from "./TbTestSubmitInfo";

@Index(
  "FK_tb_test_qstn_info_TO_tb_qstn_option_info",
  ["lecId", "testId", "qstnId"],
  {}
)
@Entity("tb_qstn_option_info", { schema: "lms_one" })
export class TbQstnOptionInfo {
  @Column("int", { primary: true, name: "qstn_id" })
  qstnId: number;

  @Column("int", { primary: true, name: "option_id" })
  optionId: number;

  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { name: "option_content", nullable: true, length: 200 })
  optionContent: string | null;

  @Column("datetime", { name: "option_reg_date", nullable: true })
  optionRegDate: Date | null;

  @ManyToOne(
    () => TbTestQstnInfo,
    (tbTestQstnInfo) => tbTestQstnInfo.tbQstnOptionInfos,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([
    { name: "lec_id", referencedColumnName: "lecId" },
    { name: "test_id", referencedColumnName: "testId" },
    { name: "qstn_id", referencedColumnName: "qstnId" },
  ])
  tbTestQstnInfo: TbTestQstnInfo;

  @OneToOne(
    () => TbTestAnswerInfo,
    (tbTestAnswerInfo) => tbTestAnswerInfo.tbQstnOptionInfo
  )
  tbTestAnswerInfo: TbTestAnswerInfo;

  @OneToMany(
    () => TbTestSubmitInfo,
    (tbTestSubmitInfo) => tbTestSubmitInfo.tbQstnOptionInfo
  )
  tbTestSubmitInfos: TbTestSubmitInfo[];
}
