import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TbQstnOptionInfo } from "./TbQstnOptionInfo";
import { TbTestAnswerInfo } from "./TbTestAnswerInfo";
import { TbTestInfo } from "./TbTestInfo";
import { TbTestSubmitInfo } from "./TbTestSubmitInfo";

@Index("FK_tb_test_info_TO_tb_test_qstn_info", ["testId", "lecId"], {})
@Entity("tb_test_qstn_info", { schema: "lms_one" })
export class TbTestQstnInfo {
  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("int", { primary: true, name: "test_id" })
  testId: number;

  @Column("int", { primary: true, name: "qstn_id" })
  qstnId: number;

  @Column("int", { name: "allot_score" })
  allotScore: number;

  @Column("varchar", { name: "qstn_content", length: 2000 })
  qstnContent: string;

  @Column("int", { name: "qstn_number" })
  qstnNumber: number;

  @Column("datetime", { name: "qstn_reg_date" })
  qstnRegDate: Date;

  @OneToMany(
    () => TbQstnOptionInfo,
    (tbQstnOptionInfo) => tbQstnOptionInfo.tbTestQstnInfo
  )
  tbQstnOptionInfos: TbQstnOptionInfo[];

  @OneToMany(
    () => TbTestAnswerInfo,
    (tbTestAnswerInfo) => tbTestAnswerInfo.tbTestQstnInfo
  )
  tbTestAnswerInfos: TbTestAnswerInfo[];

  @ManyToOne(() => TbTestInfo, (tbTestInfo) => tbTestInfo.tbTestQstnInfos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "test_id", referencedColumnName: "testId" },
    { name: "lec_id", referencedColumnName: "lecId" },
  ])
  tbTestInfo: TbTestInfo;

  @OneToMany(
    () => TbTestSubmitInfo,
    (tbTestSubmitInfo) => tbTestSubmitInfo.tbTestQstnInfo
  )
  tbTestSubmitInfos: TbTestSubmitInfo[];
}
