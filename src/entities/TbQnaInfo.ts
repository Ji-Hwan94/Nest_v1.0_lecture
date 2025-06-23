import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TbLectureInfo } from "./TbLectureInfo";
import { TbUserinfo } from "./TbUserinfo";

@Index("FK_tb_lecture_info_TO_tb_qna_info", ["lecId"], {})
@Index("FK_tb_userinfo_TO_tb_qna_info", ["loginId"], {})
@Entity("tb_qna_info", { schema: "lms_one" })
export class TbQnaInfo {
  @Column("int", { primary: true, name: "qna_id" })
  qnaId: number;

  @Column("int", { primary: true, name: "lec_id" })
  lecId: number;

  @Column("varchar", { name: "loginID", length: 50 })
  loginId: string;

  @Column("varchar", { name: "qna_answer", nullable: true, length: 2000 })
  qnaAnswer: string | null;

  @Column("varchar", { name: "qna_title", length: 50 })
  qnaTitle: string;

  @Column("varchar", { name: "qna_content", length: 2000 })
  qnaContent: string;

  @Column("datetime", { name: "qna_reg_date" })
  qnaRegDate: Date;

  @Column("datetime", { name: "qna_answer_date", nullable: true })
  qnaAnswerDate: Date | null;

  @ManyToOne(() => TbLectureInfo, (tbLectureInfo) => tbLectureInfo.tbQnaInfos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "lec_id", referencedColumnName: "lecId" }])
  lec: TbLectureInfo;

  @ManyToOne(() => TbUserinfo, (tbUserinfo) => tbUserinfo.tbQnaInfos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "loginID", referencedColumnName: "loginId" }])
  login: TbUserinfo;
}
